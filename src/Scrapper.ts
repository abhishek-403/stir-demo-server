import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import {
  AUTH_URL,
  AUTH_EMAIL,
  AUTH_BTN,
  AUTH_USERNAME,
  AUTH_BTN2,
  AUTH_PASS,
  AUTH_BTN3,
  EXPLORE_BTN,
  SPAN_CLASS,
  TRENDING_BTN,
} from "./constants";
import axios from "axios";

const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function getProxyIP() {
  try {
    const response = await axios.get("https://ipv4.webshare.io/");
    console.log("Current IP:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching IP:", error);
  }
}

let proxy = "http://krhgtolx-rotate:hpa7nl2bl8j9@p.webshare.io:80";
const proxyList = [
  "http://krhgtolx:hpa7nl2bl8j9@198.23.239.134.webshare.io:6540",
  "http://krhgtolx:hpa7nl2bl8j9@207.244.217.165.webshare.io:6712",
  "http://krhgtolx:hpa7nl2bl8j9@107.172.163.27.webshare.io:6543",
  "http://krhgtolx:hpa7nl2bl8j9@64.137.42.112.webshare.io:5157",
  "http://krhgtolx:hpa7nl2bl8j9@161.123.152.115.webshare.io:6360",
  "http://krhgtolx:hpa7nl2bl8j9@173.211.0.148.webshare.io:6641",
];
const EMAIL = process.env.EMAIL!;
const USERNAME = process.env.USER_NAME!;
const PASS = process.env.PASS!;

export async function loginAndScrape() {
  let options = new chrome.Options();
  let proxy = proxyList[Math.floor(Math.random() * proxyList.length)]; // Pick a random proxy from the list
  console.log(EMAIL, USERNAME, PASS);
  
  // options.addArguments(`--proxy-server=${proxy}`);
  // options.addArguments("headless");

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  try {
    // Navigate to the authentication URL
    // await getProxyIP();
    // const a = await driver.get("https://ipv4.webshare.io/");
    console.log("ip", proxy);

    await driver.get(AUTH_URL);
    await driver.wait(until.urlIs(AUTH_URL), 12000);
    await driver.wait(until.elementLocated(By.className(AUTH_EMAIL)), 10000);
    console.log("Page is fully loaded.");

    // Enter email
    await driver.findElement(By.className(AUTH_EMAIL)).sendKeys(EMAIL);
    await driver.findElement(By.xpath(AUTH_BTN)).click();

    //username
    await driver.wait(until.elementLocated(By.className(AUTH_USERNAME)), 10000);
    await driver.findElement(By.className(AUTH_USERNAME)).sendKeys(USERNAME);
    await driver.findElement(By.xpath(AUTH_BTN2)).click();

    // Wait for the password field to be present and enter password
    await driver.wait(until.elementLocated(By.className(AUTH_PASS)), 10000);
    await driver.findElement(By.className(AUTH_PASS)).sendKeys(PASS);
    await driver.findElement(By.xpath(AUTH_BTN3)).click();

    // Navigate to the trending URL
    await driver.wait(until.elementLocated(By.xpath(EXPLORE_BTN)), 10000);
    await driver.findElement(By.xpath(EXPLORE_BTN)).click();
    await driver.wait(until.elementLocated(By.xpath(TRENDING_BTN)), 10000);
    await driver.findElement(By.xpath(TRENDING_BTN)).click();
    // Wait for the trending elements to be present
    await sleep(2000);
    await driver.wait(until.elementLocated(By.className(SPAN_CLASS)), 10000);

    // Extract the first 5 elements with the specified class
    let elements = await driver.findElements(By.className(SPAN_CLASS));
    let texts = [];
    // console.log(elements);

    for (let i = 0; i < Math.min(elements.length, 5); i++) {
      let text = await elements[i].getText();
      console.log(text);
      texts.push(text);
    }

    return { texts, ip: proxy };
  } finally {
    await driver.quit();
  }
}
