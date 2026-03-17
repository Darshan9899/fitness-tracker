import React, { useState } from 'react';
import { Calendar, Activity, Dumbbell, Flame, Plus, Zap } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWorkout } from '../contexts/WorkoutContext';
import { useUser } from '../contexts/UserContext';
import { getTodayFormatted, getWeekDates, formatDate } from '../utils/dateUtils';
import { calculateBMI, getBMICategory, calculateDailyCalories } from '../utils/calculations';

const Dashboard: React.FC = () => {
  const { workouts, getCaloriesBurnedByDay, getCaloriesBurnedByWeek } = useWorkout();
  const { user } = useUser();
  const [selectedDate] = useState(getTodayFormatted());
  const weekDates = getWeekDates(selectedDate);
  
  // Calculate stats
  const todayCalories = getCaloriesBurnedByDay(selectedDate);
  const weeklyCalories = getCaloriesBurnedByWeek(weekDates[0], weekDates[6]);
  const workoutCount = workouts.length;
  const recentWorkouts = workouts.slice(0, 3);
  
  // Calculate BMI if user data is available
  const bmi = user ? calculateBMI(user.height, user.weight) : 0;
  const bmiCategory = getBMICategory(bmi);
  
  // Calculate daily calorie needs
  const dailyCalorieNeeds = user ? calculateDailyCalories(user) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {formatDate(selectedDate)}
          </p>
        </div>
        <Button 
          variant="primary" 
          size="md" 
          className="mt-4 md:mt-0"
          onClick={() => {/* Navigate to workout page */}}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Workout
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-30">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-white text-opacity-90">Calories Today</h3>
              <p className="text-2xl font-semibold">{todayCalories}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-30">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-white text-opacity-90">Week Total</h3>
              <p className="text-2xl font-semibold">{weeklyCalories}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-30">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-white text-opacity-90">Workouts</h3>
              <p className="text-2xl font-semibold">{workoutCount}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-30">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-white text-opacity-90">Daily Goal</h3>
              <p className="text-2xl font-semibold">{Math.round(todayCalories / dailyCalorieNeeds * 100)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Workouts */}
        <div className="lg:col-span-2">
          <Card title="Recent Workouts">
            {recentWorkouts.length > 0 ? (
              <div className="space-y-4">
                {recentWorkouts.map((workout) => (
                  <div 
                    key={workout.id} 
                    className="flex items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150 cursor-pointer"
                  >
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                      <Activity className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{workout.name}</h4>
                      <div className="flex flex-wrap text-sm text-gray-500 dark:text-gray-400 gap-x-4">
                        <span>{formatDate(workout.date)}</span>
                        <span>{workout.duration} min</span>
                        <span>{workout.caloriesBurned} cal</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Dumbbell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No workouts yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {/* Navigate to workout page */}}
                >
                  Add Your First Workout
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* User Stats */}
        <div>
          <Card title="Your Stats">
            {user ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">BMI</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{bmi.toFixed(1)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${Math.min(bmi / 30 * 100, 100)}%`,
                        backgroundColor: 
                          bmiCategory === 'Underweight' ? '#FBBF24' : 
                          bmiCategory === 'Normal weight' ? '#10B981' : 
                          bmiCategory === 'Overweight' ? '#F97316' : 
                          '#EF4444' 
                      }}
                    />
                  </div>
                  <div className="text-xs text-right text-gray-500 dark:text-gray-400">
                    {bmiCategory}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Daily Calorie Needs</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{dailyCalorieNeeds} cal</span>
                  </div>
                  <div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Current Weight</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.weight} kg</div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Height</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.height} cm</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => {/* Navigate to profile page */}}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">Complete your profile to see stats</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {/* Navigate to profile page */}}
                >
                  Set Up Profile
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;