import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { FaChartBar, FaBoxOpen, FaUser, FaCheckCircle } from "react-icons/fa";
import "../styles/StatsSection.scss";

const statsData = [
  { id: 1, icon: <FaBoxOpen />, value: 580, label: "Products" },
  { id: 2, icon: <FaChartBar />, value: 4247, label: "Statistics" },
  { id: 3, icon: <FaUser />, value: 1000, label: "Clients" },
  { id: 4, icon: <FaCheckCircle />, value: 100, label: "Quality" },
];

const StatsSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="stats-section" ref={ref}>
      <div className="stats-container">
        {statsData.map((item) => (
          <div key={item.id} className="stat-item">
            <div className="stat-icon">{item.icon}</div>
            <h2 className="stat-number">
              {inView ? <CountUp end={item.value} duration={2.5} /> : 0}
            </h2>
            <p className="stat-label">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
