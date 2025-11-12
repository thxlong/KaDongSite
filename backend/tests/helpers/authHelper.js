import { factories } from './factories.js';
import { dbHelper } from './dbHelper.js';
import crypto from 'crypto';

export const authHelper = {
  /**
   * Create test user and return auth token (simplified without JWT)
   */
  async createAuthenticatedUser(role = 'user') {
    const userData = factories.user({ role });
    const user = await dbHelper.insert('users', userData);
    
    // Generate simple token for testing
    const token = `test_token_${user.id}_${Date.now()}`;
    
    return { user, token };
  },
  
  /**
   * Get authorization header
   */
  getAuthHeader(token) {
    return { Authorization: `Bearer ${token}` };
  },
  
  /**
   * Create session for user
   */
  async createSession(userId) {
    const sessionId = crypto.randomUUID();
    const tokenHash = crypto.createHash('sha256').update(`test_token_${sessionId}`).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const session = await dbHelper.insert('sessions', {
      id: sessionId,
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
      created_at: new Date()
    });
    
    return session;
  },
  
  /**
   * Generate mock JWT-like token
   */
  generateMockToken(userId, expiresIn = '1h') {
    const payload = {
      userId,
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
    };
    
    // Simple base64 encode (not secure, just for testing)
    const token = Buffer.from(JSON.stringify(payload)).toString('base64');
    return token;
  },
  
  /**
   * Create expired token
   */
  generateExpiredToken(userId) {
    const payload = {
      userId,
      exp: Math.floor(Date.now() / 1000) - (60 * 60) // Expired 1 hour ago
    };
    
    const token = Buffer.from(JSON.stringify(payload)).toString('base64');
    return token;
  }
};
