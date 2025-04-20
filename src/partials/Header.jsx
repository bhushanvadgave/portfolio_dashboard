import React, { useState, useEffect } from 'react';

import UserMenu from '../components/DropdownProfile';
import ThemeToggle from '../components/ThemeToggle';
import { formatValue } from '../utils/Utils';
import { CircleDollarSign } from "lucide-react"

function Header({
  variant = 'default',
}) {


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
            


          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
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