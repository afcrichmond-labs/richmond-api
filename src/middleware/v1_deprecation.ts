// ENG-56: Add Sunset + Deprecation headers to all v1 responses
export const v1DeprecationMiddleware = (req, res, next) => {
  res.set('Sunset', 'Tue, 01 Apr 2026 00:00:00 GMT');
  res.set('Deprecation', 'true');
  logV1Usage(req.headers['x-api-key'], req.path);
  next();
};
