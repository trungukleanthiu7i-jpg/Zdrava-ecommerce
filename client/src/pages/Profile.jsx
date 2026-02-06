import { useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { UserContext } from "../context/UserContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Profile.scss";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t } = useTranslation();

  const { user: contextUser, loginUser } = useContext(UserContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  /* 👁 Password visibility */
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  /* 📝 FORM STATE */
  const [form, setForm] = useState({
    email: "",
    phone: "",
    accountType: "individual", // individual | company
    shippingAddress: {
      country: "",
      city: "",
      addressLine: "",
      postalCode: "",
    },
    company: {
      companyName: "",
      vatNumber: "",
      email: "",
      phone: "",
      invoiceAddress: {
        country: "",
        city: "",
        addressLine: "",
        postalCode: "",
      },
    },
    oldPassword: "",
    newPassword: "",
  });

  /* =============================
     FETCH PROFILE
  ============================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get("/users/me");
        const data = res.data;

        setUser(data);

        setForm((prev) => ({
          ...prev,
          email: data.email || "",
          phone: data.phone || "",
          accountType: data.accountType || "individual",
          shippingAddress: {
            country: data.shippingAddress?.country || "",
            city: data.shippingAddress?.city || "",
            addressLine: data.shippingAddress?.addressLine || "",
            postalCode: data.shippingAddress?.postalCode || "",
          },
          company: {
            companyName: data.company?.companyName || "",
            vatNumber: data.company?.vatNumber || "",
            email: data.company?.email || "",
            phone: data.company?.phone || "",
            invoiceAddress: {
              country: data.company?.invoiceAddress?.country || "",
              city: data.company?.invoiceAddress?.city || "",
              addressLine: data.company?.invoiceAddress?.addressLine || "",
              postalCode: data.company?.invoiceAddress?.postalCode || "",
            },
          },
        }));
      } catch (err) {
        console.error("❌ Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    if (contextUser) fetchProfile();
    else setLoading(false);
  }, [contextUser]);

  /* =============================
     SAVE PROFILE
  ============================= */
  const handleSaveProfile = async () => {
    try {
      const payload = {
        email: form.email,
        phone: form.phone,
        accountType: form.accountType,
        shippingAddress: form.shippingAddress,
      };

      if (form.accountType === "company") {
        payload.company = form.company;
      }

      const res = await axiosClient.put("/users/me", payload);

      setUser(res.data);
      loginUser(res.data);
      setEditing(false);
      alert(t("Profile updated successfully"));
    } catch (err) {
      alert(err.response?.data?.message || t("Failed to save profile"));
    }
  };

  /* =============================
     CHANGE PASSWORD
  ============================= */
  const handleChangePassword = async () => {
    try {
      await axiosClient.put("/users/me/password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      alert(t("Password updated successfully"));

      setForm((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      alert(err.response?.data?.message || t("Failed to change password"));
    }
  };

  if (loading) return <p>{t("Loading profile...")}</p>;
  if (!user) return <p>{t("Profile not available.")}</p>;

  return (
    <div className="profile-container">
      <h2>{t("My Profile")}</h2>

      {/* ================= BASIC INFO ================= */}
      <div className="profile-card">
        <div className="profile-row">
          <span className="label">{t("Username")}</span>
          <span className="value">{user.username}</span>
        </div>

        <div className="profile-row">
          <span className="label">{t("Account Type")}</span>
          {editing ? (
            <select
              value={form.accountType}
              onChange={(e) => setForm({ ...form, accountType: e.target.value })}
            >
              <option value="individual">{t("Individual")}</option>
              <option value="company">{t("Company (B2B)")}</option>
            </select>
          ) : (
            <span className="value">
              {form.accountType === "company" ? t("Company") : t("Individual")}
            </span>
          )}
        </div>

        {["email", "phone"].map((field) => (
          <div className="profile-row" key={field}>
            <span className="label">{t(field === "email" ? "Email" : "Phone")}</span>
            {editing ? (
              <input
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            ) : (
              <span className="value">{user[field] || "-"}</span>
            )}
          </div>
        ))}
      </div>

      {/* ================= COMPANY (B2B) ================= */}
      {form.accountType === "company" && (
        <div className="profile-card">
          <h3>{t("Company Information")}</h3>

          {[
            { key: "companyName", label: "Company Name" },
            { key: "vatNumber", label: "VAT Number" },
            { key: "email", label: "Company Email" },
            { key: "phone", label: "Company Phone" },
          ].map((f) => (
            <div className="profile-row" key={f.key}>
              <span className="label">{t(f.label)}</span>
              {editing ? (
                <input
                  value={form.company[f.key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      company: {
                        ...form.company,
                        [f.key]: e.target.value,
                      },
                    })
                  }
                />
              ) : (
                <span className="value">{user.company?.[f.key] || "-"}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= SAVE BUTTON ================= */}
      <div className="profile-card">
        {!editing ? (
          <button className="save-btn" onClick={() => setEditing(true)}>
            {t("Edit Profile")}
          </button>
        ) : (
          <button className="save-btn" onClick={handleSaveProfile}>
            {t("Save Profile")}
          </button>
        )}
      </div>

      {/* ================= PASSWORD ================= */}
      <div className="profile-card">
        <h3>{t("Change Password")}</h3>

        {[
          {
            label: "Old Password",
            value: form.oldPassword,
            setter: (v) => setForm({ ...form, oldPassword: v }),
            visible: showOldPassword,
            toggle: () => setShowOldPassword((v) => !v),
          },
          {
            label: "New Password",
            value: form.newPassword,
            setter: (v) => setForm({ ...form, newPassword: v }),
            visible: showNewPassword,
            toggle: () => setShowNewPassword((v) => !v),
          },
        ].map((p) => (
          <div className="profile-row" key={p.label}>
            <span className="label">{t(p.label)}</span>
            <div className="password-input">
              <input
                type={p.visible ? "text" : "password"}
                value={p.value}
                onChange={(e) => p.setter(e.target.value)}
              />
              <button type="button" className="eye-btn" onClick={p.toggle}>
                {p.visible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        ))}

        <button className="save-btn" onClick={handleChangePassword}>
          {t("Update Password")}
        </button>
      </div>
    </div>
  );
}
