import React, { useState } from 'react';
import { Plus, Filter, Search, Dumbbell, X, Calendar, Clock, Zap } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useWorkout } from '../contexts/WorkoutContext';
import { formatDate } from '../utils/dateUtils';
import WorkoutForm from '../components/workout/WorkoutForm';

const Workouts: React.FC = () => {
  const { workouts, deleteWorkout } = useWorkout();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  
  // Filter workouts based on search query
  const filteredWorkouts = workouts.filter(workout => 
    workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.exercises.some(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddWorkout = () => {
    setSelectedWorkout(null);
    setShowForm(true);
  };

  const handleEditWorkout = (id: string) => {
    setSelectedWorkout(id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workouts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track your workout history
          </p>
        </div>
        <Button 
          variant="primary" 
          size="md" 
          className="mt-4 md:mt-0"
          onClick={handleAddWorkout}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Workout
        </Button>
      </div>

      {showForm ? (
        <WorkoutForm 
          workoutId={selectedWorkout} 
          onClose={() => setShowForm(false)} 
        />
      ) : (
        <>
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search workouts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                leftIcon={<Search className="h-4 w-4" />}
                rightIcon={
                  searchQuery ? (
                    <button onClick={() => setSearchQuery('')}>
                      <X className="h-4 w-4" />
                    </button>
                  ) : null
                }
              />
            </div>
            <Button
              variant="outline"
              icon={<Filter className="h-4 w-4" />}
            >
              Filter
            </Button>
          </div>

          {/* Workout List */}
          <div className="space-y-4">
            {filteredWorkouts.length > 0 ? (
              filteredWorkouts.map(workout => (
                <Card 
                  key={workout.id} 
                  className="hover:shadow-md transition-shadow duration-200"
                  onClick={() => handleEditWorkout(workout.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{workout.name}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(workout.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {workout.duration} min
                        </div>
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 mr-1" />
                          {workout.caloriesBurned} cal
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        {workout.exercises.map(exercise => (
                          <span 
                            key={exercise.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          >
                            <Dumbbell className="h-3 w-3 mr-1" />
                            {exercise.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-4 sm:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditWorkout(workout.id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteWorkout(workout.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Dumbbell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No workouts found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Start by adding your first workout'}
                </p>
                {!searchQuery && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddWorkout}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Add Your First Workout
                  </Button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Workouts;