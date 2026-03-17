import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Workout, Exercise, WorkoutTemplate } from '../types/workout';
import { calculateCaloriesBurned } from '../utils/calculations';
import { useUser } from './UserContext';

interface WorkoutContextType {
  workouts: Workout[];
  templates: WorkoutTemplate[];
  addWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  updateWorkout: (id: string, workout: Workout) => void;
  addTemplate: (template: WorkoutTemplate) => void;
  deleteTemplate: (id: string) => void;
  getWorkoutsByDate: (date: string) => Workout[];
  getCaloriesBurnedByDay: (date: string) => number;
  getCaloriesBurnedByWeek: (startDate: string, endDate: string) => number;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Default workout templates
const defaultTemplates: WorkoutTemplate[] = [
  {
    id: '1',
    name: 'Full Body Workout',
    exercises: [
      { id: '1', name: 'Squats', muscleGroup: 'legs', sets: 3, reps: 12, weight: 50 },
      { id: '2', name: 'Bench Press', muscleGroup: 'chest', sets: 3, reps: 10, weight: 60 },
      { id: '3', name: 'Deadlifts', muscleGroup: 'back', sets: 3, reps: 8, weight: 80 },
    ],
  },
  {
    id: '2',
    name: 'Upper Body',
    exercises: [
      { id: '1', name: 'Push-ups', muscleGroup: 'chest', sets: 3, reps: 15, weight: 0 },
      { id: '2', name: 'Pull-ups', muscleGroup: 'back', sets: 3, reps: 8, weight: 0 },
      { id: '3', name: 'Shoulder Press', muscleGroup: 'shoulders', sets: 3, reps: 12, weight: 15 },
    ],
  },
];

// Default workouts
const defaultWorkouts: Workout[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    name: 'Morning Workout',
    duration: 60, // minutes
    exercises: [
      { id: '1', name: 'Squats', muscleGroup: 'legs', sets: 3, reps: 12, weight: 50 },
      { id: '2', name: 'Bench Press', muscleGroup: 'chest', sets: 3, reps: 10, weight: 60 },
    ],
    caloriesBurned: 350,
  },
];

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const { user } = useUser();

  // Load workouts and templates from localStorage on initial render
  useEffect(() => {
    const storedWorkouts = localStorage.getItem('workouts');
    const storedTemplates = localStorage.getItem('templates');
    
    if (storedWorkouts) {
      setWorkouts(JSON.parse(storedWorkouts));
    } else {
      setWorkouts(defaultWorkouts);
      localStorage.setItem('workouts', JSON.stringify(defaultWorkouts));
    }

    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates));
    } else {
      setTemplates(defaultTemplates);
      localStorage.setItem('templates', JSON.stringify(defaultTemplates));
    }
  }, []);

  // Add a new workout
  const addWorkout = (workout: Workout) => {
    // Calculate calories burned if not provided
    if (!workout.caloriesBurned && user) {
      workout.caloriesBurned = calculateCaloriesBurned(workout, user);
    }
    
    const newWorkouts = [workout, ...workouts];
    setWorkouts(newWorkouts);
    localStorage.setItem('workouts', JSON.stringify(newWorkouts));
  };

  // Delete a workout
  const deleteWorkout = (id: string) => {
    const newWorkouts = workouts.filter(workout => workout.id !== id);
    setWorkouts(newWorkouts);
    localStorage.setItem('workouts', JSON.stringify(newWorkouts));
  };

  // Update a workout
  const updateWorkout = (id: string, updatedWorkout: Workout) => {
    // Calculate calories burned if necessary
    if (!updatedWorkout.caloriesBurned && user) {
      updatedWorkout.caloriesBurned = calculateCaloriesBurned(updatedWorkout, user);
    }
    
    const newWorkouts = workouts.map(workout => 
      workout.id === id ? updatedWorkout : workout
    );
    setWorkouts(newWorkouts);
    localStorage.setItem('workouts', JSON.stringify(newWorkouts));
  };

  // Add a new template
  const addTemplate = (template: WorkoutTemplate) => {
    const newTemplates = [template, ...templates];
    setTemplates(newTemplates);
    localStorage.setItem('templates', JSON.stringify(newTemplates));
  };

  // Delete a template
  const deleteTemplate = (id: string) => {
    const newTemplates = templates.filter(template => template.id !== id);
    setTemplates(newTemplates);
    localStorage.setItem('templates', JSON.stringify(newTemplates));
  };

  // Get workouts by date
  const getWorkoutsByDate = (date: string) => {
    return workouts.filter(workout => workout.date === date);
  };

  // Get calories burned for a specific day
  const getCaloriesBurnedByDay = (date: string) => {
    const dayWorkouts = workouts.filter(workout => workout.date === date);
    return dayWorkouts.reduce((total, workout) => total + (workout.caloriesBurned || 0), 0);
  };

  // Get calories burned for a week
  const getCaloriesBurnedByWeek = (startDate: string, endDate: string) => {
    // Convert dates to timestamps for comparison
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    const weekWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.date).getTime();
      return workoutDate >= start && workoutDate <= end;
    });
    
    return weekWorkouts.reduce((total, workout) => total + (workout.caloriesBurned || 0), 0);
  };

  return (
    <WorkoutContext.Provider 
      value={{ 
        workouts, 
        templates, 
        addWorkout, 
        deleteWorkout, 
        updateWorkout, 
        addTemplate, 
        deleteTemplate,
        getWorkoutsByDate,
        getCaloriesBurnedByDay,
        getCaloriesBurnedByWeek
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}