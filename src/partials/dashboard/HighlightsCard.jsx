import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import EditMenu from '../../components/DropdownEditMenu';
import useStore from '../../store';
import { formatDecimal, formatValue } from '../../utils/Utils';
import { TrendingDown, TrendingUp } from "lucide-react"
// Import utilities
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

function DashboardCard01() {

  const [topGainerAsset, setTopGainerAsset] = useState({});
  const [topLooserAsset, setTopLooserAsset] = useState({});
  const { startDate, activeDay, getTopGainerAsset, getTopLooserAsset } = useStore();
  // const [chartData, setChartData] = useState();

  useEffect(() => {
    const fetchHighlights = async () => {
      const [topGainerAsset, topLooserAsset] = await Promise.all([getTopGainerAsset(startDate, activeDay), getTopLooserAsset(startDate, activeDay)]);
      // console.log("topGainerAsset", topGainerAsset);
      // console.log("topLooserAsset", topLooserAsset);
      setTopGainerAsset(topGainerAsset);
      setTopLooserAsset(topLooserAsset);
    };
    fetchHighlights();
  }, [startDate, activeDay]);
  
  
  // useEffect(() => {
  //   const fetchTotalInvestmentAmount = async () => {
  //     const amount = await getTotalInvestmentAmount(startDate, activeDay);
  //     console.log("Total Investment Amount", amount);
  //     setTotalInvestmentAmount(amount);
  //   };
  //   fetchTotalInvestmentAmount();
  //   // setTotalInvestmentAmount(234525);

  //   const fetchTotalInvestmentValue = async () => {
  //     const value = await getTotalInvestmentValue(startDate, activeDay);
  //     console.log("Total Investment Value", value);
  //     setTotalInvestmentValue(value);
  //   };
  //   fetchTotalInvestmentValue();

  //   const populateChartData = async () => {
  //     const [monthlyInvestmentAmounts, monthlyInvestmentValues] = await Promise.all([getMonthlyTotalInvestmentAmount('2015-01-01', new Date()), getMonthlyTotalInvestmentValue('2015-01-01', new Date())]);
  //     // console.log("monthlyInvestmentAmounts", monthlyInvestmentAmounts);
  //     // console.log("monthlyInvestmentValues", monthlyInvestmentValues);

  //     const chartData = {
  //       labels: Object.keys(monthlyInvestmentAmounts),
  //       datasets: [
  //         // Indigo line
  //         {
  //           data: Object.values(monthlyInvestmentValues),
  //           // data: [732, 610, 610, 504, 504, 504, 349, 349, 504, 342, 504, 610, 391, 192, 154, 273, 191, 191, 126, 263, 349, 252, 423, 622, 470, 532],
  //           fill: true,
  //           backgroundColor: function (context) {
  //             const chart = context.chart;
  //             const { ctx, chartArea } = chart;
  //             return chartAreaGradient(ctx, chartArea, [
  //               { stop: 0, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0) },
  //               { stop: 1, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.2) }
  //             ]);
  //           },
  //           borderColor: getCssVariable('--color-violet-500'),
  //           borderWidth: 2,
  //           pointRadius: 0,
  //           pointHoverRadius: 3,
  //           pointBackgroundColor: getCssVariable('--color-violet-500'),
  //           pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
  //           pointBorderWidth: 0,
  //           pointHoverBorderWidth: 0,
  //           clip: 20,
  //           tension: 0.2,
  //         },
  //         // Gray line
  //         {
  //           data: Object.values(monthlyInvestmentAmounts),
  //           // data: [532, 532, 532, 404, 404, 314, 314, 314, 314, 314, 234, 314, 234, 234, 314, 314, 314, 388, 314, 202, 202, 202, 202, 314, 720, 642],
  //           // borderColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
  //           borderColor: getCssVariable('--color-sky-500'),
  //           borderWidth: 2,
  //           pointRadius: 0,
  //           pointHoverRadius: 3,
  //           pointBackgroundColor: adjustColorOpacity(getCssVariable('--color-sky-500'), 0.25),
  //           pointHoverBackgroundColor: adjustColorOpacity(getCssVariable('--color-sky-500'), 0.25),
  //           pointBorderWidth: 0,
  //           pointHoverBorderWidth: 0,
  //           clip: 20,
  //           tension: 0.2,
  //         },
  //       ],
  //     };
  //     // console.log("chartData", chartData);
  //     setChartData(chartData);
  //   };
  //   populateChartData();

  // }, [startDate, activeDay]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-gray-800 h-[16rem] shadow-xs rounded-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Quick Stats</h2>
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
        <div className="flex flex-col justify-around h-full">
          <div className="">
            <div className="flex items-center mb-1">
            
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">Top Gainer</div>
            <TrendingUp className="text-green-700 ml-2" size={16}/>
            </div>
            <div className="flex items-center justify-between content-center align-middle">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mr-2">{topGainerAsset.assetName}</div>
              <div className="flex flex-col justify-around">
              <div className="text-sm text-gray-800 text-green-700 mr-2 font-semibold">{formatValue(topGainerAsset.returnAmount)}</div>
              {/* <div className="text-l text-gray-800 text-green-700 mr-2">{topGainerAsset.returnPercentage >= 0 ? formatDecimal(topGainerAsset.returnPercentage, true) : formatDecimal(topGainerAsset.returnPercentage, false)}%</div> */}

              <div className={`text-sm font-medium self-center ${topGainerAsset.returnPercentage > 0 ? 'text-green-700 bg-green-500/20' : 'text-red-700 bg-red-500/20'} px-1.5 rounded-full`}>{topGainerAsset.returnPercentage > 0 ? formatDecimal(topGainerAsset.returnPercentage, true) : formatDecimal(topGainerAsset.returnPercentage, false)}%</div>

              </div>
              {/* <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">+49%</div> */}
            </div>
          </div>
          <div className="">
          <div className="flex items-center mb-1">
          
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">Top Loser</div>
            <TrendingDown className="text-red-700 ml-2" size={16} />
            </div>
              <div className="flex items-center justify-between content-center align-middle">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mr-2">{topLooserAsset.assetName}</div>
              <div className="flex flex-col justify-around">
              <div className="text-sm text-gray-800 text-red-700 mr-2 font-semibold">{formatValue(topLooserAsset.returnAmount)}</div>
              {/* <div className="text-l text-gray-800 text-red-700 mr-2">{topLooserAsset.returnPercentage >= 0 ? formatDecimal(topLooserAsset.returnPercentage, true) : formatDecimal(topLooserAsset.returnPercentage, false)}%</div> */}


              <div className={`text-sm font-medium self-center ${topLooserAsset.returnPercentage > 0 ? 'text-green-700 bg-green-500/20' : 'text-red-700 bg-red-500/20'} px-1.5 rounded-full`}>{topLooserAsset.returnPercentage > 0 ? formatDecimal(topLooserAsset.returnPercentage, true) : formatDecimal(topLooserAsset.returnPercentage, false)}%</div>

              </div>
              {/* <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">+49%</div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard01;
