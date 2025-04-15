import { create } from 'zustand';
import { assets } from "./assets/assets.json"
import { asset_types } from "./assets/asset_types.json"
import Papa from 'papaparse';
import { format, isSameDay, differenceInDays} from 'date-fns';

const PIVOT_ACTIVE_DATE = new Date('2025-04-10');
PIVOT_ACTIVE_DATE.setHours(0, 0, 0, 0);

//   let cachedTransactions: any[] | null = null;
//   let cachedPriceHistory: any[] | null = null;

const useStore = create((set, get) => ({
  activeDay: new Date(),
  setActiveDay: (day: Date | string) => set({ activeDay: new Date(day) }),
  startDate: new Date('2015-01-01'),
  investmentStartDate: new Date('2015-01-01'),
  // currentDate: new Date(),
  // totalInvestmentAmount: 0,
  // totalInvestmentValue: 0,
  investmentTransactions: [],
  assetPriceHistory: [],

  updateActiveDayAndStartDate: async (stDate: Date, enDate: Date) => {
    set({ startDate: stDate, activeDay: enDate });
  },

  prepareData: async () => {
    const assetPriceHistory = await loadPriceHistory();
    const investmentTransactions = await loadTransactions(assetPriceHistory);
    const firstDateOfInvestment = investmentTransactions[0].date;
    firstDateOfInvestment.setHours(0, 0, 0, 0);
    const actDay = new Date();
    actDay.setHours(0, 0, 0, 0);
    set({ investmentTransactions, assetPriceHistory, startDate: firstDateOfInvestment, investmentStartDate: firstDateOfInvestment, activeDay: actDay });
  },

  // setCurrentDate: async (starDate: Date, endDate: Date) => {
  //   set({ currentDate: endDate, stardate: starDate });
  //   const { setTotalInvestmentAmount, setTotalInvestmentValue } = get() as any;
  //   await setTotalInvestmentAmount();
  //   await setTotalInvestmentValue();
  // },

  // prepareMonthly

  // setTotalInvestmentAmount: (amount: number) => set({ totalInvestmentAmount: amount }),
  // setTotalInvestmentValue: (value: number) => set({ totalInvestmentValue: value }),
  getAsset(assetId: string) {
    return assets[assetId];
  },

  getAllAssets() {
    return assets;
  },

  getAssetType(assetId: string) {
    return asset_types[assetId];
  },

  getAllAssetTypes() {
    return asset_types;
  },

  async getTotalInvestmentAmount(startDt: string | Date, endDt: string | Date, assetType?: string, assetId?: string): Promise<number> {
    const startDate = new Date(startDt);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(endDt);
    endDate.setHours(0, 0, 0, 0);

    // const state = get() as { currentDate: Date, startDate: Date };
    // const tillDate = state.currentDate;
    const { investmentTransactions, getAsset } = get() as any;
    const transactions = investmentTransactions;
    if (!transactions) return 0;

    const totalAmount = transactions.filter(t => {
      if (assetType) {
        const asset = getAsset(t.asset_id);
        return asset.asset_type === assetType;
      }
      return true;
    })
      .filter(t => {
        if (assetId) {
          return t.asset_id === assetId;
        }
        return true;
      })
      .reduce((sum: number, transaction: any) => {
        const transactionDate = transaction.date;
        if (transactionDate <= endDate && transactionDate >= startDate) {
          return sum + (transaction.amount || 0);
        }
        return sum;
      }, 0);

    return totalAmount;
    // set({ totalInvestmentAmount: totalAmount });
  },

  async getTotalInvestmentValue(startDt: string | Date, endDt: string | Date, assetType?: string, assetId?: string): Promise<number> {
    const startDate = new Date(startDt);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(endDt);
    endDate.setHours(0, 0, 0, 0);

    // const state = get() as { currentDate: Date, startDate: Date };
    // const tillDate = state.currentDate;
    const { investmentTransactions, getAsset } = get() as any;
    const transactions = investmentTransactions;
    if (!transactions) return 0;

    // Group transactions by asset_id and sum quantities
    const assetQuantities = transactions
      .filter(t => {
        if (assetType) {
          const asset = getAsset(t.asset_id);
          return asset.asset_type === assetType;
        }
        return true;
      })
      .filter(t => {
        if (assetId) {
          return t.asset_id === assetId;
        }
        return true;
      })
      .reduce((acc: { [key: string]: number }, transaction: any) => {
        const transactionDate = transaction.date;
        if (transactionDate <= endDate && transactionDate >= startDate) {
          const assetId = transaction.asset_id;
          acc[assetId] = (acc[assetId] || 0) + (transaction.quantity || 0);
        }
        return acc;
      }, {});

    try {
      const { assetPriceHistory } = get() as any;

      // Calculate total value using latest prices up to tillDate
      let totalValue = 0;
      for (const [assetId, quantity] of Object.entries(assetQuantities)) {
        // Filter prices for this asset up to tillDate
        const assetPrices = assetPriceHistory
          .filter((row: any) => row.date <= endDate && row.date >= startDate)
          .sort((a: any, b: any) => b.date.getTime() - a.date.getTime());

        if (assetPrices.length > 0) {
          // Use the most recent price
          const latestPrice = assetPrices[0][assetId];
          totalValue += (quantity as number) * latestPrice;
        }
      }

      return totalValue;
      // set({ totalInvestmentValue: totalValue });
    } catch (error) {
      console.error('Error calculating investment value:', error);
      return 0;
    }
  },

  async getTotalReturnAmount(startDate: string | Date, endDate: string | Date, assetType?: string, assetId?: string): Promise<number> {
    const { getTotalInvestmentAmount, getTotalInvestmentValue } = get() as any;
    const totalInvestmentAmount = await getTotalInvestmentAmount(startDate, endDate, assetType, assetId);
    const totalInvestmentValue = await getTotalInvestmentValue(startDate, endDate, assetType, assetId);
    return totalInvestmentValue - totalInvestmentAmount;
  },

  async getTotalReturnPercentage(startDate: string | Date, endDate: string | Date, assetType?: string, assetId?: string): Promise<number> {
    const { getTotalInvestmentAmount, getTotalInvestmentValue } = get() as any;
    const totalInvestmentAmount = await getTotalInvestmentAmount(startDate, endDate, assetType, assetId);
    const totalInvestmentValue = await getTotalInvestmentValue(startDate, endDate, assetType, assetId);
    return totalInvestmentAmount > 0 ? ((totalInvestmentValue - totalInvestmentAmount) / totalInvestmentAmount) * 100 : 0;
  },

  async getTodaysTotalReturnAmount(startDt: string | Date, endDt: string | Date, assetType?: string, assetId?: string): Promise<number> {
    const { getTotalReturnAmount } = get() as any;
    const startDate = new Date(startDt);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(endDt);
    endDate.setHours(0, 0, 0, 0);
    const totalReturnAmount = await getTotalReturnAmount(startDate, endDate, assetType, assetId);
    const yesterday = new Date(endDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayReturnAmount = await getTotalReturnAmount(startDate, yesterday, assetType, assetId);
    return totalReturnAmount - yesterdayReturnAmount;
  },

  async getTodaysTotalReturnPercentage(startDt: string | Date, endDt: string | Date, assetType?: string, assetId?: string): Promise<number> {
    const { getTodaysTotalReturnAmount, getTotalReturnAmount } = get() as any;
    const todaysReturnAmount = await getTodaysTotalReturnAmount(startDt, endDt, assetType, assetId);
    const yesterday = new Date(endDt);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayReturnAmount = await getTotalReturnAmount(startDt, yesterday, assetType, assetId);
    return yesterdayReturnAmount > 0 ? (todaysReturnAmount / yesterdayReturnAmount) * 100 : 0;
  },

  async getMonthlyTotalInvestmentAmount(startDt: string | Date, endDt: string | Date, assetType?: string): Promise<Record<string, number>> {
    const startDate = new Date(startDt);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(endDt);
    endDate.setHours(0, 0, 0, 0);

    const currentMonthDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const lastMonthDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);

    const { investmentTransactions, getAsset } = get() as any;
    const monthlyAmounts: Record<string, number> = {};

    while (currentMonthDate <= lastMonthDate) {
      const monthKey = `${currentMonthDate.getFullYear()}-${String(currentMonthDate.getMonth() + 1).padStart(2, '0')}`;


      investmentTransactions
      .filter(t => {
        if (assetType) {
          return getAsset(t.asset_id).asset_type === assetType;
        }
        return true;
      })
      .forEach((transaction: any) => {
        const transactionDate = transaction.date;

        const transactionMonth = transactionDate.getMonth();
        const transactionYear = transactionDate.getFullYear();

        const currentMonth = currentMonthDate.getMonth();
        const currentYear = currentMonthDate.getFullYear();

        // console.log("currentMonthDate", currentMonthDate, "transactionDate", transactionDate, "lastMonthDate", lastMonthDate, "condition", currentMonthDate >= transactionDate);
        if (currentMonthDate >= transactionDate || (currentYear === transactionYear && currentMonth === transactionMonth)) {
          // Add transaction amount to monthly total
          monthlyAmounts[monthKey] = (monthlyAmounts[monthKey] || 0) + (transaction.amount || 0);
        }
      });

      currentMonthDate.setMonth(currentMonthDate.getMonth() + 1);
    }

    return monthlyAmounts;
  },

  async getMonthlyTotalInvestmentValue(startDt: string | Date, endDt: string | Date, assetType?: string): Promise<Record<string, number>> {
    const startDate = new Date(startDt);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(endDt);
    endDate.setHours(0, 0, 0, 0);

    const currentMonthDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const lastMonthDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);


    const { investmentTransactions, getAsset } = get() as any;

    const monthlyValues: Record<string, number> = {};

    let monthlyAssetQuantities: Record<string, { [assetId: string]: number }> = {};
    while (currentMonthDate <= lastMonthDate) {
      const monthKey = `${currentMonthDate.getFullYear()}-${String(currentMonthDate.getMonth() + 1).padStart(2, '0')}`;
      //--------
      const thisMonthAssetQuantities = investmentTransactions
      .filter(t => {
        if (assetType) {
          return getAsset(t.asset_id).asset_type === assetType;
        }
        return true;
      })
      .reduce((acc: { [monthYear: string]: { [assetId: string]: number } }, transaction: any) => {
        const transactionDate = transaction.date;
        const transactionMonth = transactionDate.getMonth();
        const transactionYear = transactionDate.getFullYear();

        const currentMonth = currentMonthDate.getMonth();
        const currentYear = currentMonthDate.getFullYear();

        if (currentMonthDate.getTime() >= transactionDate.getTime() || (currentYear === transactionYear && currentMonth === transactionMonth)) {
          const assetId = transaction.asset_id;
          acc[monthKey] = acc[monthKey] || {};
          acc[monthKey][assetId] = (acc[monthKey][assetId] || 0) + (transaction.quantity || 0);
        }
        return acc;
      }, {});
      monthlyAssetQuantities = { ...monthlyAssetQuantities, ...thisMonthAssetQuantities };
      //--------
      currentMonthDate.setMonth(currentMonthDate.getMonth() + 1);
    }

    const { assetPriceHistory } = get() as any;

    for (const [monthYear, assetQuantityMap] of Object.entries(monthlyAssetQuantities)) {
      for (const [assetId, quantity] of Object.entries(assetQuantityMap as { [assetId: string]: number })) {
        const assetPrices = assetPriceHistory
          .filter((row: any) => row.date <= endDate && row.date >= startDate)
          .sort((a: any, b: any) => b.date.getTime() - a.date.getTime());

        if (assetPrices.length > 0) {
          const latestPrice = assetPrices[0][assetId];
          monthlyValues[monthYear] = (monthlyValues[monthYear] || 0) + (quantity as number) * latestPrice;
        }
      }
    }

    return monthlyValues;
  },

  async getMonthlyTotalReturnPercentage(startDt: string | Date, endDt: string | Date, assetType?: string): Promise<Record<string, number>> {
    const { getMonthlyTotalInvestmentAmount, getMonthlyTotalInvestmentValue } = get() as any;
    const monthlyInvestmentAmounts = await getMonthlyTotalInvestmentAmount(startDt, endDt, assetType);
    const monthlyInvestmentValues = await getMonthlyTotalInvestmentValue(startDt, endDt, assetType);
  
    const monthlyReturnPercentages: Record<string, number> = {};
    for (const [monthYear, amount] of Object.entries(monthlyInvestmentAmounts)) {
      const amount = monthlyInvestmentAmounts[monthYear];
      const value = monthlyInvestmentValues[monthYear];
      const percentage = amount > 0 ? ((value - amount) / amount) * 100 : 0;
      monthlyReturnPercentages[monthYear] = percentage;
    }

    return monthlyReturnPercentages;
  },

  async getAssetAllocationPercentage(startDt: string | Date, endDt: string | Date): Promise<Record<string, number>> {
    const { getTotalInvestmentAmount, getAllAssetTypes } = get() as any;
    const assetTypes = getAllAssetTypes();
    const assetAllocation: Record<string, number> = {};
    const totalInvestmentAmount = await getTotalInvestmentAmount(startDt, endDt);
    for (const assetType in assetTypes) {
      const assetTypeInvestmentAmount = await getTotalInvestmentAmount(startDt, endDt, assetType);
      assetAllocation[assetType] = totalInvestmentAmount > 0 ? (assetTypeInvestmentAmount / totalInvestmentAmount) * 100 : 0;
    }

    return assetAllocation;
  },

  async getTopPerformingAssets(startDt: string | Date, endDt: string | Date, sortBy: string = 'returnPercentage') {
    const { getTotalInvestmentAmount, getTotalInvestmentValue, getAllAssets } = get() as any;
    const assets = getAllAssets();
    const results: { assetId: string; assetName: string; assetType: string; investmentAmount: number; investmentValue: number; returnAmount: number; returnPercentage: number }[] = [];
    for (const assetId in assets) {
      const assetType = assets[assetId].asset_type;
      const totalInvestmentAmount = await getTotalInvestmentAmount(startDt, endDt, assetType, assetId);
      const totalInvestmentValue = await getTotalInvestmentValue(startDt, endDt, assetType, assetId);
      const returnAmount = totalInvestmentValue - totalInvestmentAmount;
      const returnPercentage = totalInvestmentAmount > 0 ? ((totalInvestmentValue - totalInvestmentAmount) / totalInvestmentAmount) * 100 : 0;
      results.push({
        assetId,
        assetName: assets[assetId].name,
        assetType,
        investmentAmount: totalInvestmentAmount,
        investmentValue: totalInvestmentValue,
        returnAmount,
        returnPercentage
      });
    }
    if (sortBy === 'returnPercentage') {
      results.sort((a, b) => b.returnPercentage - a.returnPercentage);
    }
    return results;
  },

  async getTotalReturnPercentageByAssetType(startDt: string | Date, endDt: string | Date): Promise<Record<string, number>> {
    const { getTotalInvestmentAmount, getTotalInvestmentValue, getAllAssetTypes } = get() as any;
    const assetTypes = getAllAssetTypes();
    const totalReturnPercentageByAssetType: Record<string, number> = {};
    for (const assetType in assetTypes) {
      const totalInvestmentAmount = await getTotalInvestmentAmount(startDt, endDt, assetType);
      const totalInvestmentValue = await getTotalInvestmentValue(startDt, endDt, assetType);
      const returnPercentage = totalInvestmentAmount > 0 ? ((totalInvestmentValue - totalInvestmentAmount) / totalInvestmentAmount) * 100 : 0;
      totalReturnPercentageByAssetType[assetType] = returnPercentage;
    }
    return totalReturnPercentageByAssetType;
  },

  async getMonthlyReturnPercentageByAssetType(startDt: string | Date, endDt: string | Date): Promise<Record<string, Record<string, number>>> {
    const { getMonthlyTotalReturnPercentage, getAllAssetTypes } = get() as any;
    const assetTypes = getAllAssetTypes();
    const monthlyReturnPercentageByAssetType: Record<string, Record<string, number>> = {};
    for (const assetType in assetTypes) {
      const monthlyReturnPercentage = await getMonthlyTotalReturnPercentage(startDt, endDt, assetType);
      monthlyReturnPercentageByAssetType[assetType] = monthlyReturnPercentage;
    }
    return monthlyReturnPercentageByAssetType;
  },

  async getMonthYearList(startDt: string | Date, endDt: string | Date): Promise<string[]> {
    const startDate = new Date(startDt);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(endDt);
    endDate.setHours(0, 0, 0, 0);
    const monthYearList: string[] = [];
    while (startDate <= endDate) {
      monthYearList.push(format(startDate, 'yyyy-MM'));
      startDate.setMonth(startDate.getMonth() + 1);
    }
    return monthYearList;
  },

  async getTopGainerAsset(startDt: string | Date, endDt: string | Date): Promise<{assetId:string, assetName:string, assetType:string, returnPercentage:number, returnAmount:number}> {
    const { getTotalInvestmentValue, getAllAssets, getTotalInvestmentAmount, getTodaysTotalReturnAmount, getTodaysTotalReturnPercentage  } = get() as any;
    const assets = getAllAssets();
    const assetReturnAmounts: Record<string, number> = {};
    for (const assetId in assets) {
      const assetType = assets[assetId].asset_type;
      const todaysReturnAmount = await getTodaysTotalReturnAmount(startDt, endDt, assetType, assetId);
      assetReturnAmounts[assetId] = todaysReturnAmount;
    }
    const sortedAssetReturnAmounts = Object.entries(assetReturnAmounts).sort((a, b) => b[1] - a[1]);
    const topGainerAsset = sortedAssetReturnAmounts[0];
    const topGainerAssetReturnPercentage = await getTodaysTotalReturnPercentage(startDt, endDt, assets[topGainerAsset[0]].asset_type, topGainerAsset[0]);
    return {
      assetId: topGainerAsset[0],
      assetName: assets[topGainerAsset[0]].name,
      assetType: assets[topGainerAsset[0]].asset_type,
      returnPercentage: topGainerAssetReturnPercentage,
      returnAmount: topGainerAsset[1],
    };
  },

  async getTopLooserAsset(startDt: string | Date, endDt: string | Date): Promise<{assetId:string, assetName:string, assetType:string, returnPercentage:number, returnAmount:number}> {
    const { getTotalInvestmentValue, getAllAssets, getTotalInvestmentAmount, getTodaysTotalReturnAmount, getTodaysTotalReturnPercentage  } = get() as any;
    const assets = getAllAssets();
    const assetReturnAmounts: Record<string, number> = {};
    for (const assetId in assets) {
      const assetType = assets[assetId].asset_type;
      const todaysReturnAmount = await getTodaysTotalReturnAmount(startDt, endDt, assetType, assetId);
      assetReturnAmounts[assetId] = todaysReturnAmount;
    }
    const sortedAssetReturnAmounts = Object.entries(assetReturnAmounts).sort((a, b) => a[1] - b[1]);
    const topGainerAsset = sortedAssetReturnAmounts[0];
    const topGainerAssetReturnPercentage = await getTodaysTotalReturnPercentage(startDt, endDt, assets[topGainerAsset[0]].asset_type, topGainerAsset[0]);
    return {
      assetId: topGainerAsset[0],
      assetName: assets[topGainerAsset[0]].name,
      assetType: assets[topGainerAsset[0]].asset_type,
      returnPercentage: topGainerAssetReturnPercentage,
      returnAmount: topGainerAsset[1],
    };
  }

}))

