import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import random

# Read assets and price history
with open('src/assets/assets.json', 'r') as f:
    assets = json.load(f)['assets']

price_history = pd.read_csv('src/assets/asset_price_history.csv', index_col=0, parse_dates=True)

# Filter for stock and mutual fund assets
tradable_assets = {k: v for k, v in assets.items() if v['asset_type'] in ['stock', 'mutual_fund']}

# Generate date range for transactions
start_date = datetime(2015, 5, 1)
end_date = datetime(2025, 4, 12)

# Initialize transaction list
transactions = []

# Base investment amount that increases over time
def get_monthly_investment_amount(date):
    # Base amount increases from 20K to 1.5L over 10 years
    base_amount = 20000 + (130000 * ((date - start_date).days / (end_date - start_date).days))
    # Add some randomness (±20%)
    return base_amount * (1 + np.random.normal(0, 0.2))

# Generate transactions
current_date = start_date
while current_date <= end_date:
    # Skip weekends
    if current_date.weekday() < 5:
        try:
            # Get available assets and their prices for the day
            day_prices = price_history.loc[current_date]
            available_assets = [asset_id for asset_id in tradable_assets.keys() 
                              if asset_id in day_prices.index and not pd.isna(day_prices[asset_id])]
            
            if not available_assets:
                current_date += timedelta(days=1)
                continue
            
            # Decide number of investments for the day (1-3)
            num_investments = np.random.choice([1, 2, 3], p=[0.6, 0.3, 0.1])
            
            # Distribute investment amount among selected assets
            investment_amount = get_monthly_investment_amount(current_date)
            amounts = np.random.dirichlet(np.ones(num_investments)) * investment_amount
            
            # Create transactions
            for amount in amounts:
                # Select random asset
                asset_id = np.random.choice(available_assets)
                per_unit_price = day_prices[asset_id]
                
                # Calculate quantity (round to nearest whole number)
                quantity = round(amount / per_unit_price)
                
                # Skip if quantity is 0
                if quantity == 0:
                    continue
                
                # Adjust amount to match quantity * price
                amount = quantity * per_unit_price
                
                transactions.append({
                    'date': current_date.strftime('%Y-%m-%d'),
                    'asset_id': asset_id,
                    'quantity': quantity,
                    'per_unit_price': per_unit_price,
                    'amount': amount
                })
        except KeyError:
            # Skip if no price data for this date
            pass
    
    # Move to next day
    current_date += timedelta(days=1)
    
    # Add some random gaps between investment days (1-7 days)
    if random.random() < 0.3:  # 30% chance of gap
        current_date += timedelta(days=random.randint(1, 7))

# Convert to DataFrame
df = pd.DataFrame(transactions)

# Sort by date
df = df.sort_values('date')

# Verify price consistency
mismatches = 0
for idx, row in df.iterrows():
    date = pd.to_datetime(row['date'])
    asset_id = row['asset_id']
    recorded_price = row['per_unit_price']
    actual_price = price_history.loc[date, asset_id]
    
    if not np.isclose(recorded_price, actual_price, rtol=1e-05, atol=1e-08):
        mismatches += 1
        df.at[idx, 'per_unit_price'] = actual_price
        df.at[idx, 'amount'] = row['quantity'] * actual_price

print(f"Total transactions generated: {len(df)}")
print(f"Price mismatches found and corrected: {mismatches}")

# Save to CSV
df.to_csv('src/assets/investment_transactions.csv', index=False) 