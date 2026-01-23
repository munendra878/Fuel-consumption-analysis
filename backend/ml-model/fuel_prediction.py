import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib

# Load data
data = pd.read_csv("dataset/fuel_data.csv")

# Features and target
X = data[['engineSize', 'horsepower', 'cylinders']]
y = data['fuelConsumption']

# Train model
model = LinearRegression()
model.fit(X, y)

# Save model
joblib.dump(model, "fuel_model.pkl")
print("Model trained and saved as fuel_model.pkl")