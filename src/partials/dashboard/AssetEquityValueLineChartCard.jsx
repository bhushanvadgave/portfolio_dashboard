import React, { useEffect, useState } from 'react';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import LineChart from '../../charts/LineChart03';
import useStore from '../../store';
// Import utilities
import { getCssVariable, adjustColorOpacity } from '../../utils/Utils';

function DashboardCard08() {


  const { getMonthlyValueByAsset, getMonthYearList, getAsset, startDate, activeDay, domesticEquityAssetsWithInvestments} = useStore();
  const [chartData, setChartData] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(Object.keys(domesticEquityAssetsWithInvestments)[0]);
  
 useEffect(() => {
  const populateChartData = async () => {
    const [data]  = await Promise.all([getMonthlyValueByAsset(startDate, activeDay, selectedAsset)]);
    // console.log("monthly return percentage by asset type", data);
    // console.log("month year list", monthYearList);
    const chartData = {
      labels: Object.keys(data),
      datasets: [{
          label: domesticEquityAssetsWithInvestments[selectedAsset].name,
          data: Object.values(data),
          fill: true,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable(`--color-violet-500`), 0) },
            { stop: 1, color: adjustColorOpacity(getCssVariable(`--color-violet-500`), 0.2) }
          ]);
        },
          borderColor: getCssVariable(`--color-violet-300`),
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: getCssVariable(`--color-violet-500`),
          pointHoverBackgroundColor: getCssVariable(`--color-violet-500`),
          pointBorderWidth: 0,
          pointHoverBorderWidth: 0,
          clip: 20,
          tension: 0.2,
        }
      ]
    };
    setChartData(chartData);
  };
  populateChartData();
 }, [startDate, activeDay, selectedAsset]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-13 xl:col-span-13 bg-white dark:bg-gray-800 shadow-xs rounded-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Equity Value Over Time</h2>
        <div className="ml-auto relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none">
            {domesticEquityAssetsWithInvestments[selectedAsset].name}
            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {dropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-50 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="py-1" role="menu">
                {Object.keys(domesticEquityAssetsWithInvestments).map(k=>(
                <a key={k} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem" onClick={()=>setSelectedAsset(k)}>{domesticEquityAssetsWithInvestments[k].name}</a>)
              )}
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      {chartData && <LineChart data={chartData} width={595} height={248} />}
    </div>
  );
}

export default DashboardCard08;
