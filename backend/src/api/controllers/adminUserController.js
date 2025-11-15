/**
 * Admin Controller - User Management
 * 
 * Handles all admin operations for user management:
 * - List users with pagination and filters
 * - Create new users
 * - Update user information
 * - Delete users (soft delete)
 * - Lock/unlock user accounts
 * - Reset user passwords
 */

import pool from '../../../config/database.js';
import bcrypt from 'bcrypt';

/**
 * GET /api/admin/users
 * Get paginated list of users with optional filters
 */
async function getUsers(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      role = '',
      status = '', // 'active', 'locked', 'all'
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = ['u.deleted_at IS NULL'];
    let queryParams = [];
    let paramIndex = 1;

    if (search) {
      whereConditions.push(`(u.email ILIKE $${paramIndex} OR u.full_name ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (role) {
      whereConditions.push(`u.role = $${paramIndex}`);
      queryParams.push(role);
      paramIndex++;
    }

    if (status === 'locked') {
      whereConditions.push('u.locked_at IS NOT NULL');
    } else if (status === 'active') {
      whereConditions.push('u.locked_at IS NULL');
    }

    const whereClause = whereConditions.join(' AND ');

    // Valid sort columns
    const validSortColumns = ['created_at', 'email', 'name', 'full_name', 'last_login_at'];
    // Map full_name to name for actual column
    let sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    if (sortColumn === 'full_name') sortColumn = 'name';
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // Get total count (using legacy role column)
    const countQuery = `
      SELECT COUNT(DISTINCT u.id) 
      FROM users u
      WHERE ${whereClause}
    `;
    const countResult = await pool.query(countQuery, queryParams);
    const totalUsers = parseInt(countResult.rows[0].count);

    // Get users with roles (using legacy role column)
    const usersQuery = `
      SELECT 
        u.id,
        u.email,
        u.name as full_name,
        u.created_at,
        u.updated_at,
        u.role,
        -- Convert legacy role to roles array format for API compatibility
        CASE 
          WHEN u.role IS NOT NULL THEN 
            json_build_array(
              json_build_object(
                'id', u.role,
                'name', u.role,
                'assigned_at', u.created_at
              )
            )
          ELSE '[]'::json
        END as roles
      FROM users u
      WHERE ${whereClause}
      GROUP BY u.id
      ORDER BY u.${sortColumn} ${sortDirection}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const usersResult = await pool.query(usersQuery, queryParams);

    res.json({
      success: true,
      data: {
        users: usersResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalUsers,
          totalPages: Math.ceil(totalUsers / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
}

/**
 * GET /api/admin/users/:id
 * Get single user with detailed information
 */
async function getUser(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        u.id,
        u.email,
        u.name as full_name,
        u.created_at,
        u.updated_at,
        u.locked_at,
        u.lock_reason,
        u.last_login_at,
        u.role,
        CASE 
          WHEN u.role IS NOT NULL THEN 
            json_build_array(
              json_build_object(
                'id', u.role,
                'name', u.role,
                'assigned_at', u.created_at
              )
            )
          ELSE '[]'::json
        END as roles,
        (SELECT COUNT(*) FROM sessions WHERE user_id = u.id AND expires_at > NOW()) as active_sessions
      FROM users u
      WHERE u.id = $1 AND u.deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user: result.rows[0] }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
}

/**
 * POST /api/admin/users
 * Create new user
 */
async function createUser(req, res) {
  try {
    const { email, full_name, password, role_ids = [] } = req.body;

    // Validate required fields
    if (!email || !full_name || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email, full name, and password are required'
      });
    }

    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create user
      const result = await pool.query(
        `INSERT INTO users (email, name, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, email, name as full_name, created_at`,
        [email, full_name, hashedPassword]
      );

      const newUser = result.rows[0];

      // Assign roles if provided
      if (role_ids.length > 0) {
        for (const roleId of role_ids) {
          await client.query(
            `INSERT INTO user_roles (user_id, role_id, assigned_by)
             VALUES ($1, $2, $3)`,
            [newUser.id, roleId, req.user.id]
          );
        }
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        data: { user: newUser },
        message: 'User created successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
}

/**
 * PUT /api/admin/users/:id
 * Update user information
 */
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { email, full_name } = req.body;

    // Build update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (email) {
      updates.push(`email = $${paramIndex}`);
      values.push(email);
      paramIndex++;
    }

    if (full_name) {
      updates.push(`name = $${paramIndex}`);
      values.push(full_name);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE users 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex} AND deleted_at IS NULL
       RETURNING id, email, name as full_name, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user: result.rows[0] },
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    
    // Handle unique constraint violation
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
}

/**
 * DELETE /api/admin/users/:id
 * Soft delete user
 */
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE users 
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, email`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
}

/**
 * POST /api/admin/users/:id/lock
 * Lock user account
 */
async function lockUser(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Lock reason is required'
      });
    }

    const result = await pool.query(
      `UPDATE users 
       SET locked_at = NOW(), lock_reason = $1
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING id, email, locked_at, lock_reason`,
      [reason, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Revoke all active sessions
    await pool.query(
      `UPDATE sessions 
       SET revoked_at = NOW()
       WHERE user_id = $1 AND expires_at > NOW() AND revoked_at IS NULL`,
      [id]
    );

    res.json({
      success: true,
      data: { user: result.rows[0] },
      message: 'User account locked successfully'
    });
  } catch (error) {
    console.error('Lock user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to lock user account'
    });
  }
}

/**
 * POST /api/admin/users/:id/unlock
 * Unlock user account
 */
async function unlockUser(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE users 
       SET locked_at = NULL, lock_reason = NULL
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, email`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user: result.rows[0] },
      message: 'User account unlocked successfully'
    });
  } catch (error) {
    console.error('Unlock user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unlock user account'
    });
  }
}

/**
 * POST /api/admin/users/:id/reset-password
 * Reset user password
 */
async function resetPassword(req, res) {
  try {
    const { id } = req.params;
    const { new_password } = req.body;

    if (!new_password || new_password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    const result = await pool.query(
      `UPDATE users 
       SET password = $1, updated_at = NOW()
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING id, email`,
      [hashedPassword, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password'
    });
  }
}

/**
 * GET /api/admin/users/:id/sessions
 * Get user's active sessions
 */
async function getUserSessions(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        id,
        user_agent,
        ip_address,
        created_at,
        expires_at,
        last_activity
      FROM sessions
      WHERE user_id = $1 AND expires_at > NOW() AND revoked_at IS NULL
      ORDER BY last_activity DESC`,
      [id]
    );

    res.json({
      success: true,
      data: { sessions: result.rows }
    });
  } catch (error) {
    console.error('Get user sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sessions'
    });
  }
}

/**
 * DELETE /api/admin/users/:userId/sessions/:sessionId
 * Revoke specific user session
 */
async function revokeSession(req, res) {
  try {
    const { userId, sessionId } = req.params;

    const result = await pool.query(
      `UPDATE sessions 
       SET revoked_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [sessionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session revoked successfully'
    });
  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to revoke session'
    });
  }
}

export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  lockUser,
  unlockUser,
  resetPassword,
  getUserSessions,
  revokeSession
};
