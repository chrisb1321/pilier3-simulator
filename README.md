# Simulateur de Retraite 3ème Pilier

Une application web interactive de simulation de retraite pour le 3ème pilier, conçue pour être intégrée sur un site WordPress.

## Fonctionnalités

- Workflow de simulation en 5 étapes
- Saisie des informations personnelles
- Configuration des revenus et de l'épargne
- Définition des objectifs de retraite
- Paramètres de projection personnalisables
- Visualisation des résultats avec graphiques
- Interface utilisateur moderne et intuitive

## Technologie utilisée

- React
- TypeScript
- Tailwind CSS
- React Hook Form + Zod pour la validation des formulaires
- Chart.js pour les visualisations

## Installation

### Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn

### Étapes d'installation

1. Cloner le dépôt :
```bash
git clone [url-du-dépôt]
cd pilier3-simulator
```

2. Installer les dépendances :
```bash
npm install
# ou 
yarn install
```

3. Démarrer le serveur de développement :
```bash
npm run dev
# ou
yarn dev
```

4. Construire pour la production :
```bash
npm run build
# ou
yarn build
```

## Intégration avec WordPress

Pour intégrer cette application dans WordPress, vous pouvez :

1. Construire l'application avec `npm run build`
2. Copier les fichiers de build dans votre thème WordPress
3. Utiliser un shortcode pour afficher l'application :

```php
// Dans functions.php de votre thème
function pilier3_simulator_shortcode() {
    return '<div id="pilier3-simulator-root"></div>';
}
add_shortcode('pilier3_simulator', 'pilier3_simulator_shortcode');
```

Puis ajouter les scripts et styles nécessaires :

```php
function enqueue_pilier3_simulator_assets() {
    wp_enqueue_style('pilier3-simulator-style', get_template_directory_uri() . '/pilier3-simulator/build/static/css/main.css');
    wp_enqueue_script('pilier3-simulator-js', get_template_directory_uri() . '/pilier3-simulator/build/static/js/main.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'enqueue_pilier3_simulator_assets');
```

## Personnalisation

Vous pouvez personnaliser l'apparence de l'application en modifiant les variables CSS dans `src/index.css` ou en ajustant les paramètres dans `tailwind.config.js`.

## Licence

MIT 