import React, { useState, useEffect } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import DashboardCard01 from '../partials/dashboard/NetWorthCard';
import DashboardCard02 from '../partials/dashboard/PnLCard';
import DashboardCard03 from '../partials/dashboard/TimeTravelCard';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../partials/dashboard/AssetAllocationDonutCard';
import DashboardCard07 from '../partials/dashboard/TopAssetTableCard';
import DashboardCard08 from '../partials/dashboard/AssetTypeValueLineChartCard';
import DashboardCard09 from '../partials/dashboard/AssetTypePerformanceBarChartCard';
import DashboardCard10 from '../partials/dashboard/DashboardCard10';
import DashboardCard11 from '../partials/dashboard/DashboardCard11';
import DashboardCard12 from '../partials/dashboard/DashboardCard12';
import DashboardCard13 from '../partials/dashboard/DashboardCard13';
import TopGainerCard from '../partials/dashboard/TopGainerCard';
import TopLoserCard from '../partials/dashboard/TopLoserCard';
import BadAssetTableCard from '../partials/dashboard/BadAssetTableCard';
import AssetEquityValueLineChartCard from '../partials/dashboard/AssetEquityValueLineChartCard';

import useStore from '../store';
// import Banner from '../partials/Banner';

function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { prepareData } = useStore();
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const init = async () => {
      await prepareData();
      // await setCurrentDate(new Date('2000-01-01'), new Date());
      setShowDashboard(true);
    }
    init();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

      {/* Content area */}
      {!showDashboard ? (
        <div className="relative flex-1 flex flex-col items-center justify-center h-screen">
          <div className="mb-4 text-gray-600 dark:text-gray-400">Loading your portfolio...</div>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="w-full h-full bg-violet-500 animate-pulse"></div>
          </div>
        </div>
      ) : (
        // isLoading ? (
        //   <div className="fixed inset-0 bg-black/30 dark:bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
        //     <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        //   </div>
        // ):
        // (
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/*  Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-6 py-6 w-full max-w-9xl mx-auto">

              {/* Dashboard actions */}
              <div className="sm:flex sm:justify-between sm:items-center mb-6">

                {/* Left: Title */}
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-semibold">Your finances in sight</h1>
                </div>

                {/* Right: Actions */}
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  {/* Filter button */}
                  {/* <FilterButton align="right" /> */}
                  {/* Datepicker built with React Day Picker */}
                  <Datepicker align="right" />
                  {/* Add view button */}
                  {/* <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                  <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="max-xs:sr-only">Add View</span>
                </button>                 */}
                </div>

              </div>

              {/* Cards */}
              {/* <div className="flex justify-between items-start"> */}
              <div className="grid grid-cols-32 gap-6">

                {/* Line chart (Acme Plus) */}
                <DashboardCard01 />
                {/* Line chart (Acme Advanced) */}
                <DashboardCard02 />

                {/* Highlights cards stacked vertically */}
                <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 gap-6">
                  <TopGainerCard />
                  <TopLoserCard />
                </div>

                <DashboardCard03 />
                {/* Doughnut chart (Top Countries) */}
                <DashboardCard06 />
                <DashboardCard09 />

                {/* Bar chart (Direct vs Indirect) */}
                {/* <DashboardCard04 /> */}
                {/* Line chart (Real Time Value) */}
                {/* <DashboardCard05 /> */}


                {/* Line chart (Sales Over Time) */}
                <DashboardCard08 />
                <AssetEquityValueLineChartCard />
                {/* Table (Top Channels) */}
                <DashboardCard07 />
                <BadAssetTableCard />
                {/* Stacked bar chart (Sales VS Refunds) */}

                {/* Card (Customers) */}
                {/* <DashboardCard10 /> */}
                {/* Card (Reasons for Refunds) */}
                {/* <DashboardCard11 /> */}
                {/* Card (Recent Activity) */}
                {/* <DashboardCard12 /> */}
                {/* Card (Income/Expenses) */}
                {/* <DashboardCard13 /> */}

              </div>
              {/* <div className="grid grid-cols-4 gap-6">
            <DashboardCard03 />
            </div> */}
              {/* </div> */}

            </div>
          </main>

          {/* <Banner /> */}

        </div>
      )}
    </div>
  );
}

export default Dashboard;