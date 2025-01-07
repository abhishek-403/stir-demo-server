import mongoose from "mongoose";
const mongoUrl = process.env.MONGO_URL!;

async function connecting() {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoUrl).then(() => {
      console.log(`MongoDB connected`);
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}
export default connecting;
