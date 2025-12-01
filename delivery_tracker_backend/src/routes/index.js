const express = require('express');
const healthController = require('../controllers/health');
const deliveriesRouter = require('./deliveries');
const deliveryController = require('../controllers/deliveryController');

const router = express.Router();

// Health endpoint
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health check passed
 */
router.get('/', healthController.check.bind(healthController));

/**
 * @swagger
 * /seed:
 *   post:
 *     summary: Seed sample deliveries
 *     tags: [Deliveries]
 *     responses:
 *       201:
 *         description: Seeded sample data
 */
router.post('/seed', deliveryController.seed);

// Deliveries endpoints
router.use('/deliveries', deliveriesRouter);

module.exports = router;
