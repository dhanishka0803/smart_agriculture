import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CloudRain, Sun, Snowflake, Wind } from 'lucide-react';
import { weatherService, alertService } from '../services/api';

function Alerts() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const weather = await weatherService.getWeather(11.0168, 76.9558);
      const alertData = await alertService.generateAlerts({
        forecast: weather.forecast,
        current_temp: weather.current.temp
      });
      setAlerts(alertData.alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getSeverityTextColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-red-800';
      case 'medium':
        return 'text-yellow-800';
      case 'low':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'drought_risk':
        return <Sun className="w-8 h-8 text-orange-500" />;
      case 'flood_warning':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'heatwave':
        return <Sun className="w-8 h-8 text-red-500" />;
      case 'cold_wave':
        return <Snowflake className="w-8 h-8 text-blue-400" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="gradient-bg text-white rounded-xl p-6">
        <h2 className="text-3xl font-bold mb-2">Climate Risk Alerts</h2>
        <p className="text-green-100">Stay informed about weather risks and protect your crops</p>
      </div>

      {alerts.length === 0 ? (
        <div className="card text-center py-12">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Alerts</h3>
          <p className="text-gray-600">Weather conditions are favorable. No immediate risks detected.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div key={index} className={`alert-card ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`text-xl font-bold ${getSeverityTextColor(alert.severity)}`}>
                        {alert.icon} {alert.title}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                        alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                        alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {alert.severity.toUpperCase()} PRIORITY
                      </span>
                    </div>
                  </div>
                  
                  <p className={`text-lg mb-4 ${getSeverityTextColor(alert.severity)}`}>
                    {alert.message}
                  </p>
                  
                  <div className={`bg-white bg-opacity-50 rounded-lg p-4 ${getSeverityTextColor(alert.severity)}`}>
                    <p className="font-semibold mb-1">Recommended Action:</p>
                    <p className="text-sm">{alert.action}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alert Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card bg-red-50 border-2 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-semibold">High Priority</p>
              <p className="text-3xl font-bold text-red-700">
                {alerts.filter(a => a.severity === 'high').length}
              </p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <div className="card bg-yellow-50 border-2 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-semibold">Medium Priority</p>
              <p className="text-3xl font-bold text-yellow-700">
                {alerts.filter(a => a.severity === 'medium').length}
              </p>
            </div>
            <Wind className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="card bg-green-50 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-semibold">Total Alerts</p>
              <p className="text-3xl font-bold text-green-700">{alerts.length}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alerts;
