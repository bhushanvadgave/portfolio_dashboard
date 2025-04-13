import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import random

# Read assets and asset types
with open('src/assets/assets.json', 'r') as f:
    assets = json.load(f)['assets']

with open('src/assets/asset_types.json', 'r') as f:
    asset_types = json.load(f)['asset_types']

# Generate date range
start_date = datetime(2015, 5, 1)
end_date = datetime(2025, 4, 12)
date_range = pd.date_range(start=start_date, end=end_date, freq='D')

# Initialize DataFrame
df = pd.DataFrame(index=date_range)

# Base prices and volatility for each asset type
asset_type_configs = {
    'stock': {
        'daily_volatility': 0.02,  # 2% daily volatility
        'trend': 0.0001  # Slight upward trend
    },
    'gold': {
        'daily_volatility': 0.01,  # 1% daily volatility
        'trend': 0.00005  # Very slight upward trend
    },
    'crypto': {
        'daily_volatility': 0.05,  # 5% daily volatility
        'trend': 0.0002  # Stronger upward trend
    },
    'mutual_fund': {
        'daily_volatility': 0.015,  # 1.5% daily volatility
        'trend': 0.00008  # Moderate upward trend
    },
    'fd': {
        'yearly_return': 0.07  # 7% yearly return
    },
    'real_estate': {
        'yearly_return': 0.08  # 8% yearly return
    }
}

# Starting prices for each asset
asset_starting_prices = {
    # Stocks
    'tata_steel': 500,
    'reliance_industries': 1000,
    'adani_enterprises': 200,
    'asian_paints': 1000,
    'bharti_airtel': 400,
    'bajaj_finserv': 1500,
    'hdfc_bank': 1000,
    'infosys': 1000,
    'itc': 300,
    'hero_moto_corps': 2500,
    'mahindra_and_mahindra': 1000,
    
    # Mutual Funds
    'parag_parikh': 100,
    'nippon_india_growth_fund': 100,
    'nippon_india_small_cap_fund': 100,
    'dsp_elss_tax_saver_fund': 100,
    'nippon_india_multi_cap_fund': 100,
    'quant_multi_cap_fund': 100,
    
    # Gold
    'physical_gold': 30000,
    'sgb': 30000,
    
    # Real Estate
    'mumbai_house': 10000000,
    'pune_commercial_property': 5000000,
    
    # Fixed Deposits
    'kotak_bank_fd1': 100000,
    'kotak_bank_fd2': 100000,
    
    # Crypto
    'bitcoin': 50000,
    'ethereum': 3000
}

# Generate price history for each asset
for asset_id, asset_info in assets.items():
    asset_type = asset_info['asset_type']
    config = asset_type_configs[asset_type]
    starting_price = asset_starting_prices[asset_id]
    
    if asset_type in ['stock', 'gold', 'crypto', 'mutual_fund']:
        # Daily changing assets
        prices = [starting_price]
        for i in range(1, len(date_range)):
            if date_range[i].weekday() < 5:  # Only weekdays
                prev_price = prices[-1]
                # Generate random price change with trend
                change = np.random.normal(config['trend'], config['daily_volatility'])
                new_price = prev_price * (1 + change)
                prices.append(new_price)
            else:
                # Weekend - same as previous day
                prices.append(prices[-1])
    else:
        # Yearly changing assets (FD and real estate)
        prices = []
        current_price = starting_price
        current_year = start_date.year
        
        for date in date_range:
            if date.year > current_year:
                # New year - apply yearly return
                current_price *= (1 + config['yearly_return'])
                current_year = date.year
            prices.append(current_price)
    
    df[asset_id] = prices

# Round prices to 2 decimal places
df = df.round(2)

# Save to CSV
df.to_csv('src/assets/asset_price_history.csv') 