const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'deliveries.json');

// Ensure data directory and file exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ deliveries: [] }, null, 2), 'utf-8');
  }
}

ensureDataFile();

// Load from disk
function readAll() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.deliveries) ? parsed.deliveries : [];
  } catch (e) {
    // Reset file on corruption
    fs.writeFileSync(DATA_FILE, JSON.stringify({ deliveries: [] }, null, 2), 'utf-8');
    return [];
  }
}

// Persist to disk
function writeAll(deliveries) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ deliveries }, null, 2), 'utf-8');
}

// In-memory cache + index
let cache = readAll();
let index = new Map(cache.map((d) => [d.id, d]));

/**
 * PUBLIC_INTERFACE
 * Create a delivery
 * @param {object} delivery
 * @returns {object}
 */
function create(delivery) {
  cache.push(delivery);
  index.set(delivery.id, delivery);
  writeAll(cache);
  return delivery;
}

/**
 * PUBLIC_INTERFACE
 * Get delivery by id
 * @param {string} id
 * @returns {object|null}
 */
function getById(id) {
  return index.get(id) || null;
}

/**
 * PUBLIC_INTERFACE
 * Update a delivery by replacing the object
 * @param {string} id
 * @param {object} updated
 * @returns {object|null}
 */
function update(id, updated) {
  const i = cache.findIndex((d) => d.id === id);
  if (i === -1) return null;
  cache[i] = updated;
  index.set(id, updated);
  writeAll(cache);
  return updated;
}

/**
 * PUBLIC_INTERFACE
 * List deliveries (raw list without filtering/pagination)
 * @returns {object[]}
 */
function listAll() {
  return [...cache];
}

/**
 * PUBLIC_INTERFACE
 * Seed data replacing current content
 * @param {object[]} deliveries
 * @returns {number} count
 */
function seed(deliveries) {
  cache = deliveries;
  index = new Map(cache.map((d) => [d.id, d]));
  writeAll(cache);
  return cache.length;
}

module.exports = {
  create,
  getById,
  update,
  listAll,
  seed,
  DATA_FILE,
};
