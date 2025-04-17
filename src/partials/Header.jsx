import React, { useState, useEffect } from 'react';

import SearchModal from '../components/ModalSearch';
import Notifications from '../components/DropdownNotifications';
import Help from '../components/DropdownHelp';
import UserMenu from '../components/DropdownProfile';
import ThemeToggle from '../components/ThemeToggle';
import { formatValue } from '../utils/Utils';
import { CircleDollarSign } from "lucide-react"

function Header({
  sidebarOpen,
  setSidebarOpen,
  variant = 'default',
}) {

  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [prices, setPrices] = useState({
    nifty: {
      price: 23674.25,
      change: 0.82
    },
    sensex: {
      price: 76734.89,
      change: 0.82
    },
    gold: {
      price: 90245,
      change: -0.31
    }, 
    nasdaq: {
      price: 15972.76,
      change: 1.24
    },
    btc: {
      price: 83215,
      change: 2.15
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prevPrices => ({
        nifty: {
          price: prevPrices.nifty.price * (1 + (Math.random() * 0.002 - 0.001)),
          change: prevPrices.nifty.change + (Math.random() * 0.1 - 0.05)
        },
        sensex: {
          price: prevPrices.sensex.price * (1 + (Math.random() * 0.002 - 0.001)),
          change: prevPrices.sensex.change + (Math.random() * 0.1 - 0.05)
        },
        gold: {
          price: prevPrices.gold.price * (1 + (Math.random() * 0.002 - 0.001)),
          change: prevPrices.gold.change + (Math.random() * 0.1 - 0.05)
        },
        nasdaq: {
          price: prevPrices.nasdaq.price * (1 + (Math.random() * 0.002 - 0.001)), 
          change: prevPrices.nasdaq.change + (Math.random() * 0.1 - 0.05)
        },
        btc: {
          price: prevPrices.btc.price * (1 + (Math.random() * 0.002 - 0.001)),
          change: prevPrices.btc.change + (Math.random() * 0.1 - 0.05)
        }
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`sticky top-0 before:absolute before:inset-0 before:backdrop-blur-md max-lg:before:bg-white/90 dark:max-lg:before:bg-gray-800/90 before:-z-10 z-30 ${variant === 'v2' || variant === 'v3' ? 'before:bg-white after:absolute after:h-px after:inset-x-0 after:top-full after:bg-gray-200 dark:after:bg-gray-700/60 after:-z-10' : 'max-lg:shadow-xs lg:before:bg-gray-100/90 dark:lg:before:bg-gray-900/90'} ${variant === 'v2' ? 'dark:before:bg-gray-800' : ''} ${variant === 'v3' ? 'dark:before:bg-gray-900' : ''}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between h-20 ${variant === 'v2' || variant === 'v3' ? '' : 'lg:border-b border-gray-200 dark:border-gray-700/60'}`}>

          {/* Header: Left side */}
          <div className="flex">

            {/* App Logo and Name */}
            <div className="flex items-center">
              <CircleDollarSign className="h-8 w-8 text-violet-600 dark:text-violet-400" />
              <span className="ml-2 text-3xl font-bold text-violet-600 dark:text-violet-400">FinSight</span>
            </div>
            {/* Hamburger button */}
            {/* <button
              className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(!sidebarOpen); }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button> */}
            {/* Simulated real-time price updates */}


          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            {/* <div>
              <button
                className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full ml-3 ${searchModalOpen && 'bg-gray-200 dark:bg-gray-800'}`}
                onClick={(e) => { e.stopPropagation(); setSearchModalOpen(true); }}
                aria-controls="search-modal"
              >
                <span className="sr-only">Search</span>
                <svg
                  className="fill-current text-gray-500/80 dark:text-gray-400/80"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7ZM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5Z" />
                  <path d="m13.314 11.9 2.393 2.393a.999.999 0 1 1-1.414 1.414L11.9 13.314a8.019 8.019 0 0 0 1.414-1.414Z" />
                </svg>
              </button>
              <SearchModal id="search-modal" searchId="search" modalOpen={searchModalOpen} setModalOpen={setSearchModalOpen} />
            </div>
            <Notifications align="right" />
            <Help align="right" /> */}
              <div className="flex items-center space-x-3">
              {/* Nifty 50 */}
              <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm w-38">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">NIFTY 50</div>
                <div className="flex items-center">
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatValue(prices.nifty.price)}</div>
                  <div className="ml-2 text-xs font-medium text-green-700 dark:text-green-500 bg-green-100 dark:bg-green-500/20 px-1.5 rounded-full">
                    {prices.nifty.change.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Nifty 50 */}
              <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm w-38">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">SENSEX</div>
                <div className="flex items-center">
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatValue(prices.sensex.price)}</div>
                  <div className="ml-2 text-xs font-medium text-green-700 dark:text-green-500 bg-green-100 dark:bg-green-500/20 px-1.5 rounded-full">
                    {prices.nifty.change.toFixed(2)}%
                  </div>
                </div>
              </div>



              {/* Gold */}
              <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm w-38">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">GOLD</div>
                <div className="flex items-center">
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatValue(prices.gold.price)}</div>
                  <div className="ml-2 text-xs font-medium text-red-700 dark:text-red-500 bg-red-100 dark:bg-red-500/20 px-1.5 rounded-full">
                    {prices.gold.change.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* NASDAQ */}
              <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm w-38">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">NASDAQ</div>
                <div className="flex items-center">
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">${prices.nasdaq.price.toFixed(2)}</div>
                  <div className="ml-2 text-xs font-medium text-green-700 dark:text-green-500 bg-green-100 dark:bg-green-500/20 px-1.5 rounded-full">
                    {prices.nasdaq.change.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Bitcoin */}
              <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm w-38">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">BTC</div>
                <div className="flex items-center">
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">${prices.btc.price.toFixed(2)}</div>
                  <div className="ml-2 text-xs font-medium text-green-700 dark:text-green-500 bg-green-100 dark:bg-green-500/20 px-1.5 rounded-full">
                    {prices.btc.change.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            <ThemeToggle />
            {/*  Divider */}
            <hr className="w-px h-6 bg-gray-200 dark:bg-gray-700/60 border-none" />
            <UserMenu align="right" />

          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;