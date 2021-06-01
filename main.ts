import puppeteer from "https://deno.land/x/puppeteer@9.0.1/mod.ts";
import { LOCATIONS } from "./locations.ts";

const PERSON_FULL_NAME = Deno.env.get("FULL_NAME");
const PERSON_AGE = Deno.env.get("AGE");
const PERSON_ADDRESS = Deno.env.get("STREET");
const PERSON_ZIP_AND_CITY = Deno.env.get("ZIP_AND_CITY");
const PERSON_PHONE = Deno.env.get("PHONE");
const PERSON_LOCATION = Deno.env.get("LOCATION");

if (!PERSON_FULL_NAME) {
  throw new Error("Missing FULL_NAME");
}
if (!PERSON_AGE) {
  throw new Error("Missing AGE");
}
if (!PERSON_ADDRESS) {
  throw new Error("Missing ADDRESS");
}
if (!PERSON_ZIP_AND_CITY) {
  throw new Error("Missing ZIP_AND_CITY");
}
if (!PERSON_PHONE) {
  throw new Error("Missing PHONE");
}
if (!PERSON_LOCATION) {
  throw new Error("Missing LOCATION");
}
if (!LOCATIONS.includes(PERSON_LOCATION)) {
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

const fillStep = async (text: string) => {
  await page.waitForSelector('input[type="text"]');
  await page.type('input[type="text"]', text);
  await page.click("input.next-button");
};

// Fill in details
await fillStep(PERSON_FULL_NAME);
await fillStep(PERSON_AGE);
await fillStep(PERSON_ADDRESS);
await fillStep(PERSON_ZIP_AND_CITY);
await fillStep(PERSON_PHONE);

// Select location
await page.waitForSelector('input[type="radio"]');
const label = await page.$x(`//label[contains(text(), "${PERSON_LOCATION}")]`);
await label[0].click();
await page.click("input.next-button");

// Accept "your data"
await page.waitForTimeout(1_000);
await page.click("input.next-button");

// Submit the form
await page.waitForTimeout(1_000);
await page.click("input.next-button");

// Make sure the form is submitted before we close the browser
await page.waitForTimeout(5_000);
await browser.close();

console.log("Success!");
