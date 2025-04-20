import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import useStore from '../../store';
import { formatDecimal, formatValue } from '../../utils/Utils';
import { TrendingDown, TrendingUp } from "lucide-react"
// Import utilities
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

function DashboardCard01() {

  const [topGainerAsset, setTopGainerAsset] = useState({});
  const [topLooserAsset, setTopLooserAsset] = useState({});
  const { startDate, activeDay, getTopGainerAsset, getTopLooserAsset } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchHighlights = async () => {
      setIsLoading(true);
      const [topGainerAsset, topLooserAsset] = await Promise.all([getTopGainerAsset(startDate, activeDay), getTopLooserAsset(startDate, activeDay)]);
      // console.log("topGainerAsset", topGainerAsset);
      // console.log("topLooserAsset", topLooserAsset);
      setTopGainerAsset(topGainerAsset);
      setTopLooserAsset(topLooserAsset);
      setIsLoading(false);
    };
    fetchHighlights();
  }, [startDate, activeDay]);
  

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-gray-800 h-[16rem] shadow-xs rounded-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (<>
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
        {/* <div className="flex flex-col justify-around h-full">
          <div className="">
            <div className="flex items-center mb-1">
            
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">Top Gainer</div>
            <TrendingUp className="text-green-700 ml-2" size={16}/>
            </div>
            <div className="flex items-center justify-between content-center align-middle">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mr-2">{topGainerAsset.assetName}</div>
              <div className="flex flex-col justify-around">
              <div className="text-sm text-gray-800 text-green-700 mr-2 font-semibold">{formatValue(topGainerAsset.returnAmount)}</div>

              <div className={`text-sm font-medium self-center ${topGainerAsset.returnPercentage > 0 ? 'text-green-700 bg-green-500/20' : 'text-red-700 bg-red-500/20'} px-1.5 rounded-full`}>{topGainerAsset.returnPercentage > 0 ? formatDecimal(topGainerAsset.returnPercentage, true) : formatDecimal(topGainerAsset.returnPercentage, false)}%</div>

              </div>
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

              <div className={`text-sm font-medium self-center ${topLooserAsset.returnPercentage > 0 ? 'text-green-700 bg-green-500/20' : 'text-red-700 bg-red-500/20'} px-1.5 rounded-full`}>{topLooserAsset.returnPercentage > 0 ? formatDecimal(topLooserAsset.returnPercentage, true) : formatDecimal(topLooserAsset.returnPercentage, false)}%</div>

              </div>
            </div>
          </div>
        </div> */}
      </div>
      </>)}
    </div>
  );
}

export default DashboardCard01;
