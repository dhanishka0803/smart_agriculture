import { Globe, Bell, Search, Menu, Sun, Moon, User, Settings, LogOut, HelpCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ user, onLanguageChange, currentLang }) {
  const { t } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const notifications = [
    { id: 1, title: 'Weather Alert', message: 'Heavy rainfall expected tomorrow in your area', time: '5 min ago', type: 'warning', read: false },
    { id: 2, title: 'Crop Ready', message: 'Your wheat crop is ready for harvest', time: '1 hour ago', type: 'success', read: false },
    { id: 3, title: 'Market Update', message: 'Rice prices increased by 5% in local markets', time: '2 hours ago', type: 'info', read: true },
    { id: 4, title: 'Irrigation Reminder', message: 'Consider irrigating your crops tomorrow', time: '3 hours ago', type: 'info', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-30 transition-colors">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crops, weather, market prices, tips..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-primary dark:focus:border-primary-light focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="px-2 md:px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg font-medium text-primary dark:text-primary-light focus:outline-none focus:border-primary dark:focus:border-primary-light transition-all bg-white dark:bg-gray-700 text-sm"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="hi">हिंदी</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary to-primary-light">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">Notifications</h3>
                    <button className="text-white text-sm hover:underline">Mark all read</button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer ${!notif.read ? 'bg-blue-50 dark:bg-gray-700' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          notif.type === 'warning' ? 'bg-yellow-500' :
                          notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-800 dark:text-white">{notif.title}</p>
                            {!notif.read && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
                  <Link 
                    to="/notifications" 
                    onClick={() => setShowNotifications(false)}
                    className="text-sm text-primary dark:text-primary-light font-semibold hover:underline"
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              {user ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200 hidden md:block">{user.name}</span>
                </>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </button>

            {showUserMenu && user && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <div className="p-2">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span>Help & Support</span>
                  </Link>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      localStorage.removeItem('currentUser');
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
