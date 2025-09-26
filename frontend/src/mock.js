// Mock data for habit tracking app development
export const mockHabits = [
  {
    id: '1',
    name: 'Drink 8 glasses of water',
    emoji: '💧',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2', 
    name: 'Exercise for 30 minutes',
    emoji: '🏃‍♂️',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Read for 20 minutes', 
    emoji: '📚',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Meditate',
    emoji: '🧘‍♀️', 
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Write in journal',
    emoji: '✍️',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

// Mock historical data for last 7 days
export const mockHistoricalData = [
  { date: '2025-01-20', totalScore: 3, completedHabits: ['1', '2', '4'] },
  { date: '2025-01-19', totalScore: 4, completedHabits: ['1', '2', '3', '4'] },
  { date: '2025-01-18', totalScore: 2, completedHabits: ['2', '5'] },
  { date: '2025-01-17', totalScore: 5, completedHabits: ['1', '2', '3', '4', '5'] },
  { date: '2025-01-16', totalScore: 3, completedHabits: ['1', '3', '4'] },
  { date: '2025-01-15', totalScore: 1, completedHabits: ['2'] },
  { date: '2025-01-14', totalScore: 4, completedHabits: ['1', '2', '4', '5'] }
];

// Common emojis for habit creation
export const habitEmojis = [
  '💧', '🏃‍♂️', '📚', '🧘‍♀️', '✍️', '🥗', '😴', '🎯', 
  '💪', '🚴‍♀️', '🎵', '🌱', '🧠', '❤️', '☀️', '🌙'
];

// Helper functions for mock data management
export const getMockHabitsFromStorage = () => {
  const stored = localStorage.getItem('habitTrackerHabits');
  return stored ? JSON.parse(stored) : mockHabits;
};

export const saveMockHabitsToStorage = (habits) => {
  localStorage.setItem('habitTrackerHabits', JSON.stringify(habits));
};

export const getMockHistoryFromStorage = () => {
  const stored = localStorage.getItem('habitTrackerHistory');
  return stored ? JSON.parse(stored) : mockHistoricalData;
};

export const saveMockHistoryToStorage = (history) => {
  localStorage.setItem('habitTrackerHistory', JSON.stringify(history));
};

export const getTodaysScore = (habits) => {
  return habits.filter(habit => habit.completed).length;
};

export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};