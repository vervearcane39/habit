import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart3, TrendingUp, Calendar, Target, Flame } from 'lucide-react';
import { getMockHistoryFromStorage, getStatistics, getDayData } from '../mock';
import DayDetailModal from './DayDetailModal';

const ProgressGraph = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7');
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'line'
  const [historyData, setHistoryData] = useState([]);
  const [statistics, setStatistics] = useState({ average: 0, best: 0, total: 0, streak: 0 });
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);

  useEffect(() => {
    const data = getMockHistoryFromStorage(selectedPeriod);
    setHistoryData(data);
    setStatistics(getStatistics(data));
  }, [selectedPeriod]);

  const periods = [
    { value: '7', label: '7 Days' },
    { value: '30', label: '30 Days' },
    { value: '90', label: '90 Days' }
  ];

  const maxScore = Math.max(...historyData.map(d => d.totalScore), 5);

  const handleDayClick = (day) => {
    const dayData = getDayData(day.date);
    setSelectedDay(dayData);
    setShowDayModal(true);
  };

  const renderBarChart = () => (
    <div className="flex items-end justify-between h-64 bg-gradient-to-t from-gray-50 to-white rounded-lg p-4 border">
      {historyData.map((day, index) => (
        <div key={day.date} className="flex flex-col items-center flex-1 h-full group">
          <div className="flex-1 flex items-end w-full px-1">
            <div
              className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg w-full min-h-[8px] transition-all duration-300 ease-out hover:from-blue-700 hover:to-blue-500 relative cursor-pointer shadow-sm hover:shadow-md transform hover:scale-105"
              style={{
                height: `${Math.max((day.totalScore / maxScore) * 100, 8)}%`
              }}
              onClick={() => handleDayClick(day)}
            >
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                <div className="font-semibold">{day.formattedDate}</div>
                <div>{day.totalScore} {day.totalScore === 1 ? 'point' : 'points'}</div>
                <div className="text-gray-300 text-xs">Click for details</div>
              </div>
            </div>
          </div>
          
          {/* Date Label */}
          <div className="text-xs text-gray-600 mt-2 text-center">
            {selectedPeriod === '7' ? 
              new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }) :
              day.formattedDate
            }
          </div>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => {
    const points = historyData.map((day, index) => {
      const x = (index / (historyData.length - 1)) * 100;
      const y = 100 - (day.totalScore / maxScore) * 80; // 80% of height for padding
      return { x, y, score: day.totalScore, date: day.formattedDate, dayData: day };
    });

    const pathD = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <div className="h-64 bg-gradient-to-t from-gray-50 to-white rounded-lg p-4 border relative">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line
              key={i}
              x1="0"
              y1={100 - (i / maxScore) * 80}
              x2="100"
              y2={100 - (i / maxScore) * 80}
              stroke="#e5e7eb"
              strokeWidth="0.2"
            />
          ))}
          
          {/* Area under curve */}
          <path
            d={`${pathD} L 100 100 L 0 100 Z`}
            fill="url(#gradient)"
            opacity="0.3"
          />
          
          {/* Main line */}
          <path
            d={pathD}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="1.5"
                fill="#3b82f6"
                className="hover:r-3 transition-all duration-200 cursor-pointer"
                onClick={() => handleDayClick(point.dayData)}
              />
              {/* Invisible larger circle for better click area */}
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="transparent"
                className="cursor-pointer"
                onClick={() => handleDayClick(point.dayData)}
              />
            </g>
          ))}
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
        
        {/* Date labels */}
        <div className="absolute bottom-0 left-4 right-4 flex justify-between text-xs text-gray-600 mt-2">
          {historyData.map((day, index) => {
            if (selectedPeriod === '7' || index % Math.ceil(historyData.length / 7) === 0 || index === historyData.length - 1) {
              return (
                <span key={day.date} className="text-center">
                  {selectedPeriod === '7' ? 
                    new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }) :
                    day.formattedDate
                  }
                </span>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <TrendingUp className="h-6 w-6" />
              Progress Analytics
            </CardTitle>
            
            {/* Chart type toggle */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={chartType === 'bar' ? 'default' : 'outline'}
                onClick={() => setChartType('bar')}
                className={chartType === 'bar' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={chartType === 'line' ? 'default' : 'outline'}
                onClick={() => setChartType('line')}
                className={chartType === 'line' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="space-y-6">
            {/* Period Selection */}
            <TabsList className="grid w-full grid-cols-3 bg-blue-50">
              {periods.map(period => (
                <TabsTrigger 
                  key={period.value} 
                  value={period.value}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  {period.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Chart Content */}
            {periods.map(period => (
              <TabsContent key={period.value} value={period.value} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Last {period.label}
                    </h3>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <span>{chartType === 'bar' ? 'Bar Chart' : 'Line Chart'}</span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        Click any day for details
                      </span>
                    </div>
                  </div>
                  
                  {/* Chart */}
                  {historyData.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No data available for this period.</p>
                    </div>
                  ) : (
                    <>
                      {chartType === 'bar' ? renderBarChart() : renderLineChart()}
                    </>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Statistics */}
          {historyData.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-2xl font-bold text-blue-600">{statistics.average}</span>
                  </div>
                  <div className="text-sm text-gray-600">Avg Score</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-2xl font-bold text-green-600">{statistics.best}</span>
                  </div>
                  <div className="text-sm text-gray-600">Best Day</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-2xl font-bold text-purple-600">{statistics.total}</span>
                  </div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Flame className="h-5 w-5 text-orange-600 mr-2" />
                    <span className="text-2xl font-bold text-orange-600">{statistics.streak}</span>
                  </div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Day Detail Modal */}
      <DayDetailModal 
        dayData={selectedDay}
        isOpen={showDayModal}
        onClose={() => setShowDayModal(false)}
      />
    </>
  );
};

export default ProgressGraph;