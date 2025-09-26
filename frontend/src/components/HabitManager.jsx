import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { X, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { 
  saveMockHabitsToStorage, 
  habitEmojis, 
  generateId 
} from '../mock';

const HabitManager = ({ habits, onClose, onHabitsUpdate }) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(habitEmojis[0]);
  const [editingHabit, setEditingHabit] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('');

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;

    const newHabit = {
      id: generateId(),
      name: newHabitName.trim(),
      emoji: selectedEmoji,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedHabits = [...habits, newHabit];
    saveMockHabitsToStorage(updatedHabits);
    onHabitsUpdate(updatedHabits);
    
    // Reset form
    setNewHabitName('');
    setSelectedEmoji(habitEmojis[0]);
  };

  const handleDeleteHabit = (habitId) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    saveMockHabitsToStorage(updatedHabits);
    onHabitsUpdate(updatedHabits);
  };

  const startEditing = (habit) => {
    setEditingHabit(habit.id);
    setEditName(habit.name);
    setEditEmoji(habit.emoji);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;

    const updatedHabits = habits.map(habit =>
      habit.id === editingHabit
        ? { ...habit, name: editName.trim(), emoji: editEmoji }
        : habit
    );
    
    saveMockHabitsToStorage(updatedHabits);
    onHabitsUpdate(updatedHabits);
    setEditingHabit(null);
  };

  const handleCancelEdit = () => {
    setEditingHabit(null);
    setEditName('');
    setEditEmoji('');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Edit2 className="h-6 w-6" />
            Manage Habits
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Habit */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">Add New Habit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habit Name
                </label>
                <Input
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Enter habit name..."
                  className="border-blue-200 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {habitEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`text-2xl p-2 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                        selectedEmoji === emoji
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAddHabit}
                disabled={!newHabitName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            </CardContent>
          </Card>

          {/* Existing Habits */}
          {habits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Your Habits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                    >
                      {editingHabit === habit.id ? (
                        // Edit Mode
                        <>
                          <div className="flex flex-wrap gap-1 mr-2">
                            {habitEmojis.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => setEditEmoji(emoji)}
                                className={`text-lg p-1 rounded border ${
                                  editEmoji === emoji
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200'
                                }`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 border-blue-200"
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="border-gray-300"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        // View Mode
                        <>
                          <span className="text-2xl">{habit.emoji}</span>
                          <span className="flex-1 text-gray-900">{habit.name}</span>
                          <Badge 
                            variant={habit.completed ? "default" : "secondary"}
                            className={habit.completed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {habit.completed ? 'Completed' : 'Pending'}
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(habit)}
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteHabit(habit.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HabitManager;