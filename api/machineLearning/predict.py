"""
real_estate_predictor.py

This script loads a trained machine learning model and associated encoders to evaluate a real estate property's price.
It receives input data via command-line arguments (as JSON), processes the data, performs feature engineering, 
makes a prediction, and compares the predicted price to the actual price to assess whether the listing is underpriced, 
overpriced, or fairly priced.

Workflow:
1. Load the pre-trained model and encoders.
2. Parse and transform input JSON data into a Pandas DataFrame.
3. Apply label encoding to categorical variables (city, property_type).
4. Perform feature engineering (e.g., city average price per m², bedrooms per m², bathrooms per m²).
5. Predict the log price using the model and convert it to actual price (via exponential).
6. Apply post-processing adjustments:
   - Apply furnishing discount (if not furnished).
   - Adjust price based on property age using depreciation rules.
7. Compare the predicted price to the actual listing price using a ±10% margin.
8. Return a JSON response with:
   - The estimated fair price
   - A label indicating whether the listing is "Underpriced", "Overpriced", or "Fairly Priced"

Input:
- JSON via command-line argument (sys.argv[1]), including:
  {
    "city": "Beirut",
    "square_meter": 120,
    "property_type": "apartment",
    "bedrooms": 3,
    "bathrooms": 2,
    "living_rooms": 1,
    "balconies": 2,
    "parking_spaces": 1,
    "furnished": true,       # optional
    "year_built": 2010,      # optional
    "price": 250000
  }

Output:
- JSON printed to stdout:
  {
    "predicted_price": 235000.0,
    "price_status": "Overpriced"
  }

Note:
- This script is intended to be executed via subprocess from a backend server/controller.

"""

import sys
import json
import pandas as pd
import numpy as np
import pickle
from datetime import datetime

# Load pre-trained model and encoders
model = pickle.load(open('machineLearning/real_estate_model.pkl', 'rb'))
label_encoder_city = pickle.load(open('machineLearning/label_encoder_city.pkl', 'rb'))
label_encoder_property_type = pickle.load(open('machineLearning/label_encoder_property_type.pkl', 'rb'))

# Load input data
input_data = json.loads(sys.argv[1])

# Prepare the input data
input_df = pd.DataFrame([input_data])

# Encode categorical features
input_df['city'] = label_encoder_city.transform(input_df['city'])
input_df['property_type'] = label_encoder_property_type.transform(input_df['property_type'])

# Feature engineering (same as during training)
city_avg_price_per_m2 = pickle.load(open('machineLearning/city_avg_price_per_m2.pkl', 'rb'))
input_df['city_avg_price_per_m2'] = input_df['city'].replace(city_avg_price_per_m2)
input_df['bedrooms_per_m2'] = input_df['bedrooms'] / input_df['square_meter']
input_df['bathrooms_per_m2'] = input_df['bathrooms'] / input_df['square_meter']

# Prepare the features (same as during training)
features = ['city', 'square_meter', 'property_type', 'bedrooms', 'bathrooms',
            'living_rooms', 'balconies', 'parking_spaces', 
            'city_avg_price_per_m2', 'bedrooms_per_m2', 'bathrooms_per_m2']

input_data_processed = input_df[features]

# Make the prediction
predicted_log_price = model.predict(input_data_processed)
predicted_price = np.exp(predicted_log_price)[0]  # Convert from log scale to actual price

# Adjust predicted price based on furnishing
if not input_data.get('furnished', True):
    predicted_price *= 0.9

# Adjust predicted price based on property age
current_year = datetime.now().year
year_built = input_data.get('year_built')
if year_built:
    property_age = current_year - year_built
    if property_age >= 40:
        predicted_price *= 0.8
    elif property_age >= 30:
        predicted_price *= 0.85
    elif property_age >= 20:
        predicted_price *= 0.9
    elif property_age >= 10:
        predicted_price *= 0.95

# Calculate fair pricing margin (10% margin)
margin = 0.1
actual_price = input_data['price']  # Assuming the 'price' field is included in input_data

# Define price status function (underpriced, fairly priced, overpriced)
def get_price_status(actual, predicted, margin):
    margin_value = predicted * margin
    if actual < (predicted - margin_value):
        return 1  # Underpriced
    elif actual > (predicted + margin_value):
        return -1  # Overpriced
    else:
        return 0  # Fairly Priced

# Get price status
price_status = get_price_status(actual_price, predicted_price, margin)

# Prepare the response as JSON
response = {
    'predicted_price': predicted_price,
    'price_status': "Underpriced" if price_status == 1 else "Overpriced" if price_status == -1 else "Fairly Priced"
}

# Output the response as a JSON string
print(json.dumps(response))
