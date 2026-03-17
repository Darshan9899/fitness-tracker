import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, BodyMeasurement } from '../types/user';

interface UserContextType {
  user: User | null;
  updateUser: (user: User) => void;
  addMeasurement: (measurement: BodyMeasurement) => void;
  measurements: BodyMeasurement[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Default user data
const defaultUser: User = {
  id: '1',
  name: 'John Doe',
  age: 30,
  gender: 'male',
  height: 175, // in cm
  weight: 75, // in kg
  goal: 'Build muscle',
  activityLevel: 'moderate',
};

// Default measurements
const defaultMeasurements: BodyMeasurement[] = [
  {
    id: '1',
    date: new Date().toISOString(),
    weight: 75,
    chest: 100,
    waist: 80,
    hips: 95,
    biceps: 35,
    thigh: 55,
  },
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedMeasurements = localStorage.getItem('measurements');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Set default user if none exists
      setUser(defaultUser);
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }

    if (storedMeasurements) {
      setMeasurements(JSON.parse(storedMeasurements));
    } else {
      // Set default measurements if none exist
      setMeasurements(defaultMeasurements);
      localStorage.setItem('measurements', JSON.stringify(defaultMeasurements));
    }
  }, []);

  // Update user data
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Add new body measurement
  const addMeasurement = (measurement: BodyMeasurement) => {
    const newMeasurements = [measurement, ...measurements];
    setMeasurements(newMeasurements);
    localStorage.setItem('measurements', JSON.stringify(newMeasurements));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, measurements, addMeasurement }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}