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
      data: [40, 10],
      backgroundColor: ["#82ca9d", "#f87e03"],
      borderWidth: 1,
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
