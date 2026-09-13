'use strict';
const { chromium } = require('A:/project/cxx10/cxx-repodock/node_modules/playwright-core');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: { width: 1400, height: 600 } });
    const page = await ctx.newPage();
    page.on('pageerror', err => console.error('PAGE ERR:', err.message));

    await page.goto('http://127.0.0.1:8001/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => {
        const grid = document.getElementById('grid');
        return grid && grid.children.length > 50;
    });

    await page.evaluate((types) => {
        const grid = document.getElementById('grid');
        grid.innerHTML = '';
        grid.style.cssText = 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 24px;';
        for (const t of types) {
            const cell = document.createElement('div');
            cell.style.cssText = 'background: #252525; border: 1px solid #2f2f2f; border-radius: 6px; padding: 16px 12px; text-align: center;';
            cell.innerHTML = `<img src="icons/file-${t}.svg" style="width:120px;height:120px;display:block;margin:0 auto 8px;">
                <div style="font:12px monospace;color:#d4d4d4">${t}</div>`;
            grid.appendChild(cell);
        }
        document.querySelector('main').style.padding = '0';
    }, ['doc','sheet','slide']);

    await page.waitForTimeout(500);
    await page.screenshot({ path: 'A:/temp/cxx-ui-office.png', fullPage: false });
    console.log('Saved');

    await browser.close();
})().catch(err => { console.error('err:', err.message); process.exit(1); });
