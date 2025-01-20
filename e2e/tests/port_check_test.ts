import { chromium } from "npm:playwright";
import { assertEquals } from "https://deno.land/std@0.216.0/assert/mod.ts";

Deno.test("ポート15555でページが存在するか確認", async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    const response = await page.goto("http://localhost:15555");
    assertEquals(response?.status(), 200);
  } finally {
    await browser.close();
  }
});
