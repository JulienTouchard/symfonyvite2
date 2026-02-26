# Integration Vite + React dans Symfony

Ce document explique une integration simple et pedagogique de **Vite + React** dans un projet **Symfony 7/8**, avec mode developpement et deploiement production.

## 1) Prerequis

- PHP 8.2+
- Composer
- Node.js 20+
- npm
- Symfony CLI (optionnel mais recommande)

Verifier rapidement:

```powershell
php -v
composer -V
node -v
npm -v
symfony -V
```

## 2) Installer les dependances frontend

Depuis la racine du projet Symfony:

```powershell
npm install
```

Packages attendus:

- `vite`
- `@vitejs/plugin-react`
- `react`
- `react-dom`

## 3) Structure recommandee

Exemple minimal:

- `assets/main.jsx` (point d'entree React)
- `assets/component/Home.jsx` (composant)
- `vite.config.js`
- `templates/base.html.twig`

## 4) Configurer Vite

### Exemple de config "production-friendly" (build dans `public/build`)

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "assets",
  base: "/build/",
  build: {
    outDir: "../public/build",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        app: "./main.jsx",
      },
    },
  },
  server: {
    strictPort: true,
    port: 5173,
    origin: "http://localhost:5173",
  },
});
```

Important:

- si `root: "assets"`, alors l'entree est `./main.jsx` (pas `assets/main.jsx`).
- le `manifest.json` est indispensable pour lier les fichiers buildes proprement en prod.

## 5) Point d'entree React

`assets/main.jsx`:

```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import Home from "./component/Home";

const homeContainer = document.getElementById("home");
if (homeContainer) {
  const props = JSON.parse(homeContainer.dataset.props ?? "{}");
  createRoot(homeContainer).render(<Home {...props} />);
}
```

Le `if (homeContainer)` evite l'erreur:
`Target container is not a DOM element`.

## 6) Passer des variables Symfony vers React

### Controller Symfony

```php
#[Route('/', name: 'app_home')]
public function index(): Response
{
    $homeProps = [
        'title' => 'Page Home React',
        'username' => 'Julien',
        'cityCount' => 123,
    ];

    return $this->render('home/index.html.twig', [
        'home_props' => $homeProps,
    ]);
}
```

### Template Twig

```twig
<div id="home" data-props='{{ home_props|json_encode|e('html_attr') }}'></div>
```

### Composant React

```jsx
const Home = ({ title, username, cityCount }) => (
  <div>
    <h2>{title}</h2>
    <p>Bienvenue {username}</p>
    <p>Nombre de villes chargees: {cityCount}</p>
  </div>
);

export default Home;
```

## 7) Integration Twig en developpement (HMR)

Dans `templates/base.html.twig`, charger Vite en dev:

```twig
{% if app.environment == 'dev' %}
  <script type="module">
    import RefreshRuntime from 'http://localhost:5173/@react-refresh'
    RefreshRuntime.injectIntoGlobalHook(window)
    window.$RefreshReg$ = () => {}
    window.$RefreshSig$ = () => (type) => type
    window.__vite_plugin_react_preamble_installed__ = true
  </script>
  <script type="module" src="http://localhost:5173/@vite/client"></script>
  <script type="module" src="http://localhost:5173/main.jsx"></script>
{% endif %}
```

## 8) Integration Twig en production (fichiers buildes)

Apres build, les fichiers ont un hash (ex: `app-XXXX.js`). Il faut lire `public/build/.vite/manifest.json`.

Approche simple:

1. creer une petite fonction/helper Symfony qui lit le manifest,
2. injecter les bons `<script>`/`<link>` dans Twig.

Alternative: installer un bundle ou une integration Vite dediee Symfony pour automatiser cette partie.

## 9) Lancement en developpement

Terminal 1 (Symfony):

```powershell
symfony serve
```

Terminal 2 (Vite):

```powershell
npm run dev
```

Ensuite ouvrir:

- Symfony: `http://127.0.0.1:8000`
- Vite HMR: `http://localhost:5173` (utilise en source des scripts, pas comme page Symfony)

## 10) Build et deploiement production

### Build frontend

```powershell
npm run build
```

Ajoute ce script dans `package.json` si besoin:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

### Checklist deploiement

1. `composer install --no-dev --optimize-autoloader`
2. `npm ci`
3. `npm run build`
4. `php bin/console cache:clear --env=prod`
5. deployer `public/build` avec le code backend
6. verifier que Twig charge les assets depuis le `manifest` en prod

## 11) Erreurs frequentes

- `404 /` sur `localhost:5173`:
  - tu pointes vers `/` alors que Vite n'a pas d'`index.html` dans `assets`.
  - charge plutot `@vite/client` et `main.jsx`.

- `@vitejs/plugin-react can't detect preamble`:
  - le bloc preamble `@react-refresh` manque.

- `Target container is not a DOM element`:
  - l'element HTML (`id`) n'existe pas sur la page.
  - ajouter un garde (`if (container)`).

## 12) Resume

- Symfony rend la page Twig.
- Twig expose des donnees JSON dans `data-*`.
- `main.jsx` lit ces donnees et monte les composants React.
- Vite gere HMR en dev et build optimise en prod. 
