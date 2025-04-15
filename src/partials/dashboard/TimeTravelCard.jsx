import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import EditMenu from '../../components/DropdownEditMenu';
import Timeline from '../../charts/Timeline';
// Import utilities
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';
import useStore from '../../store';

function DashboardCard03() {

  const {investmentStartDate, activeDay} = useStore();
  const [highlights, setHighlights] = useState([
    {
    date: '2021-01-01',
    highlightName: 'Hig edfs asdsa asfa asf',
    description: 'Description 1  sdfds  sdfdsfs sdfsdfsfsfdfs sdfsfsfsfs sdfsfs dfsafs',
    icon: 'star',
    iconColor: 'yellow-400'
  },
  {
    date: '2021-05-12',
    highlightName: 'Hig edfs asdsa asfa asf 2',
    description: 'Description 1  sdfds  sdfdsfs sdfsdfsfsfdfs sdfsfsfsfs sdfsfs dfsafs',
    icon: 'star',
    iconColor: 'violet-400'
  }
]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-gray-800 row-span-3 shadow-xs rounded-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Time Travel</h2>
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
            <div className="grow">
              <Timeline startDate={investmentStartDate} endDate={new Date()} highlights={highlights}/>
            </div>
        {/* <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Sales</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">$9,962</div>
          <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">+49%</div>
        </div> */}
      </div>
      
    </div>
  );
}

export default DashboardCard03;
