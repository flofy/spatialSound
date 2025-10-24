# Son 3D Spatial

Une application web interactive qui utilise l'audio spatial 3D pour créer une expérience sonore immersive. Le son tourne autour de votre tête en utilisant la technologie HRTF (Head-Related Transfer Function).

## ✨ Fonctionnalités

- **Audio Spatial 3D** : Utilise Tone.js et Web Audio API pour créer un effet de spatialisation
- **Interface Organisée** : Système d'accordéons pour une navigation intuitive
- **Volume Dynamique** : En mode manuel, le volume varie selon la distance du centre
- **Rotation Automatique** : Le son tourne automatiquement autour de l'utilisateur
- **Contrôle Manuel** : Positionnement précis par glisser-déposer avec feedback visuel
- **Mélodies Prédéfinies** : Plusieurs ambiances sonores intégrées
- **Audio Personnalisé** : Support pour charger vos propres fichiers audio (MP3, WAV, etc.)
- **Interface Responsive** : Optimisée pour desktop et mobile

## 🎮 Interface Utilisateur

### 📋 Panneaux de Configuration
- **🎮 Contrôles** : Lecture/Pause et sélection du mode (toujours visibles)
- **🎵 Source Audio** : Choix entre mélodies prédéfinies et fichiers personnalisés  
- **⚙️ Paramètres** : Volume et vitesse de rotation
- **ℹ️ Informations** : Instructions et état en temps réel

### 🎯 Modes de Fonctionnement
- **Mode Automatique** : Rotation fluide et continue à vitesse réglable
- **Mode Manuel** : 
  - Positionnement libre par glisser-déposer
  - Volume proportionnel à la distance du centre
  - Indicateur visuel d'intensité en temps réel

## 🚀 Démarrage Rapide

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/spatialSound.git
cd spatialSound

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🏗️ Structure du Projet

```
src/
├── components/           # Composants React
│   ├── RotatingSound.tsx # Composant principal
│   ├── SpatialVisualizer.tsx # Visualisation 3D
│   └── AudioControls.tsx # Contrôles audio
├── hooks/               # Hooks personnalisés
│   ├── useSpatialAudio.ts # Gestion audio spatial
│   ├── useAutoRotation.ts # Animation automatique
│   └── useDragControl.ts  # Contrôles drag & drop
├── types/               # Types TypeScript
│   └── index.ts
├── data/               # Données statiques
│   └── melodies.ts     # Mélodies prédéfinies
├── App.tsx
├── main.tsx
└── index.css
```

## 🛠️ Technologies Utilisées

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et serveur de développement
- **Tone.js** - Synthèse audio et spatialisation
- **Tailwind CSS** - Styling
- **Lucide React** - Icônes

## 📱 Utilisation

1. **Mettez des écouteurs** pour une expérience optimale
2. Cliquez sur "Démarrer" pour lancer l'audio
3. Choisissez entre le mode automatique ou manuel :
   - **Auto** : Le son tourne automatiquement
   - **Manuel** : Glissez-déposez l'icône 🎵 pour positionner le son
4. Ajustez la vitesse de rotation, le volume, et choisissez votre source audio

## 🎵 Sources Audio

### Mélodies Prédéfinies
- **Naive Melody** - Mélodie simple et douce
- **Abstract Ambient** - Sons ambiants abstraits  
- **Dreamy Float** - Ambiance rêveuse flottante
- **Gentle Waves** - Vagues douces et relaxantes

### Audio Personnalisé
Chargez vos propres fichiers audio (formats supportés : MP3, WAV, OGG, M4A)

## 🔧 Scripts Disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualisation du build
npm run lint     # Linting du code
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [Tone.js](https://tonejs.github.io/) pour la synthèse audio
- [Lucide](https://lucide.dev/) pour les icônes
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
some app to show spatial sound
