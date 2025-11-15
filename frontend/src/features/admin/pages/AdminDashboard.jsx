/**
 * Admin Dashboard Page
 * 
 * Overview of system statistics and recent activity
 * Features:
 * - Stats cards (users, roles, security, sessions)
 * - Activity chart (30-day trends)
 * - Recent alerts
 * - Top admin actions
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
          <span className="text-gray-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="text-red-900 font-medium">Lỗi</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Tổng Users',
      value: stats?.users?.total_users || 0,
      change: `+${stats?.users?.new_users_7d || 0} tuần này`,
      trend: 'up',
      icon: Users,
      color: 'blue',
      link: '/admin/users'
    },
    {
      title: 'Active Sessions',
      value: stats?.sessions?.total_sessions || 0,
      change: `${stats?.sessions?.unique_users || 0} unique users`,
      icon: Activity,
      color: 'green',
      link: '/admin/users'
    },
    {
      title: 'Security Alerts',
      value: stats?.security?.unreviewed_alerts || 0,
      change: `${stats?.security?.high_severity_alerts || 0} high severity`,
      trend: stats?.security?.unreviewed_alerts > 0 ? 'down' : 'neutral',
      icon: AlertTriangle,
      color: 'red',
      link: '/admin/security'
    },
    {
      title: 'Roles',
      value: stats?.roles?.length || 0,
      change: `${stats?.users?.total_users || 0} users total`,
      icon: Shield,
      color: 'purple',
      link: '/admin/roles'
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-100 text-blue-600',
      text: 'text-blue-600',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'bg-green-100 text-green-600',
      text: 'text-green-600',
      border: 'border-green-200'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'bg-red-100 text-red-600',
      text: 'text-red-600',
      border: 'border-red-200'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-100 text-purple-600',
      text: 'text-purple-600',
      border: 'border-purple-200'
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Tổng quan hệ thống quản trị</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="font-medium">Làm mới</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          const colors = colorClasses[card.color];

          return (
            <Link
              key={card.title}
              to={card.link}
              className={`${colors.bg} border ${colors.border} rounded-xl p-6 hover:shadow-lg transition-all`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium mb-2">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                  <div className="flex items-center space-x-1 text-sm">
                    {card.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                    {card.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                    <span className={card.trend === 'up' ? 'text-green-600' : 'text-gray-600'}>
                      {card.change}
                    </span>
                  </div>
                </div>
                <div className={`${colors.icon} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h2>
            <Link
              to="/admin/audit-logs"
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {stats?.recent_activity && stats.recent_activity.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_activity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      {new Date(activity.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{activity.action_count}</p>
                    <p className="text-xs text-gray-500">actions</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Chưa có hoạt động nào</p>
          )}
        </div>

        {/* Top Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Admin Actions</h2>
            <span className="text-sm text-gray-500">30 ngày qua</span>
          </div>

          {stats?.top_actions && stats.top_actions.length > 0 ? (
            <div className="space-y-3">
              {stats.top_actions.map((action, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{action.action}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{action.count}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Chưa có dữ liệu</p>
          )}
        </div>
      </div>

      {/* Role Distribution */}
      {stats?.roles && stats.roles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Phân bổ Roles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.roles.map((role) => (
              <div key={role.name} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">{role.name}</p>
                <p className="text-2xl font-bold text-gray-900">{role.user_count}</p>
                <p className="text-xs text-gray-500">users</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
