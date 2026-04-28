'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Button } from '@/components/ui';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: 'Priya Sharma',
    email: 'priya@smartops.ai',
    phone: '+1 (555) 123-4567',
    avatar: 'PS',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // Save settings
    console.log('Settings saved:', formData);
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

        {/* Profile Settings */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </CardBody>
        </Card>

        {/* Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-900 dark:text-white font-medium">Email Notifications</label>
                <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-900 dark:text-white font-medium">Dark Mode</label>
                <input type="checkbox" className="w-5 h-5 rounded" />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-900 dark:text-white font-medium">Two-Factor Authentication</label>
                <input type="checkbox" className="w-5 h-5 rounded" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="border-b border-red-200 dark:border-red-800">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              These actions cannot be undone. Please be careful.
            </p>
            <div className="flex gap-2">
              <Button variant="danger">Change Password</Button>
              <Button variant="danger">Delete Account</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
