export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weight: number; // in kg
  duration?: number; // in minutes (for cardio exercises)
}

export interface Workout {
  id: string;
  date: string;
  name: string;
  duration: number; // in minutes
  exercises: Exercise[];
  notes?: string;
  caloriesBurned?: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
  description?: string;
}

export interface PlannedWorkout extends Workout {
  completed: boolean;
}