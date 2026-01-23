import pandas as pd
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Load the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml-model/fuel_model.pkl")
model = joblib.load(MODEL_PATH)

@app.route("/predict", methods=["POST"])
def predict_fuel():
    try:
        data = request.get_json()
        # Ensure keys match training columns
        engineSize = data.get("engineSize")
        horsepower = data.get("horsepower")
        cylinders = data.get("cylinders")

        if engineSize is None or horsepower is None or cylinders is None:
            return jsonify({"error": "All fields are required"}), 400

        # Create a DataFrame with correct column names
        X_new = pd.DataFrame(
            [[engineSize, horsepower, cylinders]],
            columns=["engineSize", "horsepower", "cylinders"]
        )

        # Predict
        predicted_fuel = model.predict(X_new)[0]

        return jsonify({"predictedFuel": round(float(predicted_fuel), 2)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
