import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import DashboardCard from '@/components/DashboardCard';
import LineChart from '@/components/charts/LineChart';
import ProgressCircle from '@/components/charts/ProgressCircle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit } from 'lucide-react';
import { format, parseISO, startOfToday, isValid } from 'date-fns';
import { toast } from 'sonner';

const HealthPage = () => {
  const { state, addHealthEntry, updateHealthEntry } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    water: '',
    weight: ''
  });
  
  // Find today's entry
  const today = format(startOfToday(), 'yyyy-MM-dd');
  const todayEntry = state.health.entries.find(entry => entry.date === today);
  
  // Get weight history
  const weightHistory = state.health.entries
    .filter(entry => entry.weight)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      date: entry.date,
      value: entry.weight as number
    }));
  
  // Calculate daily progress - UPDATE HERE to use profile.goals
  const calorieProgress = todayEntry ? (todayEntry.calories / state.profile.goals.dailyCalories) * 100 : 0;
  const proteinProgress = todayEntry ? (todayEntry.protein / state.profile.goals.dailyProtein) * 100 : 0;
  const waterProgress = todayEntry ? (todayEntry.water / state.profile.goals.dailyWater) * 100 : 0;
  
  // Format dates
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return dateString;
      return format(date, 'MMM d');
    } catch (error) {
      return dateString;
    }
  };
  
  // Handle new entry
  const handleNewEntry = () => {
    setEditingEntry(null);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      water: '',
      weight: ''
    });
    setDialogOpen(true);
  };
  
  // Handle edit entry
  const handleEditEntry = (entry: any) => {
    setEditingEntry(entry);
    setFormData({
      date: entry.date,
      calories: entry.calories.toString(),
      protein: entry.protein.toString(),
      carbs: entry.carbs.toString(),
      fat: entry.fat.toString(),
      water: entry.water.toString(),
      weight: entry.weight ? entry.weight.toString() : ''
    });
    setDialogOpen(true);
  };
  
  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const entryData = {
        date: formData.date,
        calories: parseInt(formData.calories) || 0,
        protein: parseInt(formData.protein) || 0,
        carbs: parseInt(formData.carbs) || 0,
        fat: parseInt(formData.fat) || 0,
        water: parseInt(formData.water) || 0,
        weight: formData.weight ? parseFloat(formData.weight) : undefined
      };
      
      if (editingEntry) {
        updateHealthEntry({
          ...editingEntry,
          ...entryData
        });
        toast.success("Health entry updated");
      } else {
        addHealthEntry(entryData);
        toast.success("Health entry added");
      }
      
      setDialogOpen(false);
    } catch (error) {
      toast.error("Error saving health entry");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold neon-text-cyan mb-6">Health Tracker</h1>
        <Button onClick={handleNewEntry} className="bg-cyan hover:bg-cyan/80 text-navy">
          <Plus size={18} className="mr-1" /> New Entry
        </Button>
      </div>
      
      {/* Daily Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Calories" variant="cyan">
          <div className="flex flex-col items-center">
            <ProgressCircle percentage={Math.round(calorieProgress)} color="#00FFFF">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">
                  {todayEntry ? todayEntry.calories : 0}
                </span>
                <span className="text-xs text-muted-foreground">
                  of {state.profile.goals.dailyCalories}
                </span>
              </div>
            </ProgressCircle>
            <p className="mt-2 text-sm text-muted-foreground">
              {Math.round(calorieProgress)}% of daily goal
            </p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Protein" variant="magenta">
          <div className="flex flex-col items-center">
            <ProgressCircle percentage={Math.round(proteinProgress)} color="#FF00FF">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">
                  {todayEntry ? todayEntry.protein : 0}g
                </span>
                <span className="text-xs text-muted-foreground">
                  of {state.profile.goals.dailyProtein}g
                </span>
              </div>
            </ProgressCircle>
            <p className="mt-2 text-sm text-muted-foreground">
              {Math.round(proteinProgress)}% of daily goal
            </p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Water" variant="cyan">
          <div className="flex flex-col items-center">
            <ProgressCircle percentage={Math.round(waterProgress)} color="#00FFFF">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">
                  {todayEntry ? todayEntry.water : 0}oz
                </span>
                <span className="text-xs text-muted-foreground">
                  of {state.profile.goals.dailyWater}oz
                </span>
              </div>
            </ProgressCircle>
            <p className="mt-2 text-sm text-muted-foreground">
              {Math.round(waterProgress)}% of daily goal
            </p>
          </div>
        </DashboardCard>
      </div>
      
      {/* Weight Tracking */}
      <DashboardCard title="Weight History" variant="magenta">
        {weightHistory.length > 0 ? (
          <div className="space-y-4">
            <LineChart 
              data={weightHistory} 
              color="#FF00FF" 
              formatYAxis={(value) => `${value} lbs`}
              formatTooltip={(value) => `${value} lbs`}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <div>
                <span className="block">Current</span>
                <span className="font-medium text-foreground">
                  {weightHistory[weightHistory.length - 1].value} lbs
                </span>
              </div>
              <div>
                <span className="block">Target</span>
                <span className="font-medium text-foreground">
                  {state.profile.goals.targetWeight || 'Not set'} lbs
                </span>
              </div>
              <div>
                <span className="block">Change</span>
                <span className={`font-medium ${
                  weightHistory.length > 1 
                    ? weightHistory[weightHistory.length - 1].value < weightHistory[0].value 
                      ? 'text-green-400' 
                      : weightHistory[weightHistory.length - 1].value > weightHistory[0].value 
                        ? 'text-red-400' 
                        : 'text-foreground'
                    : 'text-foreground'
                }`}>
                  {weightHistory.length > 1 
                    ? (weightHistory[weightHistory.length - 1].value - weightHistory[0].value).toFixed(1) 
                    : '0'} lbs
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p>No weight data available. Add your first entry to start tracking.</p>
          </div>
        )}
      </DashboardCard>
      
      {/* Recent Entries */}
      <DashboardCard title="Recent Entries" variant="cyan">
        {state.health.entries.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">No entries yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4">Date</th>
                  <th className="text-left py-2 px-4">Calories</th>
                  <th className="text-left py-2 px-4">Protein</th>
                  <th className="text-left py-2 px-4">Carbs</th>
                  <th className="text-left py-2 px-4">Fat</th>
                  <th className="text-left py-2 px-4">Water</th>
                  <th className="text-left py-2 px-4">Weight</th>
                  <th className="text-right py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.health.entries
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 7)
                  .map(entry => (
                    <tr key={entry.id} className="border-b border-border">
                      <td className="py-2 px-4">{formatDate(entry.date)}</td>
                      <td className="py-2 px-4">{entry.calories}</td>
                      <td className="py-2 px-4">{entry.protein}g</td>
                      <td className="py-2 px-4">{entry.carbs}g</td>
                      <td className="py-2 px-4">{entry.fat}g</td>
                      <td className="py-2 px-4">{entry.water}oz</td>
                      <td className="py-2 px-4">{entry.weight ? `${entry.weight} lbs` : '-'}</td>
                      <td className="py-2 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditEntry(entry)}
                        >
                          <Edit size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>
      
      {/* Entry Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? 'Edit Health Entry' : 'Add New Health Entry'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">Date</label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="calories" className="text-sm font-medium">Calories</label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="protein" className="text-sm font-medium">Protein (g)</label>
                <Input
                  id="protein"
                  name="protein"
                  type="number"
                  min="0"
                  value={formData.protein}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="carbs" className="text-sm font-medium">Carbs (g)</label>
                <Input
                  id="carbs"
                  name="carbs"
                  type="number"
                  min="0"
                  value={formData.carbs}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="fat" className="text-sm font-medium">Fat (g)</label>
                <Input
                  id="fat"
                  name="fat"
                  type="number"
                  min="0"
                  value={formData.fat}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="water" className="text-sm font-medium">Water (oz)</label>
                <Input
                  id="water"
                  name="water"
                  type="number"
                  min="0"
                  value={formData.water}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="weight" className="text-sm font-medium">Weight (lbs)</label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-cyan text-navy hover:bg-cyan/80">
                {editingEntry ? 'Update' : 'Add'} Entry
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthPage;
