import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Plus, Target, TrendingUp } from 'lucide-react';
import { 
  getMockHabitsFromStorage, 
  saveMockHabitsToStorage,
  getTodaysScore,
  updateTodaysDataInHistory
} from '../mock';
import HabitManager from './HabitManager';
import ProgressGraph from './ProgressGraph';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [showHabitManager, setShowHabitManager] = useState(false);
  const [todayScore, setTodayScore] = useState(0);
  const [refreshGraph, setRefreshGraph] = useState(0);

  useEffect(() => {
    const storedHabits = getMockHabitsFromStorage();
    setHabits(storedHabits);
    setTodayScore(getTodaysScore(storedHabits));
  }, []);

  const toggleHabitCompletion = useCallback((habitId) => {
    const updatedHabits = habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: !habit.completed }
        : habit
    );
    
    // Update habits state
    setHabits(updatedHabits);
    
    // Save to storage and update historical data
    saveMockHabitsToStorage(updatedHabits);
    
    // Update today's score
    const newScore = getTodaysScore(updatedHabits);
    setTodayScore(newScore);
    
    // Trigger graph refresh by updating key
    setRefreshGraph(prev => prev + 1);
  }, [habits]);

  const handleHabitsUpdate = useCallback((updatedHabits) => {
    setHabits(updatedHabits);
    setTodayScore(getTodaysScore(updatedHabits));
    setShowHabitManager(false);
    
    // Update historical data and refresh graph
    updateTodaysDataInHistory(updatedHabits);
    setRefreshGraph(prev => prev + 1);
  }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Daily Habits</h1>
          <p className="text-gray-600">{formatDate(new Date())}</p>
        </div>

        {/* Score Card */}
        <Card className="bg-white border-blue-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Target className="h-6 w-6" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">{todayScore}</div>
                <div className="text-sm text-gray-600">out of {habits.length} habits</div>
              </div>
              <Badge 
                variant={todayScore === habits.length ? "default" : "secondary"}
                className="px-4 py-2 text-lg bg-blue-100 text-blue-800 hover:bg-blue-200"
              >
                {habits.length > 0 ? Math.round((todayScore / habits.length) * 100) : 0}%
              </Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500 ease-out rounded-full"
                style={{ 
                  width: habits.length > 0 ? `${(todayScore / habits.length) * 100}%` : '0%' 
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Habits List */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <TrendingUp className="h-6 w-6" />
                Your Habits
              </CardTitle>
              <Button 
                onClick={() => setShowHabitManager(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {habits.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No habits yet. Add your first habit to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <Checkbox
                      id={habit.id}
                      checked={habit.completed}
                      onCheckedChange={() => toggleHabitCompletion(habit.id)}
                      className="h-5 w-5 border-blue-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <label 
                      htmlFor={habit.id}
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                    >
                      <span className="text-2xl">{habit.emoji}</span>
                      <span 
                        className={`text-lg transition-all duration-200 ${
                          habit.completed 
                            ? 'text-gray-500 line-through' 
                            : 'text-gray-900 group-hover:text-blue-700'
                        }`}
                      >
                        {habit.name}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Chart with refresh key */}
        <ProgressGraph key={refreshGraph} />

        {/* Habit Manager Modal */}
        {showHabitManager && (
          <HabitManager
            habits={habits}
            onClose={() => setShowHabitManager(false)}
            onHabitsUpdate={handleHabitsUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;