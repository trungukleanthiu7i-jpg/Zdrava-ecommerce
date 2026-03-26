import fs from "fs";
import path from "path";
import crypto from "crypto";

/* ======================================================
   ENV
====================================================== */
const NETOPIA_SIGNATURE = process.env.NETOPIA_SIGNATURE;
const NETOPIA_IS_LIVE = String(process.env.NETOPIA_IS_LIVE) === "true";
const NETOPIA_PUBLIC_CERT_PATH = process.env.NETOPIA_PUBLIC_CERT_PATH;
const NETOPIA_PRIVATE_KEY_PATH = process.env.NETOPIA_PRIVATE_KEY_PATH;
const NETOPIA_CONFIRM_URL = process.env.NETOPIA_CONFIRM_URL;
const NETOPIA_RETURN_URL = process.env.NETOPIA_RETURN_URL;

const NETOPIA_LIVE_URL = "https://secure.mobilpay.ro";
const NETOPIA_SANDBOX_URL = "https://sandboxsecure.mobilpay.ro";

/* ======================================================
   HELPERS
====================================================== */
function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatTimestamp(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}${mm}${dd}${hh}${mi}${ss}`;
}

function resolveCertPath(relativeOrAbsolutePath) {
  if (!relativeOrAbsolutePath) {
    throw new Error("Missing NETOPIA certificate path in env.");
  }

  return path.isAbsolute(relativeOrAbsolutePath)
    ? relativeOrAbsolutePath
    : path.resolve(process.cwd(), relativeOrAbsolutePath);
}

function readFileSafe(filePath, isPrivate = false) {
  const base64 = isPrivate
    ? process.env.NETOPIA_PRIVATE_KEY_BASE64
    : process.env.NETOPIA_PUBLIC_CERT_BASE64;

  if (base64) {
    console.log(
      `✅ Using NETOPIA ${isPrivate ? "private key" : "public cert"} from ENV`
    );
    return Buffer.from(base64, "base64");
  }

  const resolvedPath = resolveCertPath(filePath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`NETOPIA file not found: ${resolvedPath}`);
  }

  return fs.readFileSync(resolvedPath);
}

function isPem(buffer) {
  const text = buffer.toString("utf8");
  return text.includes("-----BEGIN");
}

function getNetopiaPublicKey() {
  const raw = readFileSafe(NETOPIA_PUBLIC_CERT_PATH, false);

  if (isPem(raw)) {
    try {
      return crypto.createPublicKey(raw);
    } catch (err) {
      throw new Error(
        `Invalid NETOPIA public certificate/key (PEM): ${err.message}`
      );
    }
  }

  try {
    const x509 = new crypto.X509Certificate(raw);
    return x509.publicKey;
  } catch (err) {
    throw new Error(
      `Invalid NETOPIA public certificate (DER/PEM): ${err.message}`
    );
  }
}

function getNetopiaPrivateKey() {
  const raw = readFileSafe(NETOPIA_PRIVATE_KEY_PATH, true);

  if (isPem(raw)) {
    try {
      return crypto.createPrivateKey(raw);
    } catch (err) {
      throw new Error(`Invalid NETOPIA private key (PEM): ${err.message}`);
    }
  }

  const attempts = [
    { format: "der", type: "pkcs8" },
    { format: "der", type: "pkcs1" },
  ];

  for (const opts of attempts) {
    try {
      return crypto.createPrivateKey({
        key: raw,
        ...opts,
      });
    } catch (err) {
      // try next format
    }
  }

  throw new Error(
    "Invalid NETOPIA private key. Could not parse as PEM, DER PKCS#8, or DER PKCS#1."
  );
}

/* ======================================================
   XML BUILDER
   NETOPIA v1.x expects an XML order request
====================================================== */
export function buildNetopiaOrderXml({
  orderId,
  amount,
  currency = "RON",
  details = "Online payment",
  customerType = "person",
  firstName = "",
  lastName = "",
  email = "",
  address = "",
  mobilePhone = "",
  confirmUrl = NETOPIA_CONFIRM_URL,
  returnUrl = NETOPIA_RETURN_URL,
}) {
  const timestamp = formatTimestamp();

  return `<?xml version="1.0" encoding="utf-8"?>
