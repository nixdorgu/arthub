function formatPayload(user) {
  const payload = { ...user };
  Reflect.deleteProperty(payload, 'password');
  Reflect.deleteProperty(payload, 'status');
  Object.assign(payload, { iat: Date.now() });

  return payload;
}

module.exports = formatPayload;
