import { Globe, Bell, Search, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header({ user, onLanguageChange, currentLang }) {
  const { t } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Weather Alert', message: 'Heavy rainfall expected tomorrow', time: '5 min ago', type: 'warning' },
    { id: 2, title: 'Crop Ready', message: 'Your wheat crop is ready for harvest', time: '1 hour ago', type: 'success' },
    { id: 3, title: 'Market Update', message: 'Rice prices increased by 5%', time: '2 hours ago', type: 'info' },
  ];

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search crops, weather, market prices..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-600" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg font-medium text-primary focus:outline-none focus:border-primary transition-all"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary to-primary-light">
                  <h3 className="font-bold text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-all cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notif.type === 'warning' ? 'bg-yellow-500' :
                          notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{notif.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <Link 
                    to="/notifications" 
                    onClick={() => setShowNotifications(false)}
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-2 px-3 py-2 bg-accent-cream rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-primary hidden md:block">{user.name}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
