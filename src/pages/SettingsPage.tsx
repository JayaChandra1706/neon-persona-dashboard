
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import DashboardCard from '@/components/DashboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { state, updateProfile, toggleDarkMode } = useAppContext();
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: state.profile.name,
    avatar: state.profile.avatar || ''
  });
  
  // Goals form state
  const [goalsForm, setGoalsForm] = useState({
    dailyCalories: state.profile.goals.dailyCalories.toString(),
    dailyProtein: state.profile.goals.dailyProtein.toString(),
    dailyWater: state.profile.goals.dailyWater.toString(),
    targetWeight: state.profile.goals.targetWeight?.toString() || ''
  });
  
  // Handle profile form change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle goals form change
  const handleGoalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGoalsForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle profile form submit
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile({
      name: profileForm.name,
      avatar: profileForm.avatar
    });
    
    toast.success("Profile updated");
  };
  
  // Handle goals form submit
  const handleGoalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile({
      goals: {
        dailyCalories: parseInt(goalsForm.dailyCalories) || 0,
        dailyProtein: parseInt(goalsForm.dailyProtein) || 0,
        dailyWater: parseInt(goalsForm.dailyWater) || 0,
        targetWeight: goalsForm.targetWeight ? parseFloat(goalsForm.targetWeight) : undefined
      }
    });
    
    toast.success("Goals updated");
  };
  
  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    toggleDarkMode();
    toast.success(`${state.isDarkMode ? 'Light' : 'Dark'} mode activated`);
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold neon-text-cyan mb-6">Settings</h1>
      
      {/* Profile Settings */}
      <DashboardCard title="Profile" variant="cyan">
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileForm.avatar} />
                <AvatarFallback className="bg-muted text-lg">
                  {getInitials(profileForm.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-4 flex-grow">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  name="avatar"
                  value={profileForm.avatar}
                  onChange={handleProfileChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-cyan hover:bg-cyan/80 text-navy">
              Save Profile
            </Button>
          </div>
        </form>
      </DashboardCard>
      
      {/* Goals Settings */}
      <DashboardCard title="Health & Fitness Goals" variant="magenta">
        <form onSubmit={handleGoalsSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dailyCalories">Daily Calorie Target</Label>
              <Input
                id="dailyCalories"
                name="dailyCalories"
                type="number"
                min="0"
                value={goalsForm.dailyCalories}
                onChange={handleGoalsChange}
                placeholder="e.g., 2000"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dailyProtein">Daily Protein Target (g)</Label>
              <Input
                id="dailyProtein"
                name="dailyProtein"
                type="number"
                min="0"
                value={goalsForm.dailyProtein}
                onChange={handleGoalsChange}
                placeholder="e.g., 150"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dailyWater">Daily Water Target (oz)</Label>
              <Input
                id="dailyWater"
                name="dailyWater"
                type="number"
                min="0"
                value={goalsForm.dailyWater}
                onChange={handleGoalsChange}
                placeholder="e.g., 64"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetWeight">Target Weight (lbs)</Label>
              <Input
                id="targetWeight"
                name="targetWeight"
                type="number"
                min="0"
                step="0.1"
                value={goalsForm.targetWeight}
                onChange={handleGoalsChange}
                placeholder="Optional"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-magenta hover:bg-magenta/80 text-navy">
              Save Goals
            </Button>
          </div>
        </form>
      </DashboardCard>
      
      {/* Appearance Settings */}
      <DashboardCard title="Appearance" variant="cyan">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Dark Mode</h3>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark themes
            </p>
          </div>
          <Switch
            checked={state.isDarkMode}
            onCheckedChange={handleDarkModeToggle}
          />
        </div>
      </DashboardCard>
      
      {/* About Section */}
      <DashboardCard title="About" variant="magenta">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg">Personal Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Version 1.0.0
            </p>
          </div>
          
          <p className="text-sm">
            A personal dashboard to track your daily experiences, finances, health metrics, and gym workouts.
          </p>
          
          <div className="flex space-x-4">
            <Button variant="outline" size="sm">
              Release Notes
            </Button>
            <Button variant="outline" size="sm">
              Support
            </Button>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default SettingsPage;
