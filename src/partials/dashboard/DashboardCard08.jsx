import React, { useEffect, useState } from 'react';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import LineChart from '../../charts/LineChart02';
import useStore from '../../store';
// Import utilities
import { getCssVariable } from '../../utils/Utils';

function DashboardCard08() {


  const { getMonthlyReturnPercentageByAssetType, getMonthYearList, getAssetType, startDate, activeDay } = useStore();
  const [chartData, setChartData] = useState();

 useEffect(() => {
  const populateChartData = async () => {
    const data = await getMonthlyReturnPercentageByAssetType(startDate, activeDay);
    console.log("monthly return percentage by asset type", data);
    const monthYearList = await getMonthYearList(startDate, activeDay);
    console.log("month year list", monthYearList);
    const chartData = {
      labels: monthYearList,
      datasets: Object.keys(data).filter(assetType=> Object.keys(data[assetType]).length > 0).map(assetType => {
        const assetTypeObj = getAssetType(assetType);
        return {
          label: assetTypeObj.name,
          data: Object.values(data[assetType]),
          borderColor: getCssVariable(`--color-${assetTypeObj.color}-500`),
          fill: false,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: getCssVariable(`--color-${assetTypeObj.color}-500`),
          pointHoverBackgroundColor: getCssVariable(`--color-${assetTypeObj.color}-500`),
          pointBorderWidth: 0,
          pointHoverBorderWidth: 0,
          clip: 20,
          tension: 0.2,
        }
      })
    };
    setChartData(chartData);
  };
  populateChartData();
 }, [startDate, activeDay]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Asset Types Return Percentage</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      {chartData && <LineChart data={chartData} width={595} height={248} />}
    </div>
  );
}

export default DashboardCard08;
