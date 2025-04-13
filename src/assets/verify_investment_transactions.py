import pandas as pd
import numpy as np
from datetime import datetime

# Read both files
transactions = pd.read_csv('src/assets/investment_transactions.csv')
price_history = pd.read_csv('src/assets/asset_price_history.csv', index_col=0, parse_dates=True)

# Convert date to datetime in transactions
transactions['date'] = pd.to_datetime(transactions['date'])

# Initialize counters
total_transactions = len(transactions)
mismatched_transactions = 0
corrected_transactions = 0

# Verify each transaction
for idx, row in transactions.iterrows():
    date = row['date']
    asset_id = row['asset_id']
    recorded_price = row['per_unit_price']
    
    # Get actual price from price history
    try:
        actual_price = price_history.loc[date, asset_id]
        
        # Check if prices match (allowing for small floating point differences)
        if not np.isclose(recorded_price, actual_price, rtol=1e-05, atol=1e-08):
            mismatched_transactions += 1
            
            # Update the transaction with correct price and amount
            transactions.at[idx, 'per_unit_price'] = actual_price
            transactions.at[idx, 'amount'] = row['quantity'] * actual_price
            corrected_transactions += 1
            
    except KeyError:
        print(f"Warning: No price data found for {asset_id} on {date}")
        continue

# Save corrected transactions
transactions.to_csv('src/assets/investment_transactions.csv', index=False)

# Print verification results
print(f"Verification complete:")
print(f"Total transactions: {total_transactions}")
print(f"Mismatched transactions: {mismatched_transactions}")
print(f"Corrected transactions: {corrected_transactions}")
print(f"Percentage of mismatches: {(mismatched_transactions/total_transactions)*100:.2f}%") 