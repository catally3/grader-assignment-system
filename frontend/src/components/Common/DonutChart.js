import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

const data = {
  labels: ["Assigned", "Unassigned"],
  datasets: [
    {
      label: "Courses",
      data: [120, 5],
      backgroundColor: ["#f87e03", "#f0f0f0"],
      borderWidth: 1,
      borderRadius: "20px",
    },
  ],
};

const DoughnutChart = () => {
  return (
    <div style={{ width: "300px", height: "300px" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
