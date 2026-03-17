export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  goal: 'Lose weight' | 'Maintain weight' | 'Build muscle' | 'Improve fitness' | string;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active';
}

export interface BodyMeasurement {
  id: string;
  date: string;
  weight: number; // in kg
  chest?: number; // in cm
  waist?: number; // in cm
  hips?: number; // in cm
  biceps?: number; // in cm
  thigh?: number; // in cm
}