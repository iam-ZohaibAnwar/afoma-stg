import { Fragment, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import { Menu, Transition } from "@headlessui/react";

function YourPage() {
  const [commissionRate, setCommissionRate] = useState("This Month");
  const handleCommissionRate = (menuItem, id) => {
    setCommissionRate(menuItem);
  };
  useEffect(() => {
    // Code to create or update the chart
    const ctx = document.getElementById("myChart").getContext("2d");

    // Check if a chart instance already exists
    const existingChart = Chart.getChart(ctx);

    // Destroy the existing chart if it exists
    if (existingChart) {
      existingChart.destroy();
    }

    // Create a new chart
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "",
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            data: [30, 70, 50, 170, 90, 140, 130, 150, 140, 190, 140, 110, 190],
            backgroundColor: ["#1F628E"],
            borderColor: ["#1F628E"],
            borderWidth: 0.5,
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
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    // Cleanup on component unmount
    return () => {
      myChart.destroy();
    };
  }, []); // Empty dependency array to ensure the effect runs only once

  return (
    <>
      <div className="w-auto mb-10">
        <div className="mb-6 flex flex-row justify-between items-center">
          {" "}
          <h3 className="text-lg text-blue-950 ">Product Count</h3>
          <div className="flex gap-1.5 items-center border border-[#47556980] w-[124px] rounded px-2.5 pt-4 pb-3">
            <Menu as="div" className="relative ">
              <div>
                <Menu.Button
                  className={`flex items-center justify-center rounded-full cursor-pointer   gap-2 text-center text-slate-600 font-medium text-sm transition-colors ease-in `}
                >
                  {commissionRate}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="9.211"
                    height="5.411"
                    viewBox="0 0 9.211 5.411"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="9.211"
                      height="5.411"
                      viewBox="0 0 9.211 5.411"
                    >
                      <path
                        d="M24.23,44.615a.383.383,0,0,1-.272-.113l-3.846-3.846a.385.385,0,0,1,.544-.544l3.574,3.574L27.8,40.112a.385.385,0,1,1,.544.544L24.5,44.5a.383.383,0,0,1-.272.113Z"
                        transform="translate(-19.625 -39.579)"
                        fill="#172554"
                        stroke="#172554"
                        strokeWidth="0.75"
                      />
                    </svg>
                  </svg>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-200"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute -left-3 top-8  mt-2 w-32 md:w-36 origin-top-right rounded bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                  <div className="py-2 px-3">
                    <Menu.Item>
                      <button
                        className={`${
                          commissionRate === "This Month"
                        } flex items-center justify-center py-1 text-slate-600 font-medium text-sm`}
                        onClick={() => handleCommissionRate("This Month")}
                      >
                        This Month
                      </button>
                    </Menu.Item>

                    <Menu.Item>
                      <button
                        className={`${
                          commissionRate === "Last Month"
                        } flex items-center justifycenter py-1 text-slate-600 font-medium text-sm`}
                        onClick={() => handleCommissionRate("Last Month")}
                      >
                        Last Month
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        className={`${
                          commissionRate === "This Year"
                        } flex items-center justify-center py-1 text-slate-600 font-medium text-sm`}
                        onClick={() => handleCommissionRate("This Year")}
                      >
                        This Year
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            {/* <p className="text-slate-600 font-medium text-sm">This Month</p>
            <FontAwesomeIcon
              icon={faAngleDown}
              className="text-xs text-blue-950"
            ></FontAwesomeIcon> */}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mb-4">
          <div className="bg-primary h-[7px] w-[7px] rounded-full"></div>
          <p>No. of products sold</p>
        </div>
        <div className="w-full">
          <canvas id="myChart"></canvas>
        </div>
      </div>
    </>
  );
}

export default YourPage;
