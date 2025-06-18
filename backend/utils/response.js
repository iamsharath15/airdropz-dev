/**
 * Send a standardized success response
 * @param {Response} res - Express response object
 * @param {any} data - Data to send
 * @param {string} message - Optional message
 * @param {number} statusCode - Optional status code (default: 200)
 * @param {object} extra - Optional additional fields (e.g., meta)
 */
export const sendSuccess = (
  res,
  data = null,
  message = 'Success',
  statusCode = 200,
  extra = {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...extra,
  });
};

/**
 * Send an error response
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - Optional status code (default: 500)
 * @param {any} error - Optional error object for debugging/logging
 */
export const sendError = (
  res,
  message = 'Internal Server Error',
  statusCode = 500,
  error = null
) => {
  if (error) console.error('Error:', error);

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
