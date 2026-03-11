import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, Calendar, LogOut, Edit2, Save } from 'lucide-react';

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      setFormData({
        name: currentUser.name,
        phone: currentUser.phone || '',
        location: currentUser.location || ''
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Update current user
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-sky-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-sky-500 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-green-100">{t('profile.farmer')}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('profile.logout')}</span>
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">{t('profile.accountDetails')}</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>{t('profile.edit')}</span>
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <Save className="w-5 h-5" />
                  <span>{t('profile.save')}</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-600 mt-1" />
                <div className="flex-1">
                  <label className="text-sm text-gray-600">{t('profile.name')}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user.name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600 mt-1" />
                <div className="flex-1">
                  <label className="text-sm text-gray-600">{t('profile.email')}</label>
                  <p className="text-gray-800 font-medium">{user.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-600 mt-1" />
                <div className="flex-1">
                  <label className="text-sm text-gray-600">{t('profile.phone')}</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user.phone || t('profile.notProvided')}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                <div className="flex-1">
                  <label className="text-sm text-gray-600">{t('profile.location')}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user.location || t('profile.notProvided')}</p>
                  )}
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600 mt-1" />
                <div className="flex-1">
                  <label className="text-sm text-gray-600">{t('profile.memberSince')}</label>
                  <p className="text-gray-800 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
