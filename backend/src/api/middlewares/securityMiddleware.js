/**
 * Security Middleware
 * 
 * Provides security features:
 * - IP blocking check
 * - Security alert creation
 * - Suspicious activity detection
 * - Rate limiting for admin actions
 */

import pool from '../../../config/database.js';

/**
 * Middleware to check if IP is blocked
 */
async function checkBlockedIP(req, res, next) {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;

    const result = await pool.query(
      `SELECT id, reason, expires_at 
       FROM blocked_ips 
       WHERE ip_address = $1 
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [ipAddress]
    );

    if (result.rows.length > 0) {
      const block = result.rows[0];
      
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        reason: block.reason,
        expires_at: block.expires_at
      });
    }

    next();
  } catch (error) {
    console.error('IP block check error:', error);
    // Don't block request if check fails
    next();
  }
}

/**
 * Middleware to detect and alert on suspicious login patterns
 */
async function detectSuspiciousLogin(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return next();
    }

    const userId = req.user.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent') || '';

    // Check for multiple logins from different IPs in short time
    const recentLogins = await pool.query(
      `SELECT COUNT(DISTINCT ip_address) as ip_count
       FROM admin_audit_logs
       WHERE admin_id = $1 
       AND action = 'auth.login'
       AND created_at > NOW() - INTERVAL '1 hour'`,
      [userId]
    );

    if (recentLogins.rows[0].ip_count >= 3) {
      // Create security alert
      await pool.query(
        `INSERT INTO security_alerts 
         (type, severity, message, metadata)
         VALUES ($1, $2, $3, $4)`,
        [
          'suspicious_login',
          'medium',
          `User ${userId} logged in from multiple IPs`,
          JSON.stringify({
            user_id: userId,
            ip_count: recentLogins.rows[0].ip_count,
            current_ip: ipAddress,
            user_agent: userAgent
          })
        ]
      );

      console.warn(`[SECURITY] Suspicious login pattern detected for user ${userId}`);
    }

    next();
  } catch (error) {
    console.error('Suspicious login detection error:', error);
    next();
  }
}

/**
 * Middleware to detect brute force attempts
 * Tracks failed login attempts from same IP
 */
const failedAttempts = new Map(); // In-memory store (consider Redis for production)

async function detectBruteForce(req, res, next) {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Store original res.json to check if login failed
    const originalJson = res.json.bind(res);
    
    res.json = async function(data) {
      // Check if this was a failed login
      if (res.statusCode === 401 || (data && !data.success)) {
        const attempts = failedAttempts.get(ipAddress) || 0;
        const newAttempts = attempts + 1;
        
        failedAttempts.set(ipAddress, newAttempts);
        
        // Clear after 15 minutes
        setTimeout(() => {
          failedAttempts.delete(ipAddress);
        }, 15 * 60 * 1000);

        // Alert if threshold exceeded
        if (newAttempts >= 5) {
          await pool.query(
            `INSERT INTO security_alerts 
             (type, severity, message, metadata)
             VALUES ($1, $2, $3, $4)`,
            [
              'brute_force',
              'high',
              `Brute force attempt detected from IP ${ipAddress}`,
              JSON.stringify({
                ip_address: ipAddress,
                attempts: newAttempts,
                user_agent: req.get('user-agent')
              })
            ]
          );

          console.warn(`[SECURITY] Brute force detected from ${ipAddress}: ${newAttempts} attempts`);
        }
      } else if (res.statusCode === 200 && data && data.success) {
        // Clear attempts on successful login
        failedAttempts.delete(ipAddress);
      }

      return originalJson(data);
    };

    next();
  } catch (error) {
    console.error('Brute force detection error:', error);
    next();
  }
}

/**
 * Middleware to detect multiple concurrent sessions
 */
async function detectMultipleSessions(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return next();
    }

    const userId = req.user.id;

    // Count active sessions for user
    const result = await pool.query(
      `SELECT COUNT(*) as session_count
       FROM sessions
       WHERE user_id = $1 
       AND expires_at > NOW()`,
      [userId]
    );

    const sessionCount = parseInt(result.rows[0].session_count);

    if (sessionCount >= 3) {
      // Create security alert
      await pool.query(
        `INSERT INTO security_alerts 
         (type, severity, message, metadata)
         VALUES ($1, $2, $3, $4)`,
        [
          'multiple_sessions',
          'low',
          `User ${userId} has ${sessionCount} active sessions`,
          JSON.stringify({
            user_id: userId,
            session_count: sessionCount,
            current_ip: req.ip || req.connection.remoteAddress
          })
        ]
      );

      console.warn(`[SECURITY] User ${userId} has ${sessionCount} active sessions`);
    }

    next();
  } catch (error) {
    console.error('Multiple sessions detection error:', error);
    next();
  }
}

/**
 * Helper function to create security alert manually
 */
async function createSecurityAlert(type, severity, message, metadata = null) {
  try {
    await pool.query(
      `INSERT INTO security_alerts 
       (type, severity, message, metadata)
       VALUES ($1, $2, $3, $4)`,
      [type, severity, message, metadata ? JSON.stringify(metadata) : null]
    );

    console.log(`[SECURITY ALERT] ${severity.toUpperCase()}: ${message}`);
  } catch (error) {
    console.error('Security alert creation error:', error);
  }
}

/**
 * Middleware to rate limit admin actions
 * Prevents admins from performing too many actions too quickly
 */
const actionCounts = new Map(); // In-memory store

function rateLimit(maxActions = 50, windowMinutes = 5) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return next();
      }

      const userId = req.user.id;
      const now = Date.now();
      const windowMs = windowMinutes * 60 * 1000;
      
      const userActions = actionCounts.get(userId) || [];
      
      // Filter actions within time window
      const recentActions = userActions.filter(timestamp => now - timestamp < windowMs);
      
      if (recentActions.length >= maxActions) {
        return res.status(429).json({
          success: false,
          error: 'Too many requests',
          message: `Maximum ${maxActions} actions per ${windowMinutes} minutes`,
          retry_after: Math.ceil((recentActions[0] + windowMs - now) / 1000)
        });
      }

      // Add current action
      recentActions.push(now);
      actionCounts.set(userId, recentActions);

      // Clean up old entries periodically
      if (Math.random() < 0.1) { // 10% chance
        for (const [uid, actions] of actionCounts.entries()) {
          const filtered = actions.filter(timestamp => now - timestamp < windowMs);
          if (filtered.length === 0) {
            actionCounts.delete(uid);
          } else {
            actionCounts.set(uid, filtered);
          }
        }
      }

      next();
    } catch (error) {
      console.error('Rate limit error:', error);
      next();
    }
  };
}

export {
  checkBlockedIP,
  detectSuspiciousLogin,
  detectBruteForce,
  detectMultipleSessions,
  createSecurityAlert,
  rateLimit
};
