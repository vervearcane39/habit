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

// Generate mock historical data for different time periods
const generateHistoricalData = (days) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Generate realistic random scores
    const totalScore = Math.floor(Math.random() * 6); // 0-5 habits
    const completedHabits = Array.from({ length: totalScore }, (_, idx) => `${idx + 1}`);
    
    data.push({
      date: date.toISOString().split('T')[0],
      totalScore,
      completedHabits,
      formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return data;
};

// Mock historical data for different periods
export const mockHistoricalData = {
  '7': generateHistoricalData(7),
  '30': generateHistoricalData(30),
  '90': generateHistoricalData(90)
};

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

export const getMockHistoryFromStorage = (period = '7') => {
  const stored = localStorage.getItem(`habitTrackerHistory_${period}`);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Generate and store new data
  const newData = mockHistoricalData[period];
  saveMockHistoryToStorage(newData, period);
  return newData;
};

export const saveMockHistoryToStorage = (history, period = '7') => {
  localStorage.setItem(`habitTrackerHistory_${period}`, JSON.stringify(history));
};

export const getTodaysScore = (habits) => {
  return habits.filter(habit => habit.completed).length;
};

export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const getStatistics = (data) => {
  if (!data || data.length === 0) return { average: 0, best: 0, total: 0, streak: 0 };
  
  const scores = data.map(d => d.totalScore);
  const average = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length * 10) / 10;
  const best = Math.max(...scores);
  const total = scores.reduce((sum, score) => sum + score, 0);
  
  // Calculate current streak
  let streak = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].totalScore > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return { average, best, total, streak };
};