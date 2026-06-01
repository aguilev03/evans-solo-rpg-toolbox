const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const sourceDir = '/home/evan/projects/foundry_modules/SOLO RPG TOOLBOX';
const destDir = '/home/evan/projects/foundry_modules/evans-solo-rpg-toolbox';

const parsedTables = [];
const parsedMacros = [];

const tableFolders = new Map();
const macroFolders = new Map();

function getStableId(name) {
  const hash = crypto.createHash('sha256').update(name).digest('hex');
  return hash.substring(0, 16);
}

function formatFolderName(segment) {
  return segment.split(/[-_\s]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function getOrCreateFolders(segments, type) {
  if (!segments || segments.length === 0) return null;

  const folderMap = type === 'tables' ? tableFolders : macroFolders;
  const docType = type === 'tables' ? 'RollTable' : 'Macro';
  const prefix = type === 'tables' ? 'table-folder' : 'macro-folder';

  let parentId = null;
  let currentPath = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath = currentPath ? `${currentPath}/${segment}` : segment;
    const folderId = getStableId(`${prefix}-${currentPath}`);

    if (!folderMap.has(currentPath)) {
      folderMap.set(currentPath, {
        _id: folderId,
        _key: `!folders!${folderId}`,
        name: formatFolderName(segment),
        type: docType,
        parent: parentId,
        sorting: "a",
        sort: 0,
        color: null,
        flags: {}
      });
    }
    parentId = folderId;
  }

  return parentId;
}

function parseTextTables(filePath, relativePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  let currentTable = null;

  const relativeParent = path.dirname(relativePath);
  const segments = relativeParent === '.' ? [] : relativeParent.split(path.sep);
  const folderId = getOrCreateFolders(segments, 'tables');

  const saveCurrentTable = () => {
    if (currentTable && currentTable.results.length > 0) {
      // Determine formula
      if (!currentTable.formula) {
        const hasD66 = currentTable.name.toLowerCase().includes('d66');
        const hasD6 = currentTable.name.toLowerCase().includes('d6');
        const hasD8 = currentTable.name.toLowerCase().includes('d8');
        const hasD10 = currentTable.name.toLowerCase().includes('d10');
        const hasD12 = currentTable.name.toLowerCase().includes('d12');
        const hasD20 = currentTable.name.toLowerCase().includes('d20');
        const hasD100 = currentTable.name.toLowerCase().includes('d100');

        const explicit = currentTable.results.some(r => r.isExplicit);
        if (explicit) {
          let maxVal = 1;
          let minVal = 1;
          currentTable.results.forEach(r => {
            if (r.range[1] > maxVal) maxVal = r.range[1];
            if (r.range[0] < minVal) minVal = r.range[0];
          });
          if (minVal === 2 && maxVal === 12) {
            currentTable.formula = '2d6';
          } else if (minVal === 3 && maxVal === 18) {
            currentTable.formula = '3d6';
          } else {
            currentTable.formula = `1d${maxVal}`;
          }
        } else {
          // Implicit
          if (hasD66 || currentTable.results.length === 36) {
            currentTable.formula = '1d6 * 10 + 1d6';
            // Rewrite ranges to d66 values
            currentTable.results.forEach((r, idx) => {
              const tens = Math.floor(idx / 6) + 1;
              const ones = (idx % 6) + 1;
              const val = tens * 10 + ones;
              r.range = [val, val];
            });
          } else if (hasD6 || currentTable.results.length === 6) {
            currentTable.formula = '1d6';
          } else if (hasD8 || currentTable.results.length === 8) {
            currentTable.formula = '1d8';
          } else if (hasD10 || currentTable.results.length === 10) {
            currentTable.formula = '1d10';
          } else if (hasD12 || currentTable.results.length === 12) {
            currentTable.formula = '1d12';
          } else if (hasD20 || currentTable.results.length === 20) {
            currentTable.formula = '1d20';
          } else if (hasD100 || currentTable.results.length === 100) {
            currentTable.formula = '1d100';
          } else {
            currentTable.formula = `1d${currentTable.results.length}`;
          }
        }
      }

      // Clean table name (remove leading d6, d66, d20 etc.)
      currentTable.name = currentTable.name.replace(/^d\d+\s+/i, '').trim();

      parsedTables.push(currentTable);
    }
    currentTable = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '') {
      continue;
    }

    const isHeader = (line.startsWith('#') && !line.startsWith('###')) || line.toLowerCase().match(/^d\d+\b/);

    if (isHeader) {
      saveCurrentTable();
      let tableName = line;
      if (line.startsWith('#')) {
        tableName = line.replace(/^#+\s*/, '').trim();
      }
      currentTable = {
        name: tableName,
        description: '',
        results: [],
        formula: null,
        folder: folderId,
        relativePath: relativePath
      };
      if (tableName.toLowerCase().includes('d66')) {
        currentTable.formula = '1d6 * 10 + 1d6';
      }
    } else if (line.startsWith('###')) {
      if (currentTable) {
        currentTable.description = line.replace(/^###+\s*/, '').trim();
      }
    } else {
      if (currentTable) {
        const rangeMatch = line.match(/^(\d+)(?:-(\d+))?\s+(.*)$/);
        if (rangeMatch) {
          const min = parseInt(rangeMatch[1]);
          const max = rangeMatch[2] ? parseInt(rangeMatch[2]) : min;
          const text = rangeMatch[3].trim();
          currentTable.results.push({
            range: [min, max],
            text: text,
            isExplicit: true
          });
        } else {
          const min = currentTable.results.length + 1;
          const max = min;
          currentTable.results.push({
            range: [min, max],
            text: line,
            isExplicit: false
          });
        }
      }
    }
  }
  saveCurrentTable();
}

function parseJsonTable(filePath, relativePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  let obj;
  try {
    obj = JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to parse JSON file ${filePath}:`, e);
    return;
  }

  if (!obj.results || !Array.isArray(obj.results)) {
    return;
  }

  let name = obj.name || path.basename(filePath, '.json');
  if (name === "Clues" && filePath.includes("Mysteries_Clues")) {
    name = "Mystery Descriptors - Clues";
  }

  const results = obj.results.map((r, idx) => {
    const text = r.text || r.name || r.description || "";
    const range = r.range || [idx + 1, idx + 1];
    return {
      range: range,
      text: text
    };
  });

  const relativeParent = path.dirname(relativePath);
  const segments = relativeParent === '.' ? [] : relativeParent.split(path.sep);
  const folderId = getOrCreateFolders(segments, 'tables');

  parsedTables.push({
    name: name,
    description: obj.description || "",
    results: results,
    formula: obj.formula || `1d${results.length}`,
    folder: folderId,
    relativePath: relativePath
  });
}

function parseMacro(filePath, relativePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const basename = path.basename(filePath);
  const ext = path.extname(filePath);
  let name = basename.substring(0, basename.length - ext.length);

  name = name.split(/[-_\s]+/)
    .map(w => {
      if (w.toLowerCase() === 'npc') return 'NPC';
      if (w.toLowerCase() === 'rpg') return 'RPG';
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');

  const relativeParent = path.dirname(relativePath);
  const segments = relativeParent === '.' ? [] : relativeParent.split(path.sep);
  const macroSegments = segments.filter(s => s.toLowerCase() !== 'macro' && s.toLowerCase() !== 'macros');
  const folderId = getOrCreateFolders(macroSegments, 'macros');

  parsedMacros.push({
    name: name,
    command: content,
    folder: folderId
  });
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile()) {
      const relativePath = path.relative(sourceDir, fullPath);
      const lowercasePath = relativePath.toLowerCase();

      const isMacroDir = lowercasePath.includes('/macro/') || lowercasePath.includes('/macros/') || lowercasePath.startsWith('macro/') || lowercasePath.startsWith('macros/');
      const isMacro = entry.name.endsWith('.js') || isMacroDir;

      if (isMacro) {
        parseMacro(fullPath, relativePath);
      } else if (entry.name.endsWith('.json')) {
        const snippet = fs.readFileSync(fullPath, 'utf-8').trim();
        if (snippet.startsWith('{') || snippet.startsWith('[')) {
          try {
            const parsed = JSON.parse(snippet);
            if (parsed.results) {
              parseJsonTable(fullPath, relativePath);
            } else {
              parseMacro(fullPath, relativePath);
            }
          } catch (e) {
            parseMacro(fullPath, relativePath);
          }
        } else {
          parseMacro(fullPath, relativePath);
        }
      } else if (entry.name.endsWith('.txt') || entry.name.includes('roll tables')) {
        parseTextTables(fullPath, relativePath);
      }
    }
  }
}

console.log('Scanning files...');
walkDir(sourceDir);

// Add proactive Monsters and Humanoids tables to support Create Encounters macro
const monstersList = [
  "Dinosaurs", "Ogres", "Giant rats", "Wolves", "Worgs", "Werewolves",
  "Ents", "Giant spiders", "Bears", "Boars", "Dryads", "Manticores",
  "Basilisks", "Giants", "Wyverns", "Trolls", "Skeletons", "Crocodiles",
  "Zombies", "Hydras", "Griffins", "Smilodons", "Vampires"
];

const humanoidsList = [
  "Bandits", "Berserkers", "Dwarves", "Elves", "Orcs", "Goblins",
  "Gnolls", "Kobolds", "Lizard-men", "Snake-men", "Frog-men",
  "Moth-men", "Mushroom-men", "Beastmen"
];

const biomeFolderId = getOrCreateFolders(["hex map", "encounters"], 'tables');

parsedTables.push({
  name: "Monsters",
  description: "Proactively compiled list of monsters from Biome Encounters",
  formula: `1d${monstersList.length}`,
  results: monstersList.map((m, idx) => ({
    range: [idx + 1, idx + 1],
    text: m
  })),
  folder: biomeFolderId
});

parsedTables.push({
  name: "Humanoids",
  description: "Proactively compiled list of humanoids from Biome Encounters",
  formula: `1d${humanoidsList.length}`,
  results: humanoidsList.map((h, idx) => ({
    range: [idx + 1, idx + 1],
    text: h
  })),
  folder: biomeFolderId
});

console.log(`Parsed ${parsedTables.length} Roll Tables.`);
console.log(`Parsed ${parsedMacros.length} Macros.`);

// Write RollTables to src
const tableFolder = path.join(destDir, 'src/packs/solo-rpg-tables');
fs.mkdirSync(tableFolder, { recursive: true });

parsedTables.forEach(table => {
  const id = getStableId(`table-${table.relativePath || ''}-${table.name}`);
  const results = table.results.map((r, idx) => {
    const rId = getStableId(`table-${table.relativePath || ''}-${table.name}-result-${idx}-${r.text}`);
    return {
      _id: rId,
      _key: `!tables.results!${id}.${rId}`,
      type: 0,
      text: r.text,
      weight: 1,
      range: r.range,
      drawn: false,
      img: "icons/svg/d20-black.svg",
      documentId: null,
      flags: {}
    };
  });

  const rollTableDoc = {
    _id: id,
    _key: `!tables!${id}`,
    name: table.name,
    img: "icons/svg/d20-grey.svg",
    description: table.description || "",
    results: results,
    formula: table.formula || "1d6",
    replacement: true,
    displayRoll: true,
    folder: table.folder || null,
    flags: {}
  };

  const fileName = table.name.replace(/[^a-z0-9]/gi, '_') + `_${id}.json`;
  fs.writeFileSync(path.join(tableFolder, fileName), JSON.stringify(rollTableDoc, null, 2));
});

// Write Table Folders
tableFolders.forEach(folder => {
  const fileName = `_folder_${folder._id}.json`;
  fs.writeFileSync(path.join(tableFolder, fileName), JSON.stringify(folder, null, 2));
});

// Write Macros to src
const macroFolder = path.join(destDir, 'src/packs/solo-rpg-macros');
fs.mkdirSync(macroFolder, { recursive: true });

parsedMacros.forEach(macro => {
  const id = getStableId(`macro-${macro.name}`);
  const macroDoc = {
    _id: id,
    _key: `!macros!${id}`,
    name: macro.name,
    type: "script",
    author: getStableId("evans-solo-rpg-toolbox"),
    img: "icons/svg/dice-target.svg",
    scope: "global",
    command: macro.command,
    folder: macro.folder || null,
    flags: {}
  };

  const fileName = macro.name.replace(/[^a-z0-9]/gi, '_') + '.json';
  fs.writeFileSync(path.join(macroFolder, fileName), JSON.stringify(macroDoc, null, 2));
});

// Write Macro Folders
macroFolders.forEach(folder => {
  const fileName = `_folder_${folder._id}.json`;
  fs.writeFileSync(path.join(macroFolder, fileName), JSON.stringify(folder, null, 2));
});

console.log('Source JSON files written successfully.');
