
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import DashboardCard from '@/components/DashboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Smile, Meh, Frown, Tag } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { toast } from 'sonner';

const ExperiencesPage = () => {
  const { state, addExperience, updateExperience, deleteExperience } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    mood: 'happy',
    tags: ''
  });
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle mood selection
  const handleMoodSelect = (mood: 'happy' | 'neutral' | 'sad') => {
    setFormData(prev => ({ ...prev, mood }));
  };
  
  // Open dialog for new experience
  const handleNewExperience = () => {
    setEditingExperience(null);
    setFormData({
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      mood: 'happy',
      tags: ''
    });
    setDialogOpen(true);
  };
  
  // Open dialog for editing experience
  const handleEditExperience = (experience: any) => {
    setEditingExperience(experience);
    setFormData({
      title: experience.title,
      description: experience.description,
      date: experience.date,
      mood: experience.mood,
      tags: experience.tags.join(', ')
    });
    setDialogOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process tags from comma-separated string to array
    const tagArray = formData.tags
      ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      : [];
    
    try {
      if (editingExperience) {
        updateExperience({
          ...editingExperience,
          title: formData.title,
          description: formData.description,
          date: formData.date,
          mood: formData.mood as 'happy' | 'neutral' | 'sad',
          tags: tagArray
        });
        toast.success("Experience updated successfully");
      } else {
        addExperience({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          mood: formData.mood as 'happy' | 'neutral' | 'sad',
          tags: tagArray
        });
        toast.success("Experience added successfully");
      }
      
      setDialogOpen(false);
    } catch (error) {
      toast.error("Error saving experience");
      console.error(error);
    }
  };
  
  // Handle delete
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      deleteExperience(id);
      toast.success("Experience deleted");
    }
  };
  
  // Render mood icon
  const renderMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy':
        return <Smile className="text-green-400" size={20} />;
      case 'neutral':
        return <Meh className="text-yellow-400" size={20} />;
      case 'sad':
        return <Frown className="text-red-400" size={20} />;
      default:
        return null;
    }
  };
  
  // Format display date
  const formatDisplayDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return dateString;
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold neon-text-cyan mb-6">Experiences</h1>
        <Button onClick={handleNewExperience} className="bg-cyan hover:bg-cyan/80 text-navy">
          <Plus size={18} className="mr-1" /> New Experience
        </Button>
      </div>
      
      {/* Experiences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.experiences.length === 0 ? (
          <DashboardCard title="No Experiences Yet" variant="cyan">
            <p className="text-muted-foreground text-center py-8">
              Add your first experience to get started!
            </p>
          </DashboardCard>
        ) : (
          state.experiences.map(experience => (
            <DashboardCard 
              key={experience.id}
              title={experience.title}
              variant="cyan"
              actions={
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditExperience(experience)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(experience.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              }
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-muted-foreground text-sm">
                  <span>{formatDisplayDate(experience.date)}</span>
                  <div>{renderMoodIcon(experience.mood)}</div>
                </div>
                
                <p className="text-sm">{experience.description}</p>
                
                {experience.tags && experience.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {experience.tags.map((tag: string) => (
                      <div key={tag} className="flex items-center bg-muted/50 text-foreground text-xs px-2 py-1 rounded">
                        <Tag size={12} className="mr-1" /> {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DashboardCard>
          ))
        )}
      </div>
      
      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? 'Edit Experience' : 'Add New Experience'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Experience Title"
                required
              />
            </div>
            
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
              <label className="text-sm font-medium">Mood</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className={`p-2 rounded-full ${formData.mood === 'happy' ? 'bg-muted ring-2 ring-cyan' : 'bg-background'}`}
                  onClick={() => handleMoodSelect('happy')}
                >
                  <Smile size={24} className="text-green-400" />
                </button>
                <button
                  type="button"
                  className={`p-2 rounded-full ${formData.mood === 'neutral' ? 'bg-muted ring-2 ring-cyan' : 'bg-background'}`}
                  onClick={() => handleMoodSelect('neutral')}
                >
                  <Meh size={24} className="text-yellow-400" />
                </button>
                <button
                  type="button"
                  className={`p-2 rounded-full ${formData.mood === 'sad' ? 'bg-muted ring-2 ring-cyan' : 'bg-background'}`}
                  onClick={() => handleMoodSelect('sad')}
                >
                  <Frown size={24} className="text-red-400" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write about your experience..."
                rows={4}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags (comma separated)
              </label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="work, hobby, travel"
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
              <Button type="submit" className="bg-cyan text-navy hover:bg-cyan/80">
                {editingExperience ? 'Update' : 'Add'} Experience
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExperiencesPage;
