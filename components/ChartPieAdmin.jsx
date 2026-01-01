import axios from "axios";
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";

function ChartPieAdmin() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios
          .create({
            headers: {
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
            },
          })
          .get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/admin-dashboard/user-counts`
          );
        const newData = {
          labels: ["Registered Users", "Registered Sellers", "Registered Affiliates"],
          datasets: [
            {
              label: "# of Votes",
              data: [
                response.data.userCount,
                response.data.approvedSellersCount,
                response.data.affiliateCount
              ],
              backgroundColor: ["#1f628e", "#FED7AA", "#FFAB91"],
              borderWidth: 0,
            },
          ],
        };
        setChartData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array, runs once on component mount

  useEffect(() => {
    if (!chartData) return;

    const ctx = document.getElementById("pieChart").getContext("2d");
    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    const MyChart = new Chart(ctx, {
      type: "doughnut",
      data: chartData,
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        cutout: "70%",
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      MyChart.destroy();
    };
  }, [chartData]); // Runs whenever chartData changes

  return (
    <div className="px-7 py-7 rounded bg-orange-100">
      <h3 className={`text-xl text-blue-950 mb-7`}>User Engagement</h3>
      <div className="flex md:gap-9 gap-3 items-center">
        <div className="sm:w-[150px] sm:h-[150px] w-[80px] h-[80px]">
          <canvas id="pieChart"></canvas>
        </div>
        <div>
          {chartData &&
            chartData.labels.map((label, index) => (
              <div key={index} className="mb-3">
                <div className="flex gap-2 items-center">
                  <div
                    className={`h-2.5 w-2.5 rounded-full`}
                    style={{
                      backgroundColor:
                        chartData.datasets[0].backgroundColor[index],
                    }}
                  ></div>
                  <p className="text-sm font-medium text-slate-600">{label}</p>
                  <p className="text-xs text-gray-500">
                    ({chartData.datasets[0].data[index]})
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ChartPieAdmin;
