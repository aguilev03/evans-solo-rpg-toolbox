# Evans Solo RPG Toolbox

A comprehensive, state-of-the-art content module for **Foundry VTT (v11 & v12)** packed with over **160 custom Roll Tables** and **14 Javascript Macros** to supercharge your solo RPG sessions.

This module automates many of the procedures for solo RPG campaigns, bringing seamless, one-click rolls and chat card generators to your virtual tabletop.

## Features

- **161 Roll Tables** organized into logical categories:
  - **Hex Map Exploration**: Biome generation, landmark types, settlement features (castles, towers, abbeys), encounters per biome.
  - **Solo Combat RPG**: Action tables, enemy personality generators, battlefield reactions, morale checks, and oracle words.
  - **Mythic System Utilities**: Mystery elements, clues, suspect generators, and adventure/puzzle consequences.
  - **Caught in the Rain (Noir/Fantasy/Horror/Sci-Fi)**: Over 30 thematic d66 tables for locations, clues, obligations, threats, and name generators.
  - **Dungeon Room Setup**: Room setup tables and thematic templates.
- **14 Advanced Script Macros** (located in the *Solo RPG Macros* compendium):
  - **Create Encounters**: Automatically draws from the custom **Monsters** or **Humanoids** tables (built dynamically from biomes), rolls group counts, establishes combat motivations, goals, personality profiles, and even rolls names for elite leaders.
  - **NPC Combat Round**: Draws tactical actions for enemies dynamically during a round.
  - **Morale Check**: Quickly checks and rolls morale state for enemies.
  - **Lair Action**: Introduces environmental or structural hazards.
  - **Battle Puzzle Mechanic**: Sets up complex tactical challenges on the battlefield.
  - **Mystery & Puzzle Descriptors**: Automatically draws descriptors, rewards, and consequences for mystery tracks and puzzle keys.
  - **Dungeon Room Setup**: Dynamically draws and builds new dungeon room setups.

## Installation

### Manual Installation
1. Copy or clone the `evans-solo-rpg-toolbox` folder into your Foundry VTT user data directory under `Data/modules/evans-solo-rpg-toolbox`.
2. Start Foundry VTT and enable **Evans Solo RPG Toolbox** in your world settings.
3. Open the **Compendium Packs** sidebar to find **Solo RPG Tables** and **Solo RPG Macros**.

## Compiling from Sources
If you make changes to the source JSON files in `src/packs/`, you can recompile the databases by running:

```bash
npm install
npm run build
```

This compiles the source JSON structures back into Foundry's high-performance LevelDB database files.
