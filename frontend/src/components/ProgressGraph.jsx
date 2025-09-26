import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart3, Calendar } from 'lucide-react';
import { getMockHistoryFromStorage } from '../mock';

const ProgressGraph = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const history = getMockHistoryFromStorage();
    setHistoryData(history);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const maxScore = Math.max(...historyData.map(d => d.totalScore), 5);

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <BarChart3 className="h-6 w-6" />
          Progress Graph - Last 7 Days
        </CardTitle>
      </CardHeader>
      <CardContent>
        {historyData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No historical data available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Chart */}
            <div className="flex items-end justify-between h-48 bg-gray-50 rounded-lg p-4">
              {historyData.map((day, index) => (
                <div key={day.date} className="flex flex-col items-center flex-1 h-full">
                  <div className="flex-1 flex items-end w-full px-1">
                    <div
                      className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md w-full min-h-[20px] transition-all duration-500 ease-out hover:from-blue-600 hover:to-blue-500 relative group"
                      style={{
                        height: `${(day.totalScore / maxScore) * 100}%`
                      }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        {day.totalScore} points
                      </div>
                    </div>
                  </div>
                  
                  {/* Date Label */}
                  <div className="text-xs text-gray-600 mt-2 text-center">
                    {formatDate(day.date)}
                  </div>
                  
                  {/* Score Label */}
                  <div className="text-sm font-semibold text-blue-600 mt-1">
                    {day.totalScore}
                  </div>
                </div>
              ))}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(historyData.reduce((sum, day) => sum + day.totalScore, 0) / historyData.length)}
                </div>
                <div className="text-sm text-gray-600">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.max(...historyData.map(d => d.totalScore))}
                </div>
                <div className="text-sm text-gray-600">Best Day</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {historyData.reduce((sum, day) => sum + day.totalScore, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressGraph;