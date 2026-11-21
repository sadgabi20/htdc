import { chromium } from "@playwright/test"; // Or: import { chromium } from 'playwright';
import type { HTMLDoc } from "./types.ts";
import { htdc2html } from "./compositor/index.ts";
import path from "node:path";
import * as fs from "node:fs/promises";

const CSS_PATH = path.resolve(import.meta.dirname, '../src/styles/default.css');
const CSS = await fs.readFile(CSS_PATH, { encoding: 'utf-8' });

export async function html2pdf(htmlDoc: HTMLDoc, css: string) {
    const { fileName, html } = htmlDoc;

    // 1. Launch the browser
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        // 3. Load HTML and inject CSS
        await page.setContent(html, { waitUntil: 'networkidle' });
        await page.addStyleTag({ content: css });

        // 4. (Optional but recommended) Set the media type to 'print'
        // Playwright uses 'print' by default, but being explicit avoids surprises.
        await page.emulateMedia({ media: 'print' });

        // 5. Generate the PDF
        await page.pdf({
            path: fileName + '.pdf', // The file path for the generated PDF
            printBackground: true,     // Essential for backgrounds/images to appear
            preferCSSPageSize: true,   // Lets your @page CSS dictate the paper size
        });

        console.log('PDF generated successfully');
    } finally {
        // Always close the browser
        await browser.close();
    }
}

export async function htdc2pdf(src:string) {
    const htmlDoc = await htdc2html(src);
    await html2pdf(htmlDoc, CSS);
}