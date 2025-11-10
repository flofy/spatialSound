# Spatial Sound 🎵

Une application web interactive de son spatial 3D utilisant la technologie HRTF (Head-Related Transfer Function) pour créer une expérience audio immersive.

## ✨ Fonctionnalités

- **Audio Spatial 3D** : Positionnement audio réaliste avec HRTF
- **Contrôle Interactif** : Mode manuel (glisser-déposer) et automatique
- **Volume Dynamique** : Ajustement automatique basé sur la distance en mode manuel
- **Mélodies Synthétisées** : Générées avec Tone.js
- **Support MP3** : Lecture de fichiers audio personnalisés
- **Interface Moderne** : Design responsive avec Tailwind CSS

## 🚀 Déploiement sur Cloudflare Pages

### Méthode 1 : Via le Dashboard Cloudflare (Recommandée)

1. **Connectez votre repository Git** :
   - Allez sur [Cloudflare Pages](https://pages.cloudflare.com)
   - Cliquez sur "Create a project"
   - Connectez votre repository GitHub

2. **Configuration du build** :
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
   - **Root directory** : `/`

3. **Variables d'environnement** (optionnel) :
   - `NODE_VERSION` : `18`

### Méthode 2 : Via Wrangler CLI

```bash
# Installation de Wrangler
npm install -g wrangler

# Authentification
wrangler login

# Déploiement
npm run deploy
wrangler pages deploy dist --project-name spatial-sound
```

### Optimisations incluses

- ✅ Cache des assets statiques (CSS/JS) : 1 an
- ✅ Cache des fichiers audio : 1 semaine
- ✅ Headers de sécurité configurés
- ✅ Routing SPA configuré
- ✅ Compression Gzip optimisée

## 🛠️ Développement Local

```bash
# Installation des dépendances
npm install

# Serveur de développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview
```

## 📁 Structure du Projet

```
src/
├── components/          # Composants React
│   ├── RotatingSound.tsx    # Composant principal
│   ├── SpatialVisualizer.tsx # Visualisation 3D
│   ├── ConfigPanel.tsx      # Panneau de configuration
│   └── Accordion.tsx        # Composant accordion
├── hooks/              # Hooks React personnalisés
│   ├── useSpatialAudio.ts   # Gestion audio spatial
│   ├── useAutoRotation.ts   # Rotation automatique
│   └── useDragControl.ts    # Contrôle par glisser-déposer
├── data/               # Données de l'application
│   └── melodies.ts         # Définitions des mélodies
└── types/              # Types TypeScript
    └── index.ts
```

## 🎛️ Technologies Utilisées

- **React 18** : Interface utilisateur moderne
- **TypeScript** : Type safety et meilleur DX
- **Tone.js** : Synthèse audio et effets
- **Tailwind CSS** : Styling utilitaire
- **Vite** : Build tool rapide
- **Lucide React** : Icônes modernes

## 🎵 Comment ça marche

1. **Audio Spatial** : Utilise l'API Web Audio avec HRTF pour simuler un positionnement 3D réaliste
2. **Synthèse Audio** : Génère des mélodies en temps réel avec différents types d'oscillateurs
3. **Contrôle de Position** : 
   - Mode automatique : rotation continue autour du centre
   - Mode manuel : glisser-déposer pour positionner la source audio
4. **Volume Dynamique** : Plus vous vous rapprochez du centre, plus le volume augmente

## 🔧 Configuration Avancée

### Headers de Sécurité

Le fichier `public/_headers` configure automatiquement :
- Protection contre le clickjacking
- Prévention du sniffing MIME
- Politique de référence stricte
- Permissions restrictives

### Cache Strategy

- **Assets statiques** (JS/CSS) : Cache longue durée avec hash de contenu
- **Fichiers audio** : Cache d'une semaine pour un équilibre performance/fraîcheur
- **HTML** : Pas de cache pour les mises à jour immédiates

## � Licence

MIT License - Voir le fichier LICENSE pour plus de détails.
