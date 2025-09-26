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

// All available habits for historical data generation
const allHabits = [
  { id: '1', name: 'Drink 8 glasses of water', emoji: '💧' },
  { id: '2', name: 'Exercise for 30 minutes', emoji: '🏃‍♂️' },
  { id: '3', name: 'Read for 20 minutes', emoji: '📚' },
  { id: '4', name: 'Meditate', emoji: '🧘‍♀️' },
  { id: '5', name: 'Write in journal', emoji: '✍️' },
  { id: '6', name: 'Eat healthy meals', emoji: '🥗' },
  { id: '7', name: 'Get 8 hours sleep', emoji: '😴' },
  { id: '8', name: 'Practice gratitude', emoji: '🙏' }
];

// Generate detailed mock historical data for 90 days
const generateDetailedHistoricalData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Generate realistic random completion pattern
    const numCompleted = Math.floor(Math.random() * (allHabits.length + 1));
    const completedHabits = [];
    const habitDetails = [];
    
    // Randomly select which habits were completed
    const shuffledHabits = [...allHabits].sort(() => Math.random() - 0.5);
    for (let j = 0; j < numCompleted; j++) {
      const habit = shuffledHabits[j];
      completedHabits.push(habit.id);
      habitDetails.push({
        id: habit.id,
        name: habit.name,
        emoji: habit.emoji,
        completed: true
      });
    }
    
    // Add non-completed habits
    for (let j = numCompleted; j < allHabits.length; j++) {
      const habit = shuffledHabits[j];
      habitDetails.push({
        id: habit.id,
        name: habit.name,
        emoji: habit.emoji,
        completed: false
      });
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      totalScore: numCompleted,
      completedHabits,
      habitDetails,
      formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    });
  }
  
  return data;
};

// Generate and store 90 days of data
let fullHistoricalData = null;

export const getFullHistoricalData = () => {
  if (!fullHistoricalData) {
    const stored = localStorage.getItem('habitTracker_90DaysData');
    if (stored) {
      fullHistoricalData = JSON.parse(stored);
    } else {
      fullHistoricalData = generateDetailedHistoricalData();
      localStorage.setItem('habitTracker_90DaysData', JSON.stringify(fullHistoricalData));
    }
  }
  return fullHistoricalData;
};

// Get data for specific periods from the 90-day dataset
export const getMockHistoryFromStorage = (period = '7') => {
  const fullData = getFullHistoricalData();
  const days = parseInt(period);
  return fullData.slice(-days); // Get last N days
};

// Get specific day data
export const getDayData = (dateString) => {
  const fullData = getFullHistoricalData();
  return fullData.find(day => day.date === dateString);
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
  
  // Calculate current streak (from today backwards)
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