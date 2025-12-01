const STATUS = {
  CREATED: 'created',
  DISPATCHED: 'dispatched',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  FAILED: 'failed',
};

const ALL_STATUSES = Object.values(STATUS);

/**
 * PUBLIC_INTERFACE
 * Validate a new delivery payload.
 * Ensures required fields exist and are valid types.
 * @param {object} payload
 * @returns {{valid:boolean, errors:string[]}}
 */
function validateNewDelivery(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Body must be an object'] };
  }
  const { sender, recipient, address, packageDetails, expectedDeliveryDate } = payload;
  if (!sender || typeof sender !== 'string') errors.push('sender is required and must be a string');
  if (!recipient || typeof recipient !== 'string') errors.push('recipient is required and must be a string');
  if (!address || typeof address !== 'string') errors.push('address is required and must be a string');
  if (!packageDetails || typeof packageDetails !== 'object') errors.push('packageDetails is required and must be an object');
  if (!expectedDeliveryDate || Number.isNaN(Date.parse(expectedDeliveryDate))) {
    errors.push('expectedDeliveryDate is required and must be a valid date string');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * PUBLIC_INTERFACE
 * Validate a status update payload.
 * @param {object} payload
 * @returns {{valid:boolean, errors:string[]}}
 */
function validateStatusUpdate(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Body must be an object'] };
  }
  const { status, note } = payload;
  if (!status || !ALL_STATUSES.includes(status)) {
    errors.push(`status is required and must be one of: ${ALL_STATUSES.join(', ')}`);
  }
  if (note && typeof note !== 'string') errors.push('note must be a string if provided');
  return { valid: errors.length === 0, errors };
}

module.exports = {
  STATUS,
  ALL_STATUSES,
  validateNewDelivery,
  validateStatusUpdate,
};
