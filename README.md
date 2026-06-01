# Evans Solo RPG Toolbox

A comprehensive, state-of-the-art content module for **Foundry VTT (v11 & v12)** packed with over **350 custom Roll Tables** and **33 Javascript Macros** to supercharge your solo RPG sessions.

This module automates many of the procedures for solo RPG campaigns, bringing seamless, one-click rolls and chat card generators to your virtual tabletop.

## Features

- **354 Roll Tables** organized into logical categories:
  - **Hex Map Exploration**: Biome generation, landmark types, settlement features (castles, towers, abbeys), encounters per biome.
  - **Solo Combat RPG**: Action tables, enemy personality generators, battlefield reactions, morale checks, and oracle words.
  - **Mythic System Utilities**: Mystery elements, clues, suspect generators, and adventure/puzzle consequences.
  - **Caught in the Rain (Noir/Fantasy/Horror/Sci-Fi)**: Over 120 thematic d66 tables for locations, clues, obligations, threats, and name generators.
  - **Dungeon Room Setup**: Room setup tables, thematic templates, and dressing details.
- **33 Advanced Script Macros** (located in the *Solo RPG Macros* compendium, beautifully organized into subfolders):
  - **Hex Map Exploration Macros**:
    - **Generate Hex Context**: Generate starting hex or next hex details (biomes, features, etc.).
    - **Landmark Generator**: Generate detailed characteristics, types, and descriptions of landmarks.
    - **Abby Generator**: Generate layout, history, and secrets for abbeys.
    - **Castle Generator**: Generate layout, defense level, and traits for castles.
    - **City Generator**: Generate size, ruler, problems, layout, and points of interest for cities.
    - **Distant Hex Scout Generator**: Scout adjacent hexes.
    - **Hamlet Generator**: Generate details for small hamlets.
    - **Lair Generator**: Generate monster/beast lairs.
    - **Master Hex Detail Generator**: Comprehensive hex feature generation.
    - **Settlement Name Generator**: Randomly generate realistic settlement names.
    - **Tower Generator**: Generate descriptions, layout, and contents of towers.
    - **Village Generator**: Generate defense, ruler, secrets, size, and layout for villages.
    - **Faction Generator**: Generate faction type, influence, and motivation.
    - **Factions Relationship Generator**: Generate relationships and statuses between factions.
  - **Dungeon Exploration Macros**:
    - **Dungeon Level Generator**: Generate specific levels of a dungeon.
    - **Dungeon Overview Generator**: Generate the macro structure and theme of a dungeon.
    - **Dungeon Room Detail**: Generate contents, hazards, and features for individual rooms.
    - **Dungeon Room Setup**: Roll basic room layouts and properties.
    - **Master Dungeon Generator**: Assemble a complete dungeon layout in one go.
    - **Special Room Generator**: Generate unique, thematic rooms (libraries, crypts, etc.).
  - **Solo Combat RPG Macros**:
    - **Create Encounters**: Automatically draws from the custom **Monsters** or **Humanoids** tables (built dynamically from biomes), rolls group counts, establishes combat motivations, goals, personality profiles, and even rolls names for elite leaders.
    - **NPC Combat Round**: Draws tactical actions for enemies dynamically during a round.
    - **Morale Check**: Quickly checks and rolls morale state for enemies.
    - **Lair Action**: Introduces environmental or structural hazards.
    - **Battle Puzzle Mechanic**: Sets up complex tactical challenges on the battlefield.
    - **Solo Combat RPG**: General solo combat oracle.
  - **Mythic & Puzzle Systems Macros**:
    - **Get Clues Maros**: Automatically retrieve random clues.
    - **Mystery Elements Table Clues** & **Mystery Elements Table Suspects**: Draws clues or suspects for mysteries.
    - **Mystery Event Focus**: Determine focus for mystery events.
    - **New Puzzle Descriptors**, **Reward**, & **Consequence**: Assemble detailed puzzle elements.

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
