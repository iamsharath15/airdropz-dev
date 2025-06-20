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
 * @param {string} message - Error message to display to client
 * @param {number} statusCode - Optional status code (default: 500)
 * @param {any} error - Optional error object for debugging/logging
 * @param {boolean} includeErrorDetails - Show error details if not in production

 */
export const sendError = (
  res,
  message = 'Internal Server Error',
  statusCode = 500,
  error = null,
  includeErrorDetails = process.env.NODE_ENV !== 'production'
) => {
  if (error) console.error('❌ Error:', error);

  const response = {
    success: false,
    message,
  };

  if (includeErrorDetails && error) {
    response.error = error?.message || error?.toString?.() || String(error);
  }

  return res.status(statusCode).json(response);
};

