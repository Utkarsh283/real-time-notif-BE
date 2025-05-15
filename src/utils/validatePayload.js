module.exports.validatePayload = ({ title, message, type }) => {
  if (!title || !message || !type) {
    return 'Missing required fields: title, message, or type.';
  }

  const validTypes = ['info', 'warning', 'error'];
  if (!validTypes.includes(type)) {
    return `Invalid type. Expected one of: ${validTypes.join(', ')}`;
  }

  return null;
};
