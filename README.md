# Is It Really That Great To Be Young? — Cinema Presentation Studio

Application **React + TypeScript + Vite** modulaire conçue pour présenter un talk de **7m30** en **12 slides cinéma sans cards**, avec un score audio adaptatif sans clics (piano feutré + nappe chaude), un **Studio Pro (4 onglets)** et une **télécommande mobile en temps réel via QR Code** (compatible **Wi-Fi local** et **Vercel 4G/5G**).

---

## Démarrage rapide (PC + Téléphone en local)

```bash
pnpm install
pnpm dev
```

1. Ouvre l’URL locale sur ton PC (`http://localhost:5173`).
2. Appuie sur **`S`** pour ouvrir le **Studio Pro** → onglet **Mobile**.
3. Scanne le **QR Code** avec ton téléphone (connecté au même Wi-Fi) pour piloter les slides au doigt/scroll en temps réel, lire le prompteur ou contrôler l'audio à distance.

---

## Déploiement Vercel (1 clic — fonctionne aussi en 4G/5G)

Le fichier [vercel.json](./vercel.json) configure automatiquement Vite, pnpm et le routage SPA (`/remote`, `/presenter`).

1. Importe ce dépôt GitHub dans **Vercel** (`Add New Project`) — aucun variable d'environnement requise.
2. Ouvre ton URL Vercel sur le PC de la salle, appuie sur **`S`** → onglet **Mobile**.
3. L'app bascule automatiquement en **Cloud P2P (WebRTC / PeerJS)** avec un code de session unique : scanne le QR Code depuis ton téléphone même en **4G/5G** !

---

## Raccourcis Scène (PC)

- **`P`** : Mode **Vraie Présentation Immersive** (Plein écran + Rideau Cinéma + Musique adaptative)
- **`→` / `Espace` / `PageDown` / Clic** : Avancer beat par beat
- **`←` / `PageUp`** : Reculer
- **`S`** : Ouvrir/fermer le **Studio Pro** (`DA`, `Fin`, `Audio`, `Mobile`)
- **`O`** : Ouvrir la **Console Présentateur** sur un 2e écran (`/presenter`)
- **`M`** / **`D`** : Mute doux (`M`) / Voice Duck 35 % (`D`)
- **`B`** : Blackout d’urgence · **`N`** : Barre repères · **`R`** : Reset chrono · **`F`** : Plein écran

---

## Scripts & Documentation

- [script_final.md](./script_final.md) — Script final continu d'une seule traite (1 110 mots, ~7m30)
- [script.md](./script.md) — Document maître complet (timing, clics, intentions vocales, musique)
- [slides_blueprint.md](./slides_blueprint.md) — Blueprint artistique des 12 slides et 4 arcs chromatiques
