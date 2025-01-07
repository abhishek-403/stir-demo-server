import mongoose, { Schema, Document } from "mongoose";

interface ITrends extends Document {
  trends: string[];
  ip: string;
  date: string;
}

const TrendsSchema: Schema = new Schema({
  trends: { type: [String], required: true },
  ip: { type: String, required: true },
  date: { type: String, required: true },
});

export default mongoose.model<ITrends>("Trends", TrendsSchema);
