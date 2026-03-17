import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWorkout } from '../contexts/WorkoutContext';
import { 
  getWeekDates, 
  getShortDayName, 
  formatDateYYYYMMDD, 
  isToday,
  getMonthName,
  getStartOfWeek,
  getEndOfWeek
} from '../utils/dateUtils';

const Planner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(formatDateYYYYMMDD(new Date()));
  const { workouts, getWorkoutsByDate } = useWorkout();
  
  // Get week dates
  const weekDates = getWeekDates(selectedDate);
  
  // Get start and end of week for display
  const startOfWeek = getStartOfWeek(selectedDate);
  const endOfWeek = getEndOfWeek(selectedDate);
  
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
    setSelectedDate(formatDateYYYYMMDD(new Date()));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Planner</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Plan and schedule your workouts
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

      {/* Calendar Header */}
      <Card className="overflow-visible">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {getMonthName(formatDateYYYYMMDD(startOfWeek))} 
            {getMonthName(formatDateYYYYMMDD(startOfWeek)) !== getMonthName(formatDateYYYYMMDD(endOfWeek)) 
              ? ` - ${getMonthName(formatDateYYYYMMDD(endOfWeek))}` 
              : ''} 
            {startOfWeek.getFullYear()}
          </h2>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
          >
            Add Plan
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4">
          {/* Day headers */}
          {weekDates.map((date, index) => (
            <div 
              key={`header-${date}`} 
              className="text-center text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {getShortDayName(date)}
            </div>
          ))}
          
          {/* Day cells */}
          {weekDates.map((date) => {
            const dayWorkouts = getWorkoutsByDate(date);
            const isCurrentDay = isToday(date);
            
            return (
              <div 
                key={`cell-${date}`}
                className={`
                  border rounded-lg min-h-[120px] p-2
                  ${isCurrentDay ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}
                `}
              >
                <div className="text-right mb-2">
                  <span 
                    className={`
                      inline-block rounded-full w-7 h-7 leading-7 text-center text-sm
                      ${isCurrentDay ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400'}
                    `}
                  >
                    {new Date(date).getDate()}
                  </span>
                </div>
                
                <div className="space-y-1">
                  {dayWorkouts.length > 0 ? (
                    dayWorkouts.map((workout) => (
                      <div 
                        key={workout.id}
                        className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 truncate cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                      >
                        {workout.name}
                      </div>
                    ))
                  ) : (
                    <div className="h-2"></div>
                  )}
                  
                  <button 
                    className="w-full text-center text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mt-2"
                  >
                    <span className="flex items-center justify-center">
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Upcoming Workouts */}
      <Card title="Upcoming Workouts">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {workouts.length > 0 ? (
            workouts.slice(0, 3).map(workout => (
              <div key={workout.id} className="py-3 flex items-center">
                <div className="flex-shrink-0 mr-4">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                    <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {workout.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(workout.date).toLocaleDateString()} · {workout.duration} min
                  </p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-gray-500 dark:text-gray-400">
              No upcoming workouts scheduled
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Planner;