import 'zone.js/node';
import express from 'express';
import { join } from 'path';
import { renderApplication } from '@angular/platform-server';
import bootstrap from './src/main.server';

const app = express();

const PORT = process.env['PORT'] || 4000;
const distFolder = join(process.cwd(), 'dist/frontend/browser');

// Sert les fichiers statiques (JS, CSS, assets)
app.use(express.static(distFolder, {
  maxAge: '1y'
}));

// Toutes les autres routes passent par le SSR
app.get('*', async (req, res) => {
  try {
    const html = await renderApplication(bootstrap, {
      document: '<app-root></app-root>', // la racine de ton app Angular
      url: req.url
    });
    res.status(200).send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

app.listen(PORT, () => {
  console.log(`Serveur SSR lancé sur http://localhost:${PORT}`);
});
