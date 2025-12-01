const { validateNewDelivery, validateStatusUpdate } = require('../models/delivery');
const service = require('../services/deliveryService');

/**
 * PUBLIC_INTERFACE
 * Create a new delivery
 */
async function create(req, res, next) {
  try {
    const validation = validateNewDelivery(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: 'ValidationError', details: validation.errors });
    }
    const created = service.createDelivery(req.body);
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * Get a delivery by id
 */
async function getById(req, res, next) {
  try {
    const d = service.getDelivery(req.params.id);
    if (!d) return res.status(404).json({ error: 'NotFound', message: 'Delivery not found' });
    return res.json(d);
  } catch (err) {
    return next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * List deliveries with filters and pagination
 */
async function list(req, res, next) {
  try {
    const result = service.listDeliveries(req.query);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * Update status
 */
async function updateStatus(req, res, next) {
  try {
    const validation = validateStatusUpdate(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: 'ValidationError', details: validation.errors });
    }
    const updated = service.updateStatus(req.params.id, req.body.status, req.body.note);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * Get status history
 */
async function history(req, res, next) {
  try {
    const hist = service.getHistory(req.params.id);
    return res.json({ id: req.params.id, history: hist });
  } catch (err) {
    return next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * Seed sample data
 */
async function seed(req, res, next) {
  try {
    const count = service.seedSample();
    return res.status(201).json({ message: 'Seeded sample deliveries', count });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  getById,
  list,
  updateStatus,
  history,
  seed,
};
