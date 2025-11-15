/**
 * Admin Controller - Role Management
 * 
 * Handles all admin operations for role management:
 * - List all roles
 * - Create new roles
 * - Update role permissions
 * - Delete roles
 * - Assign roles to users
 * - Remove roles from users
 */

import pool from '../../../config/database.js';

/**
 * GET /api/admin/roles
 * Get all roles
 */
async function getRoles(req, res) {
  try {
    const result = await pool.query(
      `SELECT 
        id,
        name,
        description,
        permissions,
        is_system,
        created_at,
        updated_at,
        (SELECT COUNT(*) FROM user_roles WHERE role_id = roles.id) as user_count
      FROM roles
      ORDER BY 
        CASE name
          WHEN 'admin' THEN 1
          WHEN 'moderator' THEN 2
          WHEN 'user' THEN 3
          WHEN 'guest' THEN 4
          ELSE 5
        END,
        name`
    );

    res.json({
      success: true,
      data: { roles: result.rows }
    });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch roles'
    });
  }
}

/**
 * GET /api/admin/roles/:id
 * Get single role with users
 */
async function getRole(req, res) {
  try {
    const { id } = req.params;

    // Get role details
    const roleResult = await pool.query(
      `SELECT 
        id,
        name,
        description,
        permissions,
        is_system,
        created_at,
        updated_at
      FROM roles
      WHERE id = $1`,
      [id]
    );

    if (roleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }

    // Get users with this role
    const usersResult = await pool.query(
      `SELECT 
        u.id,
        u.email,
        u.full_name,
        ur.assigned_at,
        ur.assigned_by
      FROM user_roles ur
      JOIN users u ON ur.user_id = u.id
      WHERE ur.role_id = $1 AND u.deleted_at IS NULL
      ORDER BY ur.assigned_at DESC`,
      [id]
    );

    res.json({
      success: true,
      data: {
        role: roleResult.rows[0],
        users: usersResult.rows
      }
    });
  } catch (error) {
    console.error('Get role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch role'
    });
  }
}

/**
 * POST /api/admin/roles
 * Create new role
 */
async function createRole(req, res) {
  try {
    const { name, description, permissions = [] } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Role name is required'
      });
    }

    // Check if role name already exists
    const existingRole = await pool.query(
      'SELECT id FROM roles WHERE name = $1',
      [name]
    );

    if (existingRole.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Role name already exists'
      });
    }

    // Validate permissions format
    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        error: 'Permissions must be an array'
      });
    }

    const result = await pool.query(
      `INSERT INTO roles (name, description, permissions)
       VALUES ($1, $2, $3)
       RETURNING id, name, description, permissions, created_at`,
      [name, description || null, JSON.stringify(permissions)]
    );

    res.status(201).json({
      success: true,
      data: { role: result.rows[0] },
      message: 'Role created successfully'
    });
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create role'
    });
  }
}

/**
 * PUT /api/admin/roles/:id
 * Update role
 */
async function updateRole(req, res) {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    // Check if role exists and is not system role
    const roleCheck = await pool.query(
      'SELECT is_system FROM roles WHERE id = $1',
      [id]
    );

    if (roleCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }

    if (roleCheck.rows[0].is_system) {
      return res.status(400).json({
        success: false,
        error: 'Cannot modify system roles'
      });
    }

    // Build update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name) {
      updates.push(`name = $${paramIndex}`);
      values.push(name);
      paramIndex++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      values.push(description);
      paramIndex++;
    }

    if (permissions) {
      if (!Array.isArray(permissions)) {
        return res.status(400).json({
          success: false,
          error: 'Permissions must be an array'
        });
      }
      updates.push(`permissions = $${paramIndex}`);
      values.push(JSON.stringify(permissions));
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
      `UPDATE roles 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, name, description, permissions, updated_at`,
      values
    );

    res.json({
      success: true,
      data: { role: result.rows[0] },
      message: 'Role updated successfully'
    });
  } catch (error) {
    console.error('Update role error:', error);
    
    // Handle unique constraint violation
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Role name already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update role'
    });
  }
}

/**
 * DELETE /api/admin/roles/:id
 * Delete role (only if not system role and no users have it)
 */
async function deleteRole(req, res) {
  try {
    const { id } = req.params;

    // Check if role exists and is not system role
    const roleCheck = await pool.query(
      'SELECT is_system FROM roles WHERE id = $1',
      [id]
    );

    if (roleCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }

    if (roleCheck.rows[0].is_system) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete system roles'
      });
    }

    // Check if any users have this role
    const userCount = await pool.query(
      'SELECT COUNT(*) FROM user_roles WHERE role_id = $1',
      [id]
    );

    if (parseInt(userCount.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete role that is assigned to users'
      });
    }

    await pool.query('DELETE FROM roles WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete role'
    });
  }
}

/**
 * POST /api/admin/users/:userId/roles/:roleId
 * Assign role to user
 */
async function assignRole(req, res) {
  try {
    const { userId, roleId } = req.params;

    // Check if user exists
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND deleted_at IS NULL',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if role exists
    const roleCheck = await pool.query(
      'SELECT id, name FROM roles WHERE id = $1',
      [roleId]
    );

    if (roleCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }

    // Check if user already has this role
    const existingRole = await pool.query(
      'SELECT user_id FROM user_roles WHERE user_id = $1 AND role_id = $2',
      [userId, roleId]
    );

    if (existingRole.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'User already has this role'
      });
    }

    // Assign role
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, assigned_by)
       VALUES ($1, $2, $3)`,
      [userId, roleId, req.user.id]
    );

    res.json({
      success: true,
      message: `Role ${roleCheck.rows[0].name} assigned successfully`
    });
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign role'
    });
  }
}

/**
 * DELETE /api/admin/users/:userId/roles/:roleId
 * Remove role from user
 */
async function removeRole(req, res) {
  try {
    const { userId, roleId } = req.params;

    // Check if this would remove user's last role
    const roleCount = await pool.query(
      'SELECT COUNT(*) FROM user_roles WHERE user_id = $1',
      [userId]
    );

    if (parseInt(roleCount.rows[0].count) <= 1) {
      return res.status(400).json({
        success: false,
        error: 'Cannot remove user\'s last role'
      });
    }

    const result = await pool.query(
      'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2 RETURNING user_id',
      [userId, roleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Role assignment not found'
      });
    }

    res.json({
      success: true,
      message: 'Role removed successfully'
    });
  } catch (error) {
    console.error('Remove role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove role'
    });
  }
}

/**
 * GET /api/admin/permissions
 * Get list of all available permissions
 */
async function getPermissions(req, res) {
  try {
    // Define all available permissions
    const permissions = [
      { category: 'Users', permissions: ['users.view', 'users.create', 'users.edit', 'users.delete', 'users.lock'] },
      { category: 'Roles', permissions: ['roles.view', 'roles.create', 'roles.edit', 'roles.delete', 'roles.assign'] },
      { category: 'Security', permissions: ['security.view', 'security.block_ip', 'security.unblock_ip', 'security.review_alerts'] },
      { category: 'Audit', permissions: ['audit.view', 'audit.export'] },
      { category: 'Dashboard', permissions: ['dashboard.view', 'dashboard.stats'] }
    ];

    res.json({
      success: true,
      data: { permissions }
    });
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch permissions'
    });
  }
}

export {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  assignRole,
  removeRole,
  getPermissions
};
