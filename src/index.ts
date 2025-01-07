import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { getProxyIP, loginAndScrape } from "./Scrapper";
import cors from "cors";
import bodyParser from "body-parser";
import mongoDB from "./dbConnect";
mongoDB();
import TrendsModel from "./TrendsModel";
const app = express();

app.use(cors());

app.use(bodyParser.json());

const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});
app.get("/ip", async (req: Request, res: Response) => {
  let ress = await getProxyIP();
  res.send(ress);
});
app.get("/getData", async (req: Request, res: Response) => {
  let ress = await TrendsModel.find().sort({ date: -1 });

  res.send(ress);
});
app.get("/extract", async (req: Request, res: Response) => {
  const { texts, ip } = await loginAndScrape();
  const date = new Date()
    .toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(",", "");

  const newTrend = new TrendsModel({
    trends: texts,
    ip,
    date,
  });

  await newTrend.save();
  res.send(newTrend);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
