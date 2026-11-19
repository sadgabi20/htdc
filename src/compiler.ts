import { chromium } from "@playwright/test"; // Or: import { chromium } from 'playwright';

export async function createPDF(html: string, css: string) {
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
            path: 'custom-output.pdf', // The file path for the generated PDF
            printBackground: true,     // Essential for backgrounds/images to appear
            preferCSSPageSize: true,   // Lets your @page CSS dictate the paper size
        });

        console.log('PDF generated successfully');
    } finally {
        // Always close the browser
        await browser.close();
    }
}