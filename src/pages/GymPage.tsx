
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import DashboardCard from '@/components/DashboardCard';
import BarChart from '@/components/charts/BarChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { toast } from 'sonner';

const GymPage = () => {
  const { state, addWorkout, updateWorkout, deleteWorkout, getWorkoutStats } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    name: '',
    duration: '',
    notes: '',
    exercises: [{ name: '', sets: '', reps: '', weight: '' }]
  });
  
  // Get workout stats
  const workoutStats = getWorkoutStats();
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return dateString;
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Handle new workout
  const handleNewWorkout = () => {
    setEditingWorkout(null);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      name: '',
      duration: '',
      notes: '',
      exercises: [{ name: '', sets: '', reps: '', weight: '' }]
    });
    setDialogOpen(true);
  };
  
  // Handle edit workout
  const handleEditWorkout = (workout: any) => {
    setEditingWorkout(workout);
    setFormData({
      date: workout.date,
      name: workout.name,
      duration: workout.duration.toString(),
      notes: workout.notes || '',
      exercises: workout.exercises.map((ex: any) => ({
        name: ex.name,
        sets: ex.sets.toString(),
        reps: ex.reps.toString(),
        weight: ex.weight.toString()
      }))
    });
    setDialogOpen(true);
  };
  
  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle exercise changes
  const handleExerciseChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedExercises = [...prev.exercises];
      updatedExercises[index] = { ...updatedExercises[index], [name]: value };
      return { ...prev, exercises: updatedExercises };
    });
  };
  
  // Add exercise
  const handleAddExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: '', sets: '', reps: '', weight: '' }]
    }));
  };
  
  // Remove exercise
  const handleRemoveExercise = (index: number) => {
    setFormData(prev => {
      const updatedExercises = [...prev.exercises];
      updatedExercises.splice(index, 1);
      return { ...prev, exercises: updatedExercises.length ? updatedExercises : [{ name: '', sets: '', reps: '', weight: '' }] };
    });
  };
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate at least one complete exercise
      const validExercises = formData.exercises.filter(ex => 
        ex.name && ex.sets && ex.reps && ex.weight
      );
      
      if (validExercises.length === 0) {
        toast.error("Please add at least one complete exercise");
        return;
      }
      
      const workoutData = {
        date: formData.date,
        name: formData.name,
        duration: parseInt(formData.duration) || 0,
        notes: formData.notes,
        exercises: validExercises.map(ex => ({
          id: Math.random().toString(36).substring(2, 9),
          name: ex.name,
          sets: parseInt(ex.sets) || 0,
          reps: parseInt(ex.reps) || 0,
          weight: parseFloat(ex.weight) || 0
        }))
      };
      
      if (editingWorkout) {
        updateWorkout({
          ...editingWorkout,
          ...workoutData
        });
        toast.success("Workout updated");
      } else {
        addWorkout(workoutData);
        toast.success("Workout added");
      }
      
      setDialogOpen(false);
    } catch (error) {
      toast.error("Error saving workout");
      console.error(error);
    }
  };
  
  // Handle delete workout
  const handleDeleteWorkout = (id: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      deleteWorkout(id);
      toast.success("Workout deleted");
    }
  };
  
  // Calculate volume for a workout
  const calculateVolume = (workout: any) => {
    return workout.exercises.reduce((total: number, ex: any) => {
      return total + (ex.sets * ex.reps * ex.weight);
    }, 0);
  };
  
  // Prepare data for volume chart
  const prepareVolumeData = () => {
    const last7Workouts = [...state.workouts]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7);
    
    return last7Workouts.map(workout => ({
      date: formatDate(workout.date),
      volume: calculateVolume(workout)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold neon-text-magenta mb-6">Gym Tracker</h1>
        <Button onClick={handleNewWorkout} className="bg-magenta hover:bg-magenta/80 text-navy">
          <Plus size={18} className="mr-1" /> New Workout
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Weekly Volume" variant="magenta">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{workoutStats.weeklyVolume.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">lbs (sets × reps × weight)</span>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Total Workouts" variant="cyan">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{state.workouts.length}</span>
            <span className="text-sm text-muted-foreground">sessions logged</span>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Last Workout" variant="magenta">
          {state.workouts.length > 0 ? (
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">
                {state.workouts[0].name}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatDate(state.workouts[0].date)}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <span>No workouts yet</span>
            </div>
          )}
        </DashboardCard>
      </div>
      
      {/* Volume Chart */}
      <DashboardCard title="Workout Volume History" variant="cyan">
        {state.workouts.length > 0 ? (
          <BarChart 
            data={prepareVolumeData()}
            dataKey="volume"
            xAxisDataKey="date"
            color="#00FFFF"
            formatYAxis={(value) => `${value / 1000}k`}
            formatTooltip={(value) => `${value.toLocaleString()} lbs`}
          />
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p>No workout data available. Add your first workout to start tracking.</p>
          </div>
        )}
      </DashboardCard>
      
      {/* Personal Records */}
      <DashboardCard title="Personal Records" variant="magenta">
        {Object.keys(workoutStats.personalRecords).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4">Exercise</th>
                  <th className="text-right py-2 px-4">Record</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(workoutStats.personalRecords).map(([exercise, record]) => (
                  <tr key={exercise} className="border-b border-border">
                    <td className="py-2 px-4">{exercise}</td>
                    <td className="py-2 px-4 text-right font-bold">{record} lbs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-muted-foreground">
            <p>No personal records yet. Log your first workout to see them here.</p>
          </div>
        )}
      </DashboardCard>
      
      {/* Recent Workouts */}
      <DashboardCard title="Recent Workouts" variant="cyan">
        {state.workouts.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">No workouts yet</p>
        ) : (
          <div className="space-y-6">
            {state.workouts
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map(workout => (
                <div key={workout.id} className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{workout.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(workout.date)} • {workout.duration} minutes
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditWorkout(workout)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteWorkout(workout.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-sm">
                          <th className="text-left py-1">Exercise</th>
                          <th className="text-right py-1">Sets</th>
                          <th className="text-right py-1">Reps</th>
                          <th className="text-right py-1">Weight</th>
                          <th className="text-right py-1">Volume</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workout.exercises.map((exercise: any) => (
                          <tr key={exercise.id} className="border-b border-border/50 text-sm">
                            <td className="py-1">{exercise.name}</td>
                            <td className="py-1 text-right">{exercise.sets}</td>
                            <td className="py-1 text-right">{exercise.reps}</td>
                            <td className="py-1 text-right">{exercise.weight} lbs</td>
                            <td className="py-1 text-right">
                              {(exercise.sets * exercise.reps * exercise.weight).toLocaleString()} lbs
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {workout.notes && (
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground font-medium">Notes:</span> {workout.notes}
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        )}
      </DashboardCard>
      
      {/* Workout Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingWorkout ? 'Edit Workout' : 'Add New Workout'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Workout Name</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Upper Body, Leg Day"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                placeholder="60"
                required
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Exercises</label>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddExercise}
                  className="bg-magenta hover:bg-magenta/80 text-navy text-xs"
                >
                  <Plus size={14} className="mr-1" /> Add Exercise
                </Button>
              </div>
              
              {formData.exercises.map((exercise, index) => (
                <div 
                  key={index} 
                  className="grid grid-cols-4 gap-2 items-center border border-border rounded-lg p-3 bg-muted/30"
                >
                  <div className="col-span-4 md:col-span-1">
                    <Input
                      name="name"
                      value={exercise.name}
                      onChange={(e) => handleExerciseChange(index, e)}
                      placeholder="Exercise name"
                    />
                  </div>
                  
                  <div className="flex space-x-2 col-span-3 md:col-span-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        name="sets"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, e)}
                        placeholder="Sets"
                        min="1"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        name="reps"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, e)}
                        placeholder="Reps"
                        min="1"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        name="weight"
                        value={exercise.weight}
                        onChange={(e) => handleExerciseChange(index, e)}
                        placeholder="Weight"
                        min="0"
                        step="0.5"
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-1 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExercise(index)}
                      disabled={formData.exercises.length === 1}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes (optional)</label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any notes about your workout"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-magenta text-navy hover:bg-magenta/80">
                {editingWorkout ? 'Update' : 'Add'} Workout
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GymPage;
