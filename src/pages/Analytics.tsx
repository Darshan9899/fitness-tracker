import React, { useState } from 'react';
import { BarChart, Calendar, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWorkout } from '../contexts/WorkoutContext';
import { 
  getTodayFormatted, 
  getWeekDates,
  getStartOfWeek,
  getEndOfWeek,
  formatDateYYYYMMDD,
  getMonthName,
  getShortDayName
} from '../utils/dateUtils';

const Analytics: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayFormatted());
  const { workouts, getCaloriesBurnedByDay } = useWorkout();
  
  // Get week dates for display
  const weekDates = getWeekDates(selectedDate);
  
  // Get start and end of week
  const startOfWeek = getStartOfWeek(selectedDate);
  const endOfWeek = getEndOfWeek(selectedDate);
  
  // Calculate calories burned for each day of the week
  const weeklyCaloriesData = weekDates.map((date) => ({
    date,
    day: getShortDayName(date),
    calories: getCaloriesBurnedByDay(date),
  }));
  
  // Find max calories for scaling
  const maxCalories = Math.max(...weeklyCaloriesData.map(d => d.calories), 500);
  
  // Navigate to previous/next week
  const goToPreviousWeek = () => {
    const prevWeek = new Date(startOfWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setSelectedDate(formatDateYYYYMMDD(prevWeek));
  };
  
  const goToNextWeek = () => {
    const nextWeek = new Date(startOfWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setSelectedDate(formatDateYYYYMMDD(nextWeek));
  };
  
  // Go to today
  const goToToday = () => {
    setSelectedDate(getTodayFormatted());
  };
  
  // Calculate total calories burned and workouts for the week
  const totalWeeklyCalories = weeklyCaloriesData.reduce((sum, day) => sum + day.calories, 0);
  const weeklyWorkouts = workouts.filter(workout => 
    weekDates.includes(workout.date)
  );
  
  // Get workout types and count
  const workoutTypes = weeklyWorkouts.reduce((acc, workout) => {
    workout.exercises.forEach(exercise => {
      const muscleGroup = exercise.muscleGroup;
      acc[muscleGroup] = (acc[muscleGroup] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  // Sort workout types by count
  const sortedWorkoutTypes = Object.entries(workoutTypes)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your progress and performance
          </p>
        </div>
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={goToToday}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<ChevronLeft className="h-4 w-4" />}
            onClick={goToPreviousWeek}
            aria-label="Previous week"
          />
          <Button
            variant="outline"
            size="sm"
            icon={<ChevronRight className="h-4 w-4" />}
            onClick={goToNextWeek}
            aria-label="Next week"
          />
        </div>
      </div>

      {/* Weekly Summary */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {getMonthName(formatDateYYYYMMDD(startOfWeek))} 
            {getMonthName(formatDateYYYYMMDD(startOfWeek)) !== getMonthName(formatDateYYYYMMDD(endOfWeek)) 
              ? ` - ${getMonthName(formatDateYYYYMMDD(endOfWeek))}` 
              : ''} 
            {startOfWeek.getFullYear()}
          </h2>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatDateYYYYMMDD(startOfWeek)} - {formatDateYYYYMMDD(endOfWeek)}
            </span>
          </div>
        </div>

        {/* Weekly Calories Chart */}
        <div className="h-64">
          <div className="flex h-full items-end">
            {weeklyCaloriesData.map((day) => (
              <div 
                key={day.date} 
                className="flex-1 flex flex-col items-center justify-end h-full"
              >
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {day.calories > 0 ? day.calories : ''}
                </div>
                <div 
                  className="w-4/5 bg-blue-500 dark:bg-blue-600 rounded-t"
                  style={{ 
                    height: `${day.calories > 0 ? (day.calories / maxCalories) * 100 : 0}%`,
                    minHeight: day.calories > 0 ? '4px' : '0'
                  }}
                />
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-2">
                  {day.day}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <div className="text-center p-4">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {totalWeeklyCalories}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Calories Burned
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center p-4">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <BarChart className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {Math.round(totalWeeklyCalories / 7)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Daily Average
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center p-4">
            <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {weeklyWorkouts.length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Workouts Completed
            </p>
          </div>
        </Card>
      </div>

      {/* Additional Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Top Muscle Groups">
          {sortedWorkoutTypes.length > 0 ? (
            <div className="space-y-4">
              {sortedWorkoutTypes.map(([muscleGroup, count]) => (
                <div key={muscleGroup} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-gray-700 dark:text-gray-300">{muscleGroup}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{count} exercises</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 dark:bg-blue-600 rounded-full"
                      style={{ 
                        width: `${(count / Math.max(...sortedWorkoutTypes.map(([, c]) => c))) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500 dark:text-gray-400">
              No workout data available for this week
            </div>
          )}
        </Card>

        <Card title="Progress Insights">
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Weekly Trend</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {totalWeeklyCalories > 2000 
                  ? "Great job! You're burning calories consistently this week."
                  : "Keep pushing! Add more workouts to increase your calorie burn."}
              </p>
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">Exercise Balance</h4>
              <p className="text-sm text-green-600 dark:text-green-400">
                {sortedWorkoutTypes.length >= 3
                  ? "You have a good balance of different muscle groups in your workouts."
                  : "Try to incorporate more variety in your workouts for balanced training."}
              </p>
            </div>
            
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-1">Next Steps</h4>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Consider adding {
                  sortedWorkoutTypes.length > 0 
                    ? `more ${
                        ['legs', 'chest', 'back', 'arms', 'shoulders']
                          .filter(group => !sortedWorkoutTypes.some(([name]) => name === group))[0] || 'cardio'
                      } exercises` 
                    : "strength training"
                } to your upcoming workouts.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;