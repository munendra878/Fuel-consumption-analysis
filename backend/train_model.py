import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
import os

# Load dataset
data_path = "dataset/fuel_data.csv"
if not os.path.exists(data_path):
    raise FileNotFoundError(f"{data_path} not found!")

data = pd.read_csv(data_path)

# Features and target
X = data[['engineSize', 'horsepower', 'cylinders']]
y = data['fuelConsumption']

# Train model
model = LinearRegression()
model.fit(X, y)

# Save model
os.makedirs("ml-model", exist_ok=True)
joblib.dump(model, "ml-model/fuel_model.pkl")

print("Model trained and saved at ml-model/fuel_model.pkl")
