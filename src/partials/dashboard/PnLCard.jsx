import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChartDecimal';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import useStore from '../../store';
// Import utilities
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';
import { formatValue, formatDecimal } from '../../utils/Utils';

function DashboardCard02() {

  const { getTotalReturnAmount, getTotalReturnPercentage, getMonthlyTotalReturnPercentage, getTodaysTotalReturnAmount, getTodaysTotalReturnPercentage, startDate, activeDay } = useStore();
  const [totalReturnAmount, setTotalReturnAmount] = useState(0);
  const [totalReturnPercentage, setTotalReturnPercentage] = useState(0);
  const [todaysReturnAmount, setTodaysReturnAmount] = useState(0);
  const [todaysReturnPercentage, setTodaysReturnPercentage] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {

    const populateChartData = async () => {
      setIsLoading(true);
      const [totalReturnAmount, totalReturnPercentage, todayReturnAmount, todayReturnPercentage, monthlyReturnPercentages] = await Promise.all([getTotalReturnAmount(startDate, activeDay), getTotalReturnPercentage(startDate, activeDay), getTodaysTotalReturnAmount(startDate, activeDay), getTodaysTotalReturnPercentage(startDate, activeDay), getMonthlyTotalReturnPercentage(startDate, activeDay)]);

      setTotalReturnAmount(totalReturnAmount);
      setTotalReturnPercentage(totalReturnPercentage);
      setTodaysReturnAmount(todayReturnAmount);
      setTodaysReturnPercentage(todayReturnPercentage);

      const chartData = {
        labels: Object.keys(monthlyReturnPercentages),
        datasets: [
          // Indigo line
          {
            data: Object.values(monthlyReturnPercentages),
            fill: true,
            backgroundColor: function (context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              return chartAreaGradient(ctx, chartArea, [
                { stop: 0, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0) },
                { stop: 1, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.2) }
              ]);
            },
            borderColor: getCssVariable('--color-violet-500'),
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointBackgroundColor: getCssVariable('--color-violet-500'),
            pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
            pointBorderWidth: 0,
            pointHoverBorderWidth: 0,
            clip: 20,
            tension: 0.2,
          }
        ]
      };

      setChartData(chartData);
      setIsLoading(false);
    }
    populateChartData();
  }, [startDate, activeDay]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-10 xl:col-span-10 bg-white dark:bg-gray-800 h-[18rem] shadow-xs rounded-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (<>
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">P&L</h2>
          {/* Menu button */}
          {/* <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                Option 1
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                Option 2
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3" to="#0">
                Remove
              </Link>
            </li>
          </EditMenu> */}
        </header>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Overall</div>
            <div className="flex items-start">
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{formatValue(totalReturnAmount)}</div>
              <div className={`text-sm font-medium ${totalReturnPercentage > 0 ? 'text-green-700 bg-green-500/20' : 'text-red-700 bg-red-500/20'} px-1.5 rounded-full`}>{totalReturnPercentage > 0 ? formatDecimal(totalReturnPercentage, true) : formatDecimal(totalReturnPercentage, false)}%</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Today</div>
            <div className="flex items-start">
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{formatValue(todaysReturnAmount)}</div>
              <div className={`text-sm font-medium ${todaysReturnPercentage >= 0 ? 'text-green-700 bg-green-500/20' : 'text-red-700 bg-red-500/20'} px-1.5 rounded-full`}>{todaysReturnPercentage >= 0 ? formatDecimal(todaysReturnPercentage, true) : formatDecimal(todaysReturnPercentage, false)}%</div>
            </div>
          </div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow max-sm:max-h-[150px] max-h-[150px]">
        {/* Change the height attribute to adjust the chart height */}
        <LineChart data={chartData} width={389} height={128} />
      </div>
      </>)}
    </div>
  );
}

export default DashboardCard02;
