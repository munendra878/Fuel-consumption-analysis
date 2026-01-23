import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    engineSize: { type: Number, required: true },
    horsepower: { type: Number, required: true },
    cylinders: { type: Number, required: true },
    fuelConsumption: { type: Number, required: true },
    co2: { type: Number, required: true },
  },
  { timestamps: true }
);

const Vehicle =
  mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
