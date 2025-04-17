import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import EditMenu from '../../components/DropdownEditMenu';
import useStore from '../../store';
import { formatValue } from '../../utils/Utils';
// Import utilities
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

function DashboardCard01() {

  const [totalInvestmentAmount, setTotalInvestmentAmount] = useState(0);
  const [totalInvestmentValue, setTotalInvestmentValue] = useState(0);
  const { getTotalInvestmentAmount, getTotalInvestmentValue, getMonthlyTotalInvestmentAmount, getMonthlyTotalInvestmentValue, startDate, activeDay } = useStore();
  const [chartData, setChartData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {

    const populateChartData = async () => {
      setIsLoading(true);
      const [monthlyInvestmentAmounts, monthlyInvestmentValues, amount, value] = await Promise.all([getMonthlyTotalInvestmentAmount(startDate, activeDay), getMonthlyTotalInvestmentValue(startDate, activeDay), getTotalInvestmentAmount(startDate, activeDay), getTotalInvestmentValue(startDate, activeDay)]);
      setTotalInvestmentAmount(amount);
      setTotalInvestmentValue(value);
      // console.log("monthlyInvestmentAmounts", monthlyInvestmentAmounts);
      // console.log("monthlyInvestmentValues", monthlyInvestmentValues);

      const chartData = {
        labels: Object.keys(monthlyInvestmentAmounts),
        datasets: [
          // Indigo line
          {
            data: Object.values(monthlyInvestmentValues),
            // data: [732, 610, 610, 504, 504, 504, 349, 349, 504, 342, 504, 610, 391, 192, 154, 273, 191, 191, 126, 263, 349, 252, 423, 622, 470, 532],
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
          },
          // Gray line
          {
            data: Object.values(monthlyInvestmentAmounts),
            // data: [532, 532, 532, 404, 404, 314, 314, 314, 314, 314, 234, 314, 234, 234, 314, 314, 314, 388, 314, 202, 202, 202, 202, 314, 720, 642],
            // borderColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
            borderColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointBackgroundColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
            pointHoverBackgroundColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
            pointBorderWidth: 0,
            pointHoverBorderWidth: 0,
            clip: 20,
            tension: 0.2,
          },
        ],
      };
      // console.log("chartData", chartData);
      setChartData(chartData);
      setIsLoading(false);
    };
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
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Net Worth</h2>
        </header>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Current</div>
            <div className="flex items-start">
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{formatValue(totalInvestmentValue)}</div>
              {/* <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">+49%</div> */}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Invested</div>
            <div className="flex items-start">
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{formatValue(totalInvestmentAmount)}</div>
              {/* <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">+49%</div> */}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grow max-sm:max-h-[150px] xl:max-h-[150px]">
        <LineChart data={chartData} width={389} height={128} />
      </div></>)}
    </div>
  );
}

export default DashboardCard01;
