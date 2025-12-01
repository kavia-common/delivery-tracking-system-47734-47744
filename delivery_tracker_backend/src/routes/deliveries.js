const express = require('express');
const controller = require('../controllers/deliveryController');
const { ALL_STATUSES } = require('../models/delivery');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: Delivery management endpoints
 */

/**
 * @swagger
 * /deliveries:
 *   post:
 *     summary: Create a new delivery
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sender, recipient, address, packageDetails, expectedDeliveryDate]
 *             properties:
 *               sender: { type: string }
 *               recipient: { type: string }
 *               address: { type: string }
 *               packageDetails:
 *                 type: object
 *                 additionalProperties: true
 *               expectedDeliveryDate:
 *                 type: string
 *                 format: date-time
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created delivery
 *       400:
 *         description: Validation error
 */
router.post('/', controller.create);

/**
 * @swagger
 * /deliveries:
 *   get:
 *     summary: List deliveries with optional filters and pagination
 *     tags: [Deliveries]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, example: "created,in_transit" }
 *       - in: query
 *         name: recipient
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Paginated delivery list
 */
router.get('/', controller.list);

/**
 * @swagger
 * /deliveries/{id}:
 *   get:
 *     summary: Get a delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200: { description: Delivery found }
 *       404: { description: Not Found }
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /deliveries/{id}/status:
 *   patch:
 *     summary: Update delivery status
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [created, dispatched, in_transit, out_for_delivery, delivered, failed]
 *               note:
 *                 type: string
 *     responses:
 *       200: { description: Updated delivery }
 *       400: { description: Validation error }
 *       404: { description: Not Found }
 */
router.patch('/:id/status', controller.updateStatus);

/**
 * @swagger
 * /deliveries/{id}/history:
 *   get:
 *     summary: Get status change history for a delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: History returned }
 *       404: { description: Not Found }
 */
router.get('/:id/history', controller.history);

module.exports = router;
