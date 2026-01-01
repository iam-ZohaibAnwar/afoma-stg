import { useEffect } from "react";
import Chart from "chart.js/auto";

function ChartBarAdmin() {
  useEffect(() => {
    const ctx = document.getElementById("barChart").getContext("2d");

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "",
          "Country 1",
          "Country 2",
          "Country 3",
          "Country 4",
          "Country 5",
          "Country 6",
          "Country 7",
        ],
        datasets: [
          {
            data: [0, 65, 60, 175, 65, 140, 130, 150],
            backgroundColor: ["#1F628E"],
            borderColor: ["#1F628E"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false, // This will hide the y-axis line
            },
            ticks: {
              display: true, // This will keep the y-axis ticks visible
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
    return () => {
      myChart.destroy();
    };
  }, []);

  return (
    <>
      <div className="flex gap-20">
        <div className="w-full mb-10 bg-orange-50">
          <h3 className="text-lg text-blue-950 mb-6">Sales Count by Country</h3>
          <div className="mb-9 flex items-center gap-1.5">
            <div className="bg-primary w-2 h-2 rounded-full shrink-0"></div>
            <p className="text-xs  text-slate-600">Sales</p>
          </div>
          <canvas id="barChart"></canvas>
        </div>
        <div className="bg-orange-100 px-7 py-9  rounded">
          <h3 className="text-blue-950 mb-2.5 ">Country 1</h3>
          <div className="flex gap-2.5 items-center mb-8">
            <div className="flex">
              <div className="h-5 w-[251px] bg-primary"></div>
              <div className="h-5 w-[15px] bg-white"></div>
            </div>
            <p className="text-slate-600 text-sm">250</p>
          </div>
          <h3 className="text-blue-950 mb-2.5 ">Country 2</h3>
          <div className="flex gap-2.5 items-center mb-8">
            <div className="flex">
              <div className="h-5 w-[226px] bg-primary"></div>
              <div className="h-5 w-[40px] bg-white"></div>
            </div>
            <p className="text-slate-600 text-sm">200</p>
          </div>
          <h3 className="text-blue-950 mb-2.5 ">Country 3</h3>
          <div className="flex gap-2.5 items-center mb-8">
            <div className="flex">
              <div className="h-5 w-[248px] bg-primary"></div>
              <div className="h-5 w-[18px] bg-white"></div>
            </div>
            <p className="text-slate-600 text-sm">143</p>
          </div>
          <h3 className="text-blue-950 mb-2.5 ">Country 4</h3>
          <div className="flex gap-2.5 items-center ">
            <div className="flex">
              <div className="h-5 w-[248px] bg-primary"></div>
              <div className="h-5 w-[18px] bg-white"></div>
            </div>
            <p className="text-slate-600 text-sm">140</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChartBarAdmin;