<order type="card" id="${escapeXml(orderId)}" timestamp="${timestamp}">
  <signature>${escapeXml(NETOPIA_SIGNATURE)}</signature>
  <invoice currency="${escapeXml(currency)}" amount="${Number(amount).toFixed(
    2
  )}">
    <details>${escapeXml(details)}</details>
    <contact_info>
      <billing type="${escapeXml(customerType)}">
        <first_name>${escapeXml(firstName)}</first_name>
        <last_name>${escapeXml(lastName)}</last_name>
        <email>${escapeXml(email)}</email>
        <address>${escapeXml(address)}</address>
        <mobile_phone>${escapeXml(mobilePhone)}</mobile_phone>
      </billing>
    </contact_info>
  </invoice>
  <ipn_cipher>aes-256-cbc</ipn_cipher>
  <url>
    <confirm>${escapeXml(confirmUrl)}</confirm>
    <return>${escapeXml(returnUrl)}</return>
  </url>
</order>`;
}

/* ======================================================
   ENCRYPT REQUEST
   NETOPIA v1.x uses env_key + data, with optional cipher/iv
====================================================== */
export function encryptNetopiaRequest(xmlString) {
  const publicKey = getNetopiaPublicKey();

  const symmetricKey = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", symmetricKey, iv);
  let encryptedData = cipher.update(xmlString, "utf8", "base64");
  encryptedData += cipher.final("base64");

  const envKey = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    symmetricKey
  );

  return {
    env_key: envKey.toString("base64"),
    data: encryptedData,
    cipher: "aes-256-cbc",
    iv: iv.toString("base64"),
  };
}

/* ======================================================
   BUILD REDIRECT PAYLOAD
====================================================== */
export function createNetopiaPaymentPayload({
  orderId,
  amount,
  currency,
  details,
  customer,
  shippingAddress,
  customerType,
}) {
  if (!NETOPIA_SIGNATURE) {
    throw new Error("Missing NETOPIA_SIGNATURE in env.");
  }

  const isCompany = customerType === "company";
  const fullName = customer?.fullName || "";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  const firstName = !isCompany ? parts[0] || "Client" : "Company";
  const lastName = !isCompany
    ? parts.slice(1).join(" ") || "Customer"
    : "Client";

  const xml = buildNetopiaOrderXml({
    orderId,
    amount,
    currency,
    details,
    customerType: isCompany ? "company" : "person",
    firstName,
    lastName,
    email: customer?.email || "",
    address: shippingAddress?.addressLine || "",
    mobilePhone: customer?.phone || "",
  });

  const encrypted = encryptNetopiaRequest(xml);

  return {
    url: NETOPIA_IS_LIVE ? NETOPIA_LIVE_URL : NETOPIA_SANDBOX_URL,
    ...encrypted,
    xml,
  };
}

/* ======================================================
   DECRYPT CONFIRM/IPN RESPONSE
====================================================== */
export function decryptNetopiaResponse({
  env_key,
  data,
  iv,
  cipher = "aes-256-cbc",
}) {
  const privateKey = getNetopiaPrivateKey();

  const symmetricKey = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(env_key, "base64")
  );

  const decipher = crypto.createDecipheriv(
    cipher,
    symmetricKey,
    Buffer.from(iv, "base64")
  );

  let decrypted = decipher.update(data, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/* ======================================================
   VERY LIGHT XML PARSER
====================================================== */
function extractTag(xml, tagName) {
  const regex = new RegExp(
    `<${tagName}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`,
    "i"
  );
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

function extractTagAttribute(xml, tagName, attrName) {
  const regex = new RegExp(
    `<${tagName}[^>]*\\s${attrName}="([^"]*)"[^>]*>`,
    "i"
  );
  const match = xml.match(regex);
  return match ? match[1] : "";
}

export function parseNetopiaIpnXml(xml) {
  return {
    orderId: extractTagAttribute(xml, "order", "id"),
    action: extractTag(xml, "action"),
    purchaseId: extractTag(xml, "purchase"),
    crc: extractTagAttribute(xml, "mobilpay", "crc"),
    errorCode: extractTagAttribute(xml, "error", "code"),
    errorMessage: extractTag(xml, "error"),
    originalAmount: extractTag(xml, "original_amount"),
    processedAmount: extractTag(xml, "processed_amount"),
  };
}

/* ======================================================
   SUCCESS RULE
====================================================== */
export function isNetopiaPaymentSuccessful(ipnData) {
  const okCode = String(ipnData?.errorCode || "") === "0";
  const action = String(ipnData?.action || "").toLowerCase();

  return (
    okCode &&
    ["paid", "confirmed", "paid_pending", "confirmed_pending"].includes(action)
  );
}

/* ======================================================
   MERCHANT XML ACK
====================================================== */
export function buildNetopiaAckXml({
  errorType = null,
  errorCode = null,
  message = "",
} = {}) {
  if (errorType && errorCode) {
    return `<?xml version="1.0" encoding="utf-8"?>
<crc error_type="${errorType}" error_code="${errorCode}">${escapeXml(
      message
    )}</crc>`;
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<crc>${escapeXml(message || "OK")}</crc>`;
}