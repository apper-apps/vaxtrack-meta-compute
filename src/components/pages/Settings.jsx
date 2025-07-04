import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';

const Settings = () => {
  const [settings, setSettings] = useState({
    facilityName: 'Healthcare Facility',
    contactEmail: 'admin@facility.com',
    lowStockThreshold: 5,
    expirationWarningDays: 30,
    autoBackup: true,
    emailAlerts: true
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      facilityName: 'Healthcare Facility',
      contactEmail: 'admin@facility.com',
      lowStockThreshold: 5,
      expirationWarningDays: 30,
      autoBackup: true,
      emailAlerts: true
    });
    toast.info('Settings reset to defaults');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          System Settings
        </h2>
        <p className="text-gray-600">
          Configure your vaccine inventory management system preferences
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Facility Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Facility Name"
            id="facilityName"
            value={settings.facilityName}
            onChange={(e) => handleInputChange('facilityName', e.target.value)}
            placeholder="Enter facility name"
          />
          <FormField
            label="Contact Email"
            id="contactEmail"
            type="email"
            value={settings.contactEmail}
            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
            placeholder="Enter contact email"
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Alert Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Low Stock Threshold"
            id="lowStockThreshold"
            type="number"
            min="1"
            max="100"
            value={settings.lowStockThreshold}
            onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value))}
            placeholder="5"
          />
          <FormField
            label="Expiration Warning Days"
            id="expirationWarningDays"
            type="number"
            min="1"
            max="365"
            value={settings.expirationWarningDays}
            onChange={(e) => handleInputChange('expirationWarningDays', parseInt(e.target.value))}
            placeholder="30"
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          System Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <ApperIcon name="Database" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-gray-900">Auto Backup</p>
                <p className="text-sm text-gray-600">Automatically backup data daily</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.autoBackup}
                onChange={(e) => handleInputChange('autoBackup', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <ApperIcon name="Mail" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-gray-900">Email Alerts</p>
                <p className="text-sm text-gray-600">Send email notifications for alerts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.emailAlerts}
                onChange={(e) => handleInputChange('emailAlerts', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Actions
        </h3>
        <div className="flex gap-4">
          <Button
            variant="primary"
            loading={loading}
            onClick={handleSave}
            icon="Save"
          >
            Save Settings
          </Button>
          <Button
            variant="secondary"
            onClick={handleReset}
            icon="RotateCcw"
          >
            Reset to Defaults
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default Settings;