async function loadTransactions(assetPriceHistory: []) {
  // if (cachedTransactions) return cachedTransactions;

  try {
    const response = await fetch('/src/assets/investment_transactions.csv');
    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
    }
    const csv = await response.text();
    const results = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });

    if (!results.data || !Array.isArray(results.data)) {
      throw new Error('Invalid CSV data format');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffInDays = dateDifferenceInDays(today, PIVOT_ACTIVE_DATE);
    const shouldShiftDates = diffInDays != 0;

    for (const transaction of results.data) {
      const assetId = transaction.asset_id;
      transaction.date = new Date(transaction.date);
      transaction.date.setHours(0, 0, 0, 0);
      
      if (shouldShiftDates) {
        if(diffInDays>0) {
          transaction.date.setDate(transaction.date.getDate() + diffInDays);
        } else {
          transaction.date.setDate(transaction.date.getDate() - diffInDays);
        }
      }

      for (let i = assetPriceHistory.length - 1; i >= 0; i--) {
        const priceRecord = assetPriceHistory[i];
        if (priceRecord[assetId] && priceRecord.date <= transaction.date) {
          transaction.price = priceRecord[assetId];
          break;
        }
      }
      transaction.amount = transaction.quantity * transaction.price;

    }
    return results.data;
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
}

