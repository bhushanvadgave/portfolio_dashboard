import React, { useState, useEffect } from 'react';
import DoughnutChart from '../../charts/DoughnutChart';
import useStore from '../../store';
import { formatDecimal } from '../../utils/Utils';
// Import utilities
import { getCssVariable } from '../../utils/Utils';

function DashboardCard06() {

  const { getAssetAllocationPercentage, getAssetType, startDate, activeDay } = useStore();

  const [chartData, setChartData] = useState();

  useEffect(() => {
    const fetchAssetAllocation = async () => {
      const assetAllocation = await getAssetAllocationPercentage(startDate, activeDay);
      console.log(assetAllocation);

      const chartData = {
        labels: Object.keys(assetAllocation).map(key=>getAssetType(key).name),
        datasets: [
          {
            label: '% of investment allocated',
            data: Object.values(assetAllocation).map(value=>formatDecimal(value, true)),
            backgroundColor: Object.keys(assetAllocation).map(k=>{
              const assetType = getAssetType(k);
              return getCssVariable(`--color-${assetType.color}-400`)
            }),
            hoverBackgroundColor: Object.keys(assetAllocation).map(k=>{
              const assetType = getAssetType(k);
              return getCssVariable(`--color-${assetType.color}-600`)
            }),
            borderWidth: 0,
          },
        ],
      };
      setChartData(chartData);
    };
    fetchAssetAllocation();
  }, [startDate, activeDay]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Asset Allocation</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
    {chartData && <DoughnutChart data={chartData} width={389} height={220} />}
    </div>
  );
}

export default DashboardCard06;
