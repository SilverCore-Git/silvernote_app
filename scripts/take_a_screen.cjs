const puppeteer = require('puppeteer');
const path = require('path');

// Récupère le mode depuis les arguments en ligne de commande
const mode = process.argv[2] || 'desktop';

// Définition des tailles par mode
const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
  fullhd: { width: 1920, height: 1080 }
};

// Vérifie si le mode est valide
if (!viewports[mode]) {
  console.error(`❌ Mode inconnu : "${mode}". Utilisez : mobile, tablet, desktop ou fullhd`);
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Appliquer le viewport correspondant
  await page.setViewport(viewports[mode]);

  await page.goto('http://localhost:5173');

  const filePath = path.join(__dirname, `screen/home-${mode}.png`);
  await page.screenshot({ path: filePath, fullPage: true });

  console.log(`✅ Screenshot enregistré : ${filePath}`);

  await browser.close();
})();
