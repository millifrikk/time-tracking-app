import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ResponsiveContainer, Tooltip } from 'recharts';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_ABBREVIATIONS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const ProductivityHeatmap = ({ tasks }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    // Initialize empty heatmap data
    const initialData = Array(7).fill().map((_, dayIndex) => ({
      day: DAYS_OF_WEEK[dayIndex],
      dayAbbr: DAY_ABBREVIATIONS[dayIndex],
      dayIndex,
      hours: Array(24).fill().map((_, hour) => ({
        hour,
        value: 0,
        formattedHour: `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? 'am' : 'pm'}`,
        tasks: []
      }))
    }));

    // Check if there's any time data
    const hasTimeData = tasks.some(task => (task.timeSpent || 0) > 0);
    
    // If no time data, generate sample heat map
    if (!hasTimeData) {
      // Generate random productivity patterns with realistic work hours
      // More productivity on weekdays during business hours
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        for (let hour = 0; hour < 24; hour++) {
          let value = 0;
          
          // Weekdays (Mon-Fri)
          if (dayIndex >= 1 && dayIndex <= 5) {
            // Business hours (9am-5pm)
            if (hour >= 9 && hour < 17) {
              value = Math.random() * 3600 * 1.5; // 0-1.5 hours per cell
            } 
            // Early morning/evening hours
            else if ((hour >= 7 && hour < 9) || (hour >= 17 && hour < 19)) {
              value = Math.random() * 3600 * 0.8; // 0-0.8 hours per cell
            }
            // Late hours
            else if (hour >= 19 && hour < 23) {
              value = Math.random() * 3600 * 0.3; // 0-0.3 hours per cell
            }
          } 
          // Weekend
          else {
            // Weekend day hours
            if (hour >= 10 && hour < 18) {
              value = Math.random() * 3600 * 0.7; // 0-0.7 hours per cell
            }
          }
          
          initialData[dayIndex].hours[hour].value = value;
          
          // Add sample tasks if value is significant
          if (value > 1800) { // More than 30 mins
            initialData[dayIndex].hours[hour].tasks.push({
              title: 'Sample Task',
              timeSpent: value
            });
          }
        }
      }
      
      // Find max value
      let maxVal = 0;
      initialData.forEach(day => {
        day.hours.forEach(hour => {
          if (hour.value > maxVal) maxVal = hour.value;
        });
      });
      
      setHeatmapData(initialData);
      setMaxValue(maxVal);
      return;
    }
    
    // Calculate productivity data from real tasks
    let maxVal = 0;
    tasks.forEach(task => {
      // Skip tasks with no timeSpent
      if (!task.timeSpent) return;
      
      // Extract date information
      const taskDate = new Date(task.date);
      const dayIndex = taskDate.getDay(); // 0-6 (Sunday-Saturday)
      
      // Handle tasks with start and end times
      if (task.startTime && task.endTime) {
        const [startHour] = task.startTime.split(':').map(Number);
        const [endHour] = task.endTime.split(':').map(Number);
        
        // Calculate hours across the duration
        const hoursSpan = endHour >= startHour 
          ? endHour - startHour 
          : (24 - startHour) + endHour;
        
        // Distribute time evenly across the hours
        const timePerHour = task.timeSpent / hoursSpan;
        
        let currentHour = startHour;
        for (let i = 0; i < hoursSpan; i++) {
          initialData[dayIndex].hours[currentHour].value += timePerHour;
          initialData[dayIndex].hours[currentHour].tasks.push(task);
          
          if (initialData[dayIndex].hours[currentHour].value > maxVal) {
            maxVal = initialData[dayIndex].hours[currentHour].value;
          }
          
          currentHour = (currentHour + 1) % 24;
        }
      } 
      // For tasks without specific times, add to default work hours (9am-5pm)
      else {
        // Distribute task time across standard work hours (9am-5pm)
        const workHours = 8; // 9am-5pm
        const timePerHour = task.timeSpent / workHours;
        
        for (let hour = 9; hour < 17; hour++) {
          initialData[dayIndex].hours[hour].value += timePerHour;
          initialData[dayIndex].hours[hour].tasks.push(task);
          
          if (initialData[dayIndex].hours[hour].value > maxVal) {
            maxVal = initialData[dayIndex].hours[hour].value;
          }
        }
      }
    });

    setHeatmapData(initialData);
    setMaxValue(maxVal || 3600); // Set a default max value if no tasks had time
  }, [tasks]);

  // Helper function to get color intensity based on value
  const getColorIntensity = (value) => {
    if (maxValue === 0) return '#f9fafb'; // Very light gray if no data
    
    const normalizedValue = value / maxValue;
    
    // Color scale from light blue to dark purple
    if (normalizedValue === 0) return '#f9fafb';
    if (normalizedValue < 0.2) return '#e0f2fe';
    if (normalizedValue < 0.4) return '#bae6fd';
    if (normalizedValue < 0.6) return '#7dd3fc';
    if (normalizedValue < 0.8) return '#38bdf8';
    return '#0284c7';
  };

  // Format time value for display
  const formatTimeValue = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  // Custom tooltip component for cell hover
  const HeatmapTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const { day, formattedHour, value, tasks } = data;
      
      return (
        <div className="bg-white p-3 rounded shadow-lg border border-gray-200 max-w-xs">
          <p className="font-bold">{day}, {formattedHour}</p>
          <p className="text-sm">Time spent: {formatTimeValue(value)}</p>
          {tasks.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold">Tasks ({tasks.length}):</p>
              <ul className="text-xs mt-1">
                {tasks.slice(0, 3).map((task, idx) => (
                  <li key={idx} className="truncate">{task.title}</li>
                ))}
                {tasks.length > 3 && <li className="italic">+{tasks.length - 3} more...</li>}
              </ul>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle>Productivity Heatmap</CardTitle>
        <CardDescription>Visualize when you are most productive during the week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={24 * 30 + 50}>
          <div className="relative">
            {/* Time Labels (left side) */}
            <div className="absolute left-0 top-8 w-12 bottom-0 flex flex-col justify-between text-xs text-gray-500">
              {HOURS.map(hour => (
                <div key={hour} style={{ height: '30px' }}>
                  {hour % 3 === 0 && (
                    <span>{hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? 'am' : 'pm'}</span>
                  )}
                </div>
              ))}
            </div>
            
            {/* Day Labels (top) */}
            <div className="absolute left-12 right-0 top-0 h-8 flex justify-between text-xs font-medium">
              {DAY_ABBREVIATIONS.map((day, i) => (
                <div key={i} className="flex-1 text-center">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Heatmap Grid */}
            <div className="absolute left-12 right-0 top-8 bottom-0 flex">
              {heatmapData.map((dayData, dayIndex) => (
                <div key={dayIndex} className="flex-1 flex flex-col">
                  {dayData.hours.map((hourData, hourIndex) => (
                    <div
                      key={hourIndex}
                      className="border border-gray-100 relative group cursor-pointer"
                      style={{ 
                        height: '30px',
                        backgroundColor: getColorIntensity(hourData.value),
                      }}
                      title={`${dayData.day}, ${hourData.formattedHour}: ${formatTimeValue(hourData.value)}`}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity z-10"></div>
                      
                      {/* Custom tooltip displayed on hover */}
                      <div className="hidden group-hover:block absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-full z-20">
                        <HeatmapTooltip active={true} payload={[{ payload: {
                          day: dayData.day,
                          formattedHour: hourData.formattedHour,
                          value: hourData.value,
                          tasks: hourData.tasks
                        }}]} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="absolute left-0 right-0 bottom-0 mt-4 pt-4 flex items-center justify-center space-x-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 mr-1" style={{ backgroundColor: '#f9fafb' }}></div>
                <span>None</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 mr-1" style={{ backgroundColor: '#e0f2fe' }}></div>
                <span>Low</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 mr-1" style={{ backgroundColor: '#7dd3fc' }}></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 mr-1" style={{ backgroundColor: '#0284c7' }}></div>
                <span>High</span>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};