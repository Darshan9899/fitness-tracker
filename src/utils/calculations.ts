import { Workout } from '../types/workout';
import { User } from '../types/user';

// Calculate calories burned during a workout
export function calculateCaloriesBurned(workout: Workout, user: User): number {
  // Base metabolic rate (BMR) using Harris-Benedict Equation
  let bmr: number;
  if (user.gender === 'male') {
    bmr = 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age);
  } else {
    bmr = 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
  }
  
  // Calories burned per minute at rest (BMR divided by minutes in a day)
  const caloriesPerMinuteRest = bmr / 1440;
  
  // MET values for different exercise intensities
  // MET = Metabolic Equivalent of Task, 1 MET = resting metabolic rate
  const getMET = (exercise: string, weight: number): number => {
    const muscleGroup = exercise.toLowerCase();
    
    // Weight categories for resistance training
    const isLightWeight = weight < 5;
    const isModerateWeight = weight >= 5 && weight < 15;
    const isHeavyWeight = weight >= 15;
    
    // MET values based on exercise and intensity
    if (muscleGroup.includes('cardio') || muscleGroup.includes('run')) {
      return 8.0; // Running/jogging
    } else if (muscleGroup.includes('cycle') || muscleGroup.includes('bike')) {
      return 7.5; // Cycling
    } else if (muscleGroup.includes('swim')) {
      return 7.0; // Swimming
    } else if (isHeavyWeight) {
      return 6.0; // Heavy resistance training
    } else if (isModerateWeight) {
      return 5.0; // Moderate resistance training
    } else {
      return 3.5; // Light resistance training or calisthenics
    }
  };
  
  // Calculate calories for each exercise
  let totalCalories = 0;
  
  // For each exercise, calculate calories burned
  workout.exercises.forEach(exercise => {
    const met = getMET(exercise.muscleGroup, exercise.weight);
    
    // Estimate exercise duration based on sets and reps if not provided
    const exerciseDuration = exercise.duration || (exercise.sets * exercise.reps * 0.5);
    
    // Calories = MET * weight in kg * duration in hours
    const caloriesBurned = met * user.weight * (exerciseDuration / 60);
    totalCalories += caloriesBurned;
  });
  
  // Add calories burned at rest during workout if not accounted for
  if (workout.exercises.length === 0 || !workout.exercises.some(e => e.duration)) {
    totalCalories += caloriesPerMinuteRest * workout.duration;
  }
  
  // Apply activity level multiplier for more accurate calculations
  const activityMultiplier = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very active': 1.9
  }[user.activityLevel] || 1.55;
  
  // Apply multiplier but scale it down since we're only looking at a workout period
  const adjustedMultiplier = 1 + ((activityMultiplier - 1) * 0.5);
  totalCalories *= adjustedMultiplier;
  
  return Math.round(totalCalories);
}

// Calculate BMI
export function calculateBMI(height: number, weight: number): number {
  // Height in meters (convert from cm)
  const heightInMeters = height / 100;
  // BMI formula: weight (kg) / (height (m))^2
  return weight / (heightInMeters * heightInMeters);
}

// Get BMI category
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 24.9) return 'Normal weight';
  if (bmi < 29.9) return 'Overweight';
  return 'Obese';
}

// Calculate daily caloric needs
export function calculateDailyCalories(user: User): number {
  // Calculate BMR
  let bmr: number;
  if (user.gender === 'male') {
    bmr = 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age);
  } else {
    bmr = 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
  }
  
  // Apply activity multiplier
  const activityMultipliers = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Light exercise 1-3 days/week
    moderate: 1.55, // Moderate exercise 3-5 days/week
    active: 1.725, // Hard exercise 6-7 days/week
    'very active': 1.9 // Very hard exercise & physical job or training twice a day
  };
  
  const multiplier = activityMultipliers[user.activityLevel] || 1.55;
  let calorieNeeds = bmr * multiplier;
  
  // Adjust based on goal
  if (user.goal === 'Lose weight') {
    calorieNeeds *= 0.85; // 15% deficit
  } else if (user.goal === 'Build muscle') {
    calorieNeeds *= 1.15; // 15% surplus
  }
  
  return Math.round(calorieNeeds);
}