# Is It Really That Great To Be Young? — Cinema Presentation Studio

Application **React + TypeScript + Vite** modulaire conçue pour présenter un talk de **6m30** en **12 slides cinéma sans cards**, avec une partition piano feutrée hors-ligne, un **Studio Pro (4 onglets)** et une **télécommande mobile en temps réel via QR Code**.

---

## Démarrage rapide (PC + Téléphone)

```bash
pnpm install
pnpm dev
```

1. Ouvre l’URL locale sur ton PC (par défaut `http://localhost:5173`).
2. Appuie sur **`S`** pour ouvrir le **Studio Pro** → onglet **Mobile**.
3. Scanne le **QR Code** avec ton téléphone (connecté au même Wi-Fi) pour piloter les slides au doigt/scroll en temps réel, lire le prompteur ou déclencher le blackout/piano à distance.
   - *(Si Windows affiche une alerte Pare-feu au premier lancement sur le réseau local, autorise l’accès sur réseau privé.)*

---

## Raccourcis Scène (PC)

- **`P`** : Mode **Vraie Présentation Immersive** (Plein écran + Rideau Cinéma + Piano adaptatif)
- **`→` / `Espace` / `PageDown` / Clic** : Avancer beat par beat
- **`←` / `PageUp`** : Reculer
- **`S`** : Ouvrir/fermer le **Studio Pro** (DA, Réglages fins par slide, Piano, QR Mobile)
- **`O`** : Ouvrir la **Console Présentateur** sur un 2e écran (`/presenter`)
- **`M`** / **`D`** : Mute doux (`M`) / Voice Duck 35 % (`D`) du piano
- **`B`** : Blackout d’urgence · **`N`** : Barre repères · **`R`** : Reset chrono · **`F`** : Plein écran

---

## Scripts & Documentation

- [script_final.md](./script_final.md) — Script final épuré pour réviser (~801 mots, 6m25–6m35)
- [script.md](./script.md) — Document maître complet (timing, clics, intentions vocales, piano)
- [slides_blueprint.md](./slides_blueprint.md) — Blueprint artistique des 12 slides et 4 arcs chromatiques
