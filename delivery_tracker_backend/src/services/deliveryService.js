const crypto = require('crypto');
const repo = require('../repositories/deliveryRepository');
const { STATUS, ALL_STATUSES } = require('../models/delivery');

function generateId() {
  // uuid alternative without external dependency
  return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
}

/**
 * PUBLIC_INTERFACE
 * Create a new delivery with initial status and history
 */
function createDelivery(payload) {
  const now = new Date().toISOString();
  const delivery = {
    id: generateId(),
    sender: payload.sender,
    recipient: payload.recipient,
    address: payload.address,
    packageDetails: payload.packageDetails,
    expectedDeliveryDate: new Date(payload.expectedDeliveryDate).toISOString(),
    status: STATUS.CREATED,
    history: [
      {
        status: STATUS.CREATED,
        timestamp: now,
        note: payload.note || 'Delivery created',
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  return repo.create(delivery);
}

/**
 * PUBLIC_INTERFACE
 * Get a delivery by ID
 */
function getDelivery(id) {
  return repo.getById(id);
}

/**
 * PUBLIC_INTERFACE
 * Update delivery status and append to history
 */
function updateStatus(id, status, note) {
  if (!ALL_STATUSES.includes(status)) {
    const err = new Error(`Invalid status: ${status}`);
    err.statusCode = 400;
    throw err;
  }
  const current = repo.getById(id);
  if (!current) {
    const err = new Error('Delivery not found');
    err.statusCode = 404;
    throw err;
  }
  const now = new Date().toISOString();
  current.status = status;
  current.history.push({ status, timestamp: now, note: note || null });
  current.updatedAt = now;
  return repo.update(id, current);
}

/**
 * PUBLIC_INTERFACE
 * Get history for a delivery
 */
function getHistory(id) {
  const current = repo.getById(id);
  if (!current) {
    const err = new Error('Delivery not found');
    err.statusCode = 404;
    throw err;
  }
  // Ensure chronological order by timestamp
  return [...current.history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

/**
 * PUBLIC_INTERFACE
 * List deliveries with filters and pagination
 */
function listDeliveries(query) {
  const {
    status,
    recipient,
    startDate,
    endDate,
    page = '1',
    pageSize = '10',
  } = query;

  let list = repo.listAll();

  if (status && status.length) {
    const statuses = String(status)
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);
    list = list.filter((d) => statuses.includes(d.status));
  }

  if (recipient) {
    const rec = String(recipient).toLowerCase();
    list = list.filter((d) => String(d.recipient).toLowerCase().includes(rec));
  }

  if (startDate) {
    const sd = new Date(startDate);
    if (!isNaN(sd)) {
      list = list.filter((d) => new Date(d.createdAt) >= sd);
    }
  }

  if (endDate) {
    const ed = new Date(endDate);
    if (!isNaN(ed)) {
      list = list.filter((d) => new Date(d.createdAt) <= ed);
    }
  }

  const p = Math.max(1, parseInt(page, 10) || 1);
  const ps = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 10));

  const total = list.length;
  const start = (p - 1) * ps;
  const items = list.slice(start, start + ps);

  return {
    items,
    page: p,
    pageSize: ps,
    total,
    totalPages: Math.ceil(total / ps),
  };
}

/**
 * PUBLIC_INTERFACE
 * Seed sample deliveries
 */
function seedSample() {
  const now = new Date();
  const d1 = {
    id: generateId(),
    sender: 'Alice Co.',
    recipient: 'Bob',
    address: '123 Main St, City',
    packageDetails: { weightKg: 1.2, contents: 'Books' },
    expectedDeliveryDate: new Date(now.getTime() + 3 * 86400000).toISOString(),
    status: STATUS.DISPATCHED,
    history: [
      { status: STATUS.CREATED, timestamp: new Date(now.getTime() - 86400000).toISOString(), note: 'Created' },
      { status: STATUS.DISPATCHED, timestamp: now.toISOString(), note: 'Left warehouse' },
    ],
    createdAt: new Date(now.getTime() - 86400000).toISOString(),
    updatedAt: now.toISOString(),
  };
  const d2 = {
    id: generateId(),
    sender: 'Gadget Inc.',
    recipient: 'Carol',
    address: '456 Oak Ave, Town',
    packageDetails: { weightKg: 0.5, contents: 'Electronics' },
    expectedDeliveryDate: new Date(now.getTime() + 2 * 86400000).toISOString(),
    status: STATUS.IN_TRANSIT,
    history: [
      { status: STATUS.CREATED, timestamp: new Date(now.getTime() - 2 * 86400000).toISOString(), note: 'Created' },
      { status: STATUS.DISPATCHED, timestamp: new Date(now.getTime() - 86400000).toISOString(), note: 'Left hub' },
      { status: STATUS.IN_TRANSIT, timestamp: now.toISOString(), note: 'On the way' },
    ],
    createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
    updatedAt: now.toISOString(),
  };
  return repo.seed([d1, d2]);
}

module.exports = {
  createDelivery,
  getDelivery,
  updateStatus,
  getHistory,
  listDeliveries,
  seedSample,
};
