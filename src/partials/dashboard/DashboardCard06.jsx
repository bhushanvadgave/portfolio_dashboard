import React, { useState, useEffect } from 'react';
import DoughnutChart from '../../charts/DoughnutChart';
import useStore from '../../store';
// Import utilities
import { getCssVariable } from '../../utils/Utils';

function DashboardCard06() {

  const chartData = {
    labels: ['United States', 'Italy', 'Other'],
    datasets: [
      {
        label: 'Top Countries',
        data: [
          35, 30, 35,
        ],
        backgroundColor: [
          getCssVariable('--color-violet-500'),
          getCssVariable('--color-sky-500'),
          getCssVariable('--color-violet-800'),
        ],
        hoverBackgroundColor: [
          getCssVariable('--color-violet-600'),
          getCssVariable('--color-sky-600'),
          getCssVariable('--color-violet-900'),
        ],
        borderWidth: 0,
      },
    ],
  };
  const { getAssetAllocationPercentage } = useStore();

  // const [chartData, setChartData] = useState();

  useEffect(() => {
    const fetchAssetAllocation = async () => {
      const assetAllocation = await getAssetAllocationPercentage(new Date(), new Date());
      console.log(assetAllocation);
      // setChartData(assetAllocation);
    };
    fetchAssetAllocation();
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Asset Allocation</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
    {chartData && <DoughnutChart data={chartData} width={389} height={260} />}
    </div>
  );
}

export default DashboardCard06;
