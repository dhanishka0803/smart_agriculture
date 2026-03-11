import { Bell, AlertTriangle, CheckCircle, Info, TrendingUp, Cloud, Sprout } from 'lucide-react';
import { useState } from 'react';

function Notifications() {
  const [filter, setFilter] = useState('all');

  const allNotifications = [
    { 
      id: 1, 
      title: 'Weather Alert', 
      message: 'Heavy rainfall expected tomorrow. Ensure proper drainage in your fields.', 
      time: '5 min ago', 
      type: 'warning',
      icon: Cloud,
      read: false
    },
    { 
      id: 2, 
      title: 'Crop Ready', 
      message: 'Your wheat crop is ready for harvest. Optimal moisture level detected.', 
      time: '1 hour ago', 
      type: 'success',
      icon: Sprout,
      read: false
    },
    { 
      id: 3, 
      title: 'Market Update', 
      message: 'Rice prices increased by 5% in local mandi. Good time to sell.', 
      time: '2 hours ago', 
      type: 'info',
      icon: TrendingUp,
      read: false
    },
    { 
      id: 4, 
      title: 'Irrigation Reminder', 
      message: 'Soil moisture level is low. Consider irrigating your tomato field.', 
      time: '3 hours ago', 
      type: 'warning',
      icon: AlertTriangle,
      read: true
    },
    { 
      id: 5, 
      title: 'Disease Alert', 
      message: 'Late blight detected in nearby farms. Monitor your potato crops closely.', 
      time: '5 hours ago', 
      type: 'warning',
      icon: AlertTriangle,
      read: true
    },
    { 
      id: 6, 
      title: 'Fertilizer Schedule', 
      message: 'Time to apply second dose of fertilizer to your corn crop.', 
      time: '1 day ago', 
      type: 'info',
      icon: CheckCircle,
      read: true
    },
    { 
      id: 7, 
      title: 'Weather Forecast', 
      message: 'Clear skies expected for next 7 days. Perfect for harvesting.', 
      time: '1 day ago', 
      type: 'success',
      icon: Cloud,
      read: true
    },
    { 
      id: 8, 
      title: 'Market Opportunity', 
      message: 'High demand for organic vegetables in nearby city markets.', 
      time: '2 days ago', 
      type: 'info',
      icon: TrendingUp,
      read: true
    },
  ];

  const filteredNotifications = filter === 'all' 
    ? allNotifications 
    : filter === 'unread'
    ? allNotifications.filter(n => !n.read)
    : allNotifications.filter(n => n.type === filter);

  const getTypeColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'warning': return 'text-yellow-600';
      case 'success': return 'text-green-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const unreadCount = allNotifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="gradient-bg text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Notifications</h2>
            <p className="text-green-100">Stay updated with important alerts and updates</p>
          </div>
          {unreadCount > 0 && (
            <div className="bg-white text-primary px-4 py-2 rounded-full font-bold">
              {unreadCount} New
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({allNotifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'unread' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'warning' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Warnings
          </button>
          <button
            onClick={() => setFilter('success')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Success
          </button>
          <button
            onClick={() => setFilter('info')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'info' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Info
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="card text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`card border-2 ${getTypeColor(notif.type)} ${
                !notif.read ? 'shadow-lg' : ''
              } hover:scale-[1.02] transition-transform cursor-pointer`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${notif.read ? 'bg-gray-100' : 'bg-white'}`}>
                  <notif.icon className={`w-6 h-6 ${getIconColor(notif.type)}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg">{notif.title}</h3>
                    {!notif.read && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{notif.message}</p>
                  <p className="text-sm text-gray-500">{notif.time}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="card bg-gray-50">
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary">
            Mark All as Read
          </button>
          <button className="btn-secondary">
            Clear All Notifications
          </button>
          <button className="btn-secondary">
            Notification Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
