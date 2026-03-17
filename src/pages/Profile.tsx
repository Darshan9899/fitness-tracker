import React, { useState } from 'react';
import { SaveIcon, User, Calendar, Ruler, Dumbbell, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useUser } from '../contexts/UserContext';
import { calculateBMI, getBMICategory, calculateDailyCalories } from '../utils/calculations';

const Profile: React.FC = () => {
  const { user, updateUser, measurements, addMeasurement } = useUser();
  
  const [formData, setFormData] = useState(user || {
    id: '1',
    name: '',
    age: 30,
    gender: 'male',
    height: 175,
    weight: 75,
    goal: 'Build muscle',
    activityLevel: 'moderate',
  });
  
  const [measurementForm, setMeasurementForm] = useState({
    weight: user?.weight || 75,
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    thigh: '',
  });
  
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  
  // Calculate stats if user exists
  const bmi = user ? calculateBMI(user.height, user.weight) : 0;
  const bmiCategory = getBMICategory(bmi);
  const dailyCalories = user ? calculateDailyCalories(user) : 0;
  
  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };
  
  // Handle measurement form changes
  const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeasurementForm({
      ...measurementForm,
      [name]: value === '' ? '' : parseFloat(value),
    });
  };
  
  // Save user profile
  const handleSaveProfile = () => {
    updateUser(formData);
  };
  
  // Add new measurement
  const handleAddMeasurement = () => {
    const newMeasurement = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      weight: parseFloat(measurementForm.weight.toString()),
      chest: measurementForm.chest === '' ? undefined : parseFloat(measurementForm.chest.toString()),
      waist: measurementForm.waist === '' ? undefined : parseFloat(measurementForm.waist.toString()),
      hips: measurementForm.hips === '' ? undefined : parseFloat(measurementForm.hips.toString()),
      biceps: measurementForm.biceps === '' ? undefined : parseFloat(measurementForm.biceps.toString()),
      thigh: measurementForm.thigh === '' ? undefined : parseFloat(measurementForm.thigh.toString()),
    };
    
    addMeasurement(newMeasurement);
    setShowMeasurementForm(false);
    
    // Update user weight as well
    if (user) {
      updateUser({
        ...user,
        weight: parseFloat(measurementForm.weight.toString()),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your personal information and measurements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Form */}
        <div className="lg:col-span-2">
          <Card title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                fullWidth
                leftIcon={<User className="h-4 w-4" />}
              />
              
              <Input
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Your age"
                fullWidth
                leftIcon={<Calendar className="h-4 w-4" />}
              />
              
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                fullWidth
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
              />
              
              <Input
                label="Height (cm)"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="Height in cm"
                fullWidth
                leftIcon={<Ruler className="h-4 w-4" />}
              />
              
              <Input
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Weight in kg"
                fullWidth
              />
              
              <Select
                label="Fitness Goal"
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                fullWidth
                options={[
                  { value: 'Lose weight', label: 'Lose weight' },
                  { value: 'Maintain weight', label: 'Maintain weight' },
                  { value: 'Build muscle', label: 'Build muscle' },
                  { value: 'Improve fitness', label: 'Improve fitness' },
                ]}
              />
              
              <Select
                label="Activity Level"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
                fullWidth
                options={[
                  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
                  { value: 'light', label: 'Light (exercise 1-3 days/week)' },
                  { value: 'moderate', label: 'Moderate (exercise 3-5 days/week)' },
                  { value: 'active', label: 'Active (exercise 6-7 days/week)' },
                  { value: 'very active', label: 'Very Active (intense exercise daily)' },
                ]}
              />
            </div>
            
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={handleSaveProfile}
                icon={<SaveIcon className="h-4 w-4" />}
              >
                Save Profile
              </Button>
            </div>
          </Card>
        </div>

        {/* Stats and Metrics */}
        <div>
          <Card title="Your Metrics">
            {user ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">BMI</span>
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
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Daily Calorie Needs</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{dailyCalories} cal</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Based on your profile</div>
                    <div className="flex justify-between">
                      <div className="text-xs">
                        <div className="font-medium text-gray-700 dark:text-gray-300">To lose weight</div>
                        <div>{Math.round(dailyCalories * 0.85)} cal</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium text-gray-700 dark:text-gray-300">To maintain</div>
                        <div>{dailyCalories} cal</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium text-gray-700 dark:text-gray-300">To gain</div>
                        <div>{Math.round(dailyCalories * 1.15)} cal</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">Complete your profile to see metrics</p>
              </div>
            )}
          </Card>
          
          {/* Body Measurements */}
          <Card title="Body Measurements" className="mt-6">
            {!showMeasurementForm ? (
              <div className="space-y-4">
                {measurements.length > 0 ? (
                  <>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Latest: {new Date(measurements[0].date).toLocaleDateString()}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Weight:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">{measurements[0].weight} kg</span>
                        </div>
                        {measurements[0].chest && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Chest:</span>
                            <span className="ml-1 font-medium text-gray-900 dark:text-white">{measurements[0].chest} cm</span>
                          </div>
                        )}
                        {measurements[0].waist && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Waist:</span>
                            <span className="ml-1 font-medium text-gray-900 dark:text-white">{measurements[0].waist} cm</span>
                          </div>
                        )}
                        {measurements[0].biceps && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Biceps:</span>
                            <span className="ml-1 font-medium text-gray-900 dark:text-white">{measurements[0].biceps} cm</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => setShowMeasurementForm(true)}
                      icon={<Plus className="h-4 w-4" />}
                    >
                      Add New Measurement
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Dumbbell className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No measurements recorded</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMeasurementForm(true)}
                      icon={<Plus className="h-4 w-4" />}
                    >
                      Add First Measurement
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Weight (kg)"
                    name="weight"
                    type="number"
                    value={measurementForm.weight}
                    onChange={handleMeasurementChange}
                    fullWidth
                  />
                  <Input
                    label="Chest (cm)"
                    name="chest"
                    type="number"
                    value={measurementForm.chest}
                    onChange={handleMeasurementChange}
                    fullWidth
                  />
                  <Input
                    label="Waist (cm)"
                    name="waist"
                    type="number"
                    value={measurementForm.waist}
                    onChange={handleMeasurementChange}
                    fullWidth
                  />
                  <Input
                    label="Hips (cm)"
                    name="hips"
                    type="number"
                    value={measurementForm.hips}
                    onChange={handleMeasurementChange}
                    fullWidth
                  />
                  <Input
                    label="Biceps (cm)"
                    name="biceps"
                    type="number"
                    value={measurementForm.biceps}
                    onChange={handleMeasurementChange}
                    fullWidth
                  />
                  <Input
                    label="Thigh (cm)"
                    name="thigh"
                    type="number"
                    value={measurementForm.thigh}
                    onChange={handleMeasurementChange}
                    fullWidth
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="primary"
                    onClick={handleAddMeasurement}
                  >
                    Save Measurement
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowMeasurementForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;