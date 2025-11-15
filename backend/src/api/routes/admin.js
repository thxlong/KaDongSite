/**
 * Admin Routes
 * 
 * All routes require authentication and admin/moderator role
 * Audit logging is applied to all state-changing operations
 * Security checks (IP blocking, account lock) are applied
 */

import express from 'express';
const router = express.Router();

// Middleware
import { requireAdmin, requirePermission, preventSelfTarget, checkAccountLocked } from '../middlewares/adminMiddleware.js';
import { 
  logUserAction, 
  logRoleAction, 
  logIPAction, 
  logRoleAssignment, 
  logRoleRemoval 
} from '../middlewares/auditMiddleware.js';
import { checkBlockedIP, rateLimit } from '../middlewares/securityMiddleware.js';

// Controllers
import * as adminUserController from '../controllers/adminUserController.js';
import * as adminRoleController from '../controllers/adminRoleController.js';
import * as adminSecurityController from '../controllers/adminSecurityController.js';
import * as adminDashboardController from '../controllers/adminDashboardController.js';

// Apply global admin middleware to all routes
router.use(checkBlockedIP);
router.use(checkAccountLocked);
router.use(requireAdmin);
router.use(rateLimit(100, 5)); // 100 requests per 5 minutes

// ======================
// Dashboard Routes
// ======================
router.get('/dashboard/stats', adminDashboardController.getDashboardStats);
router.get('/dashboard/activity-chart', adminDashboardController.getActivityChart);
router.get('/system/health', adminDashboardController.getSystemHealth);

// ======================
// User Management Routes
// ======================
router.get('/users', adminUserController.getUsers);
router.get('/users/:id', adminUserController.getUser);
router.post(
  '/users',
  requirePermission('users.create'),
  logUserAction('user.create'),
  adminUserController.createUser
);
router.put(
  '/users/:id',
  requirePermission('users.edit'),
  logUserAction('user.update'),
  adminUserController.updateUser
);
router.delete(
  '/users/:id',
  requirePermission('users.delete'),
  preventSelfTarget,
  logUserAction('user.delete'),
  adminUserController.deleteUser
);

// User account management
router.post(
  '/users/:id/lock',
  requirePermission('users.lock'),
  preventSelfTarget,
  logUserAction('user.lock'),
  adminUserController.lockUser
);
router.post(
  '/users/:id/unlock',
  requirePermission('users.lock'),
  logUserAction('user.unlock'),
  adminUserController.unlockUser
);
router.post(
  '/users/:id/reset-password',
  requirePermission('users.edit'),
  logUserAction('user.reset_password'),
  adminUserController.resetPassword
);

// User sessions
router.get('/users/:id/sessions', adminUserController.getUserSessions);
router.delete(
  '/users/:userId/sessions/:sessionId',
  logUserAction('session.revoke'),
  adminUserController.revokeSession
);

// ======================
// Role Management Routes
// ======================
router.get('/roles', adminRoleController.getRoles);
router.get('/roles/:id', adminRoleController.getRole);
router.post(
  '/roles',
  requirePermission('roles.create'),
  logRoleAction('role.create'),
  adminRoleController.createRole
);
router.put(
  '/roles/:id',
  requirePermission('roles.edit'),
  logRoleAction('role.update'),
  adminRoleController.updateRole
);
router.delete(
  '/roles/:id',
  requirePermission('roles.delete'),
  logRoleAction('role.delete'),
  adminRoleController.deleteRole
);

// Role assignment
router.post(
  '/users/:userId/roles/:roleId',
  requirePermission('roles.assign'),
  logRoleAssignment(),
  adminRoleController.assignRole
);
router.delete(
  '/users/:userId/roles/:roleId',
  requirePermission('roles.assign'),
  preventSelfTarget,
  logRoleRemoval(),
  adminRoleController.removeRole
);

// Permissions
router.get('/permissions', adminRoleController.getPermissions);

// ======================
// Security Management Routes
// ======================

// Security alerts
router.get('/security/alerts', adminSecurityController.getAlerts);
router.get('/security/alerts/stats', adminSecurityController.getAlertStats);
router.post(
  '/security/alerts/:id/review',
  requirePermission('security.review_alerts'),
  adminSecurityController.reviewAlert
);
router.post(
  '/security/alerts/review-all',
  requirePermission('security.review_alerts'),
  adminSecurityController.reviewAllAlerts
);

// IP blocking
router.get('/security/blocked-ips', adminSecurityController.getBlockedIPs);
router.post(
  '/security/blocked-ips',
  requirePermission('security.block_ip'),
  logIPAction('ip.block'),
  adminSecurityController.blockIP
);
router.delete(
  '/security/blocked-ips/:id',
  requirePermission('security.unblock_ip'),
  logIPAction('ip.unblock'),
  adminSecurityController.unblockIP
);
router.put(
  '/security/blocked-ips/:id',
  requirePermission('security.block_ip'),
  logIPAction('ip.update'),
  adminSecurityController.updateBlockedIP
);
router.post(
  '/security/cleanup-expired',
  requirePermission('security.block_ip'),
  adminSecurityController.cleanupExpiredBlocks
);

// ======================
// Audit Log Routes
// ======================
router.get('/audit-logs', adminDashboardController.getAuditLogs);
router.get('/audit-logs/export', requirePermission('audit.export'), adminDashboardController.exportAuditLogs);
router.get('/audit-logs/:id', adminDashboardController.getAuditLog);
router.get('/audit-logs/user/:userId', adminDashboardController.getUserAuditLogs);

export default router;
