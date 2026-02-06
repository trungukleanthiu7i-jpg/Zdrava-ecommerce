import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { FaChartBar, FaBoxOpen, FaUser, FaCheckCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../styles/StatsSection.scss";

const StatsSection = () => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  const statsData = [
    { id: 1, icon: <FaBoxOpen />, value: 580, labelKey: "Products" },
    { id: 2, icon: <FaChartBar />, value: 4247, labelKey: "Statistics" },
    { id: 3, icon: <FaUser />, value: 1000, labelKey: "Clients" },
    { id: 4, icon: <FaCheckCircle />, value: 100, labelKey: "Quality" },
  ];

  return (
    <section className="stats-section" ref={ref}>
      <div className="stats-container">
        {statsData.map((item) => (
          <div key={item.id} className="stat-item">
            <div className="stat-icon">{item.icon}</div>

            <h2 className="stat-number">
              {inView ? <CountUp end={item.value} duration={2.5} /> : 0}
            </h2>

            <p className="stat-label">{t(item.labelKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
