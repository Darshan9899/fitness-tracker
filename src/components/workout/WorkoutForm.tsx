import React, { useState, useEffect } from 'react';
import { PlusCircle, X, Save, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useWorkout } from '../../contexts/WorkoutContext';
import { getTodayFormatted } from '../../utils/dateUtils';
import { Exercise, Workout } from '../../types/workout';

interface WorkoutFormProps {
  workoutId: string | null;
  onClose: () => void;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ workoutId, onClose }) => {
  const { workouts, templates, addWorkout, updateWorkout } = useWorkout();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  
  const emptyExercise: Exercise = {
    id: '',
    name: '',
    muscleGroup: '',
    sets: 3,
    reps: 10,
    weight: 0,
  };
  
  const initialWorkout: Workout = {
    id: '',
    date: getTodayFormatted(),
    name: '',
    duration: 45,
    exercises: [],
    notes: '',
  };
  
  const [workout, setWorkout] = useState<Workout>(initialWorkout);
  
  // Find existing workout if editing
  useEffect(() => {
    if (workoutId) {
      const existingWorkout = workouts.find(w => w.id === workoutId);
      if (existingWorkout) {
        setWorkout(existingWorkout);
        
        // Set all exercises to expanded
        const expandedState = existingWorkout.exercises.reduce((acc, exercise) => {
          acc[exercise.id] = true;
          return acc;
        }, {} as Record<string, boolean>);
        
        setExpanded(expandedState);
      }
    }
  }, [workoutId, workouts]);
  
  // Load template
  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // Generate new IDs for exercises
      const exercises = template.exercises.map(ex => ({
        ...ex,
        id: Math.random().toString(36).substring(2, 9)
      }));
      
      setWorkout({
        ...workout,
        name: template.name,
        exercises
      });
      
      // Set all exercises to expanded
      const expandedState = exercises.reduce((acc, exercise) => {
        acc[exercise.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      
      setExpanded(expandedState);
    }
  };
  
  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setWorkout({
      ...workout,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };
  
  // Add exercise
  const addExercise = () => {
    const newExercise = {
      ...emptyExercise,
      id: Math.random().toString(36).substring(2, 9)
    };
    
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, newExercise]
    });
    
    // Expand the new exercise
    setExpanded({
      ...expanded,
      [newExercise.id]: true
    });
  };
  
  // Update exercise
  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    setWorkout({
      ...workout,
      exercises: workout.exercises.map(ex => 
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    });
  };
  
  // Remove exercise
  const removeExercise = (id: string) => {
    setWorkout({
      ...workout,
      exercises: workout.exercises.filter(ex => ex.id !== id)
    });
    
    // Remove from expanded state
    const newExpanded = { ...expanded };
    delete newExpanded[id];
    setExpanded(newExpanded);
  };
  
  // Toggle exercise expanded state
  const toggleExercise = (id: string) => {
    setExpanded({
      ...expanded,
      [id]: !expanded[id]
    });
  };
  
  // Save workout
  const handleSave = () => {
    // Add missing fields
    const workoutToSave: Workout = {
      ...workout,
      id: workout.id || Math.random().toString(36).substring(2, 9)
    };
    
    if (workoutId) {
      updateWorkout(workoutId, workoutToSave);
    } else {
      addWorkout(workoutToSave);
    }
    
    onClose();
  };
  
  // Common muscle groups
  const muscleGroups = [
    { value: 'chest', label: 'Chest' },
    { value: 'back', label: 'Back' },
    { value: 'legs', label: 'Legs' },
    { value: 'shoulders', label: 'Shoulders' },
    { value: 'arms', label: 'Arms' },
    { value: 'abs', label: 'Abs' },
    { value: 'cardio', label: 'Cardio' },
  ];

  return (
    <Card title={workoutId ? 'Edit Workout' : 'Add New Workout'}>
      <div className="space-y-6">
        {/* Basic Workout Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Workout Name"
            name="name"
            value={workout.name}
            onChange={handleInputChange}
            placeholder="e.g., Morning Workout"
            fullWidth
          />
          
          <Input
            label="Date"
            name="date"
            type="date"
            value={workout.date}
            onChange={handleInputChange}
            fullWidth
          />
          
          <Input
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={workout.duration}
            onChange={handleInputChange}
            fullWidth
          />
          
          {/* Template selector */}
          {!workoutId && templates.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Load Template
              </label>
              <Select
                options={[
                  { value: '', label: 'Select a template...' },
                  ...templates.map(t => ({ value: t.id, label: t.name }))
                ]}
                onChange={(e) => e.target.value && loadTemplate(e.target.value)}
                value=""
                fullWidth
              />
            </div>
          )}
        </div>
        
        {/* Exercises */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Exercises</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={addExercise}
              icon={<PlusCircle className="h-4 w-4" />}
            >
              Add Exercise
            </Button>
          </div>
          
          {workout.exercises.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="text-gray-500 dark:text-gray-400 mb-2">No exercises added yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={addExercise}
                icon={<PlusCircle className="h-4 w-4" />}
              >
                Add First Exercise
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {workout.exercises.map((exercise, index) => (
                <div 
                  key={exercise.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <div 
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 cursor-pointer"
                    onClick={() => toggleExercise(exercise.id)}
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm mr-3">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {exercise.name || 'New Exercise'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <button 
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExercise(exercise.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {expanded[exercise.id] ? (
                        <ChevronUp className="h-5 w-5 ml-2 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 ml-2 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {expanded[exercise.id] && (
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Exercise Name"
                          value={exercise.name}
                          onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                          placeholder="e.g., Bench Press"
                          fullWidth
                        />
                        
                        <Select
                          label="Muscle Group"
                          value={exercise.muscleGroup}
                          onChange={(e) => updateExercise(exercise.id, 'muscleGroup', e.target.value)}
                          options={muscleGroups}
                          fullWidth
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          label="Sets"
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value))}
                          fullWidth
                        />
                        
                        <Input
                          label="Reps"
                          type="number"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(exercise.id, 'reps', parseInt(e.target.value))}
                          fullWidth
                        />
                        
                        <Input
                          label="Weight (kg)"
                          type="number"
                          value={exercise.weight}
                          onChange={(e) => updateExercise(exercise.id, 'weight', parseFloat(e.target.value))}
                          fullWidth
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={workout.notes || ''}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Add any notes about this workout..."
          />
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            icon={<X className="h-4 w-4" />}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            icon={<Save className="h-4 w-4" />}
          >
            {workoutId ? 'Update Workout' : 'Save Workout'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default WorkoutForm;