async function loadPriceHistory() {
  // if (cachedPriceHistory) return cachedPriceHistory;

  try {
    const response = await fetch('/src/assets/asset_price_history.csv');
    if (!response.ok) {
      throw new Error('Failed to fetch price history');
    }
    const csv = await response.text();
    const results = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });

    if (!results.data || !Array.isArray(results.data)) {
      throw new Error('Invalid price history CSV format');
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffInDays = dateDifferenceInDays(today, PIVOT_ACTIVE_DATE);
    const shouldShiftDates = diffInDays != 0;

    for (const record of results.data) {
      record.date = new Date(record.date);
      record.date.setHours(0, 0, 0, 0);
      if (shouldShiftDates) {
        if(diffInDays>0) {
          record.date.setDate(record.date.getDate() + diffInDays);
        } else {
          record.date.setDate(record.date.getDate() - diffInDays);
        }
      }
    }
    //   cachedPriceHistory = results.data;
    //   return cachedPriceHistory;
    return results.data;
  } catch (error) {
    console.error('Error loading price history:', error);
    return [];
  }
}

function dateDifferenceInDays(date1: Date, date2: Date) {
  const normalizedDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const normalizedDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

  const timeDifference =  normalizedDate1.getTime() - normalizedDate2.getTime();
  const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

  return dayDifference;
}


export default useStore;