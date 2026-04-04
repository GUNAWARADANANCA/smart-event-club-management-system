const jwt = require('jsonwebtoken');

function getJwtSecret() {
  return process.env.JWT_SECRET?.trim() || null;
}

/**
 * Verifies JWT from `Authorization: Bearer <token>`.
 * Sets `req.user = { id, role }` on success (`role` defaults to student if missing in token).
 */
function authRequired(req, res, next) {
  const secret = getJwtSecret();
  if (!secret) {
    return res
      .status(500)
      .json({ error: 'Authentication is not configured on the server' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided' });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Invalid token format' });
  }

  try {
    const payload = jwt.verify(token, secret);
    const id = payload.sub;
    if (!id) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const role =
      typeof payload.role === 'string' && payload.role ? payload.role : 'student';
    req.user = { id: String(id), role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ error: 'Token has expired. Please log in again' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    next(err);
  }
}

/** Use after `authRequired`. Allows only users whose JWT role is in `allowedRoles`. */
function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Access denied. No token provided' });
    }
    const role = req.user.role || 'student';
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        error: 'You do not have permission to access this resource',
      });
    }
    next();
  };
}

module.exports = {
  authRequired,
  getJwtSecret,
  requireRoles,
};
