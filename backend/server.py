from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import os

# Load trained model
model_path = "ml-model/fuel_model.pkl"
if not os.path.exists(model_path):
    raise FileNotFoundError(f"{model_path} not found!")

model = joblib.load(model_path)

app = FastAPI()

# Input validation
class VehicleInput(BaseModel):
    engineSize: float
    horsepower: float
    cylinders: int

@app.get("/")
def root():
    return {"message": "Prediction API is live! Use POST with engineSize, horsepower, cylinders."}

@app.post("/predict")
def predict(data: VehicleInput):
    X = [[data.engineSize, data.horsepower, data.cylinders]]
    prediction = model.predict(X)[0]
    return {"predictedFuel": round(prediction, 2)}
