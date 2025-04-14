import React, { useEffect, useState } from 'react';
import Tooltip from '../../components/Tooltip';
import BarChart from '../../charts/BarChart02';
import useStore from '../../store';
// Import utilities
import { getCssVariable } from '../../utils/Utils';

function DashboardCard09() {



  const { getTotalReturnPercentageByAssetType, getAssetType} = useStore();
  // const [totalReturnPercentageByAssetType, setTotalReturnPercentageByAssetType] = useState({});
  const [chartData, setChartData] = useState();

  useEffect(() => {
    const populateChartData = async () => {
      const data = await getTotalReturnPercentageByAssetType('2000-01-01', new Date());
      console.log("Total Return Percentage By Asset Type", data);
      // setTotalReturnPercentageByAssetType(data);
      const chartData = {
        labels: Object.keys(data).map(k=>getAssetType(k).name),
        datasets: [
          {
            label: 'Dataset 1',
            data: Object.values(data),
            // borderColor: "red",

            backgroundColor: Object.keys(data).map(k=>{
              const assetType = getAssetType(k);
              return getCssVariable(`--color-${assetType.color}-400`)
            }),
            hoverBackgroundColor: Object.keys(data).map(k=>{
              const assetType = getAssetType(k);
              return getCssVariable(`--color-${assetType.color}-600`)
            }),
            barPercentage: 0.8,
            categoryPercentage: 0.7,
            borderRadius: 4,
            // backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
          },
          //   {
          //     label: 'Dataset 2',
          //     data: [10, 5, 10, 4, -10, -25, -10],
          //     // borderColor: 'blue',
          //     backgroundColor: getCssVariable('--color-violet-500'),
          // hoverBackgroundColor: getCssVariable('--color-violet-600'),
          // barPercentage: 1.2,
          // categoryPercentage: 0.7,
          // borderRadius: 4,
          //     // backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
          //   }
        ]
      };
      setChartData(chartData);
    };
    populateChartData();
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Assets Performance</h2>
        {/* <Tooltip className="ml-2" size="lg">
          <div className="text-sm">Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.</div>
        </Tooltip> */}
      </header>
      {/* <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">+$6,796</div>
          <div className="text-sm font-medium text-red-700 px-1.5 bg-red-500/20 rounded-full">-34%</div>
        </div>
      </div> */}
      {/* Chart built with Chart.js 3 */}
      {chartData && <div className="grow">
        {/* Change the height attribute to adjust the chart height */}
        <BarChart data={chartData} width={350} height={220} />
      </div>}
    </div>
  );
}

export default DashboardCard09;
