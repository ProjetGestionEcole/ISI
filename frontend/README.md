# Frontend

Ce projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version **20.1.x**.

##  Démarrage rapide

### Prérequis
- [Node.js](https://nodejs.org) version 18 ou 20 recommandée.
- Pas besoin d’installer Angular CLI globalement.

### Installation
```bash
npm install
```
Lancer le serveur de développement
Utilisez l’une de ces commandes :

```bash
npm start
```
Ou
```bash
npx ng serve
```
- Ces deux commandes utilisent la version CLI locale (@angular/cli@20.x), et garantissent que le projet fonctionne quel que soit ce que vous avez globalement.
- Accédez à http://localhost:4200/. L’application se recharge automatiquement si vous modifiez les fichiers sources.---
### ⚠️À savoir sur ng serve
Si vous faites directement :
```bash
ng serve
```
Et que vous avez :
une version différente de CLI (ex: Angular 17 ou 16) installée globalement
ou pas de CLI global du tout.
Le projet risque de ne pas fonctionner ou générer des erreurs.

---
### 💡Recommandation
Utilisez toujours npx ng serve ou npm start (relié à la version CLI locale fournie dans ce projet).

Si vous voulez tout de même faire ng serve, vous pouvez aligner votre CLI global :

```bash
npm install -g @angular/cli@20
```

📂 Structure du projet

```
frontend/
├── 📁 node_modules/                 # Dépendances installées automatiquement via npm (à ne pas modifier manuellement)
├── 📁 src/                          # Code source principal de l'application Angular (composants, routes, services, etc.)
│   ├── favicon.ico                  # Icône de l'application
│   ├── index.html                   # Page HTML principale
│   ├── main.ts                     # Point d’entrée côté client
│   ├── main.server.ts              # Point d’entrée côté serveur (SSR)
│   ├── styles.css                  # Styles globaux
│   ├── 📁 app/                     # Composants, services, routes Angular
│   │   ├── app.component.ts        # Composant racine
│   │   ├── app.component.html      # Template du composant racine
│   │   ├── app.component.css       # Styles du composant racine
│   │   ├── app.component.spec.ts  # Tests unitaires
│   │   ├── app.config.ts           # Configuration Angular custom (exemple)
│   │   ├── app.config.server.ts    # Config serveur (SSR)
│   │   └── app.routes.ts           # Définition des routes Angular
│   └── 📁 assets/                  # Ressources statiques (images, polices, etc.)
│       └── .gitkeep                # Fichier vide pour garder le dossier dans git
├── 📄 angular.json                 # Configuration CLI Angular (build, test, serve)
├── 📄 package.json                # Dépendances, scripts et métadonnées npm
├── 📄 package-lock.json           # Verrouillage des versions npm exactes
├── 📄 tsconfig.json               # Configuration TypeScript globale
├── 📄 tsconfig.app.json           # Config TypeScript spécifique au projet Angular (src/)
├── 📄 README.md                   # Documentation du projet
├── 📄 LICENSE.json                # Licence du projet (optionnelle)

```