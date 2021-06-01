import puppeteer from "https://deno.land/x/puppeteer@9.0.1/mod.ts";
import { LOCATIONS } from "./locations.ts";

const DRY_RUN = !!Deno.env.get("DRY_RUN");

const FULL_NAME = Deno.env.get("FULL_NAME");
const AGE = Deno.env.get("AGE");
const STREET = Deno.env.get("STREET");
const ZIP_AND_CITY = Deno.env.get("ZIP_AND_CITY");
const PHONE = Deno.env.get("PHONE");
const LOCATION = Deno.env.get("LOCATION");

if (!FULL_NAME) {
  throw new Error("Missing FULL_NAME");
}
if (!AGE) {
  throw new Error("Missing AGE");
}
if (!STREET) {
  throw new Error("Missing STREET");
}
if (!ZIP_AND_CITY) {
  throw new Error("Missing ZIP_AND_CITY");
}
if (!PHONE) {
  throw new Error("Missing PHONE");
}
if (!LOCATION) {
  throw new Error("Missing LOCATION");
}
if (!LOCATIONS.includes(LOCATION)) {
  throw new Error("Invalid LOCATION");
}

const browser = await puppeteer.launch({
  headless: true,
});

const page = await browser.newPage();
await page.goto(
  "https://www.regionh.dk/presse-og-nyt/pressemeddelelser-og-nyheder/Sider/Tilmelding-til-at-modtage-overskydende-vaccine-mod-COVID-19.aspx",
  {
    waitUntil: "networkidle2",
  },
);

// Skip the main page
await page.click("input.next-button");

const fillStep = async (field: string, text: string) => {
  console.log('Filling', field)
  await page.waitForSelector('input[type="text"]');
  await page.type('input[type="text"]', text);
  await page.click("input.next-button");
};

// Fill in details
await fillStep('FULL_NAME', FULL_NAME);
await fillStep('AGE', AGE);
await fillStep('STREET', STREET);
await fillStep('ZIP_AND_CITY', ZIP_AND_CITY);
await fillStep('PHONE', PHONE);

// Select location
await page.waitForSelector('input[type="radio"]');
const label = await page.$x(`//label[contains(text(), "${LOCATION}")]`);
await label[0].click();
await page.click("input.next-button");

// Accept "your data"
await page.waitForTimeout(1_000);
await page.click("input.next-button");

// Submit the form
if (!DRY_RUN) {
  await page.waitForTimeout(1_000);
  await page.click("input.next-button");
}

// Make sure the form is submitted before we close the browser
await page.waitForTimeout(5_000);
await browser.close();

console.log("Success!");
