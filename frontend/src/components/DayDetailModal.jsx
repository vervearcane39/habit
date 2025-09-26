import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, CheckCircle, XCircle, Target } from 'lucide-react';

const DayDetailModal = ({ dayData, isOpen, onClose }) => {
  if (!dayData) return null;

  const completedHabits = dayData.habitDetails.filter(habit => habit.completed);
  const incompletedHabits = dayData.habitDetails.filter(habit => !habit.completed);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            {dayData.fullDate}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score Summary */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-700">
                      {dayData.totalScore} / {dayData.habitDetails.length}
                    </div>
                    <div className="text-sm text-blue-600">Habits Completed</div>
                  </div>
                </div>
                <Badge 
                  className="px-4 py-2 text-lg bg-blue-600 text-white"
                >
                  {dayData.habitDetails.length > 0 ? 
                    Math.round((dayData.totalScore / dayData.habitDetails.length) * 100) : 0
                  }%
                </Badge>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-blue-200 rounded-full h-3 mt-4">
                <div 
                  className="bg-blue-600 h-full transition-all duration-500 ease-out rounded-full"
                  style={{ 
                    width: dayData.habitDetails.length > 0 ? 
                      `${(dayData.totalScore / dayData.habitDetails.length) * 100}%` : '0%' 
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Completed Habits */}
          {completedHabits.length > 0 && (
            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">
                    Completed Habits ({completedHabits.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {completedHabits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-2xl">{habit.emoji}</span>
                      <span className="flex-1 text-gray-900 font-medium">
                        {habit.name}
                      </span>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        ✓ Done
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Incomplete Habits */}
          {incompletedHabits.length > 0 && (
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-700">
                    Missed Habits ({incompletedHabits.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {incompletedHabits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <XCircle className="h-5 w-5 text-gray-400" />
                      <span className="text-2xl opacity-60">{habit.emoji}</span>
                      <span className="flex-1 text-gray-600">
                        {habit.name}
                      </span>
                      <Badge variant="secondary" className="bg-gray-200 text-gray-600">
                        Missed
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No habits message */}
          {dayData.habitDetails.length === 0 && (
            <Card className="border-gray-200">
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No habit data available for this day.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayDetailModal;