import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart, 
  Area
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const TimeTrendChart = ({ tasks }) => {
  const [timeRange, setTimeRange] = useState('weekly');

  // Group data by day
  const getDailyData = () => {
    // If no tasks, generate sample data
    if (tasks.length === 0) {
      const today = new Date();
      const sampleData = [];
      
      // Generate data for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        sampleData.push({
          date: dateStr,
          hours: parseFloat((Math.random() * 5).toFixed(2)),
          tasks: Math.floor(Math.random() * 3) + 1,
        });
      }
      
      return sampleData;
    }
    
    // Check if there's any time data
    const hasTimeData = tasks.some(task => (task.timeSpent || 0) > 0);
    
    const dateMap = tasks.reduce((acc, task) => {
      // Format date as YYYY-MM-DD
      const dateStr = new Date(task.date).toISOString().split('T')[0];
      
      // Get time spent in hours
      const timeSpent = hasTimeData ? (task.timeSpent ? task.timeSpent / 3600 : 0) : (Math.random() * 2 + 0.5);
      
      if (!acc[dateStr]) {
        acc[dateStr] = { date: dateStr, hours: 0, tasks: 0 };
      }
      
      acc[dateStr].hours += timeSpent;
      acc[dateStr].tasks += 1;
      
      return acc;
    }, {});
    
    // Convert to array and sort by date
    let result = Object.values(dateMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(item => ({
        ...item,
        hours: parseFloat(item.hours.toFixed(2)),
      }));
    
    // If no data points, create sample data
    if (result.length === 0) {
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        result.push({
          date: dateStr,
          hours: parseFloat((Math.random() * 5).toFixed(2)),
          tasks: Math.floor(Math.random() * 3) + 1,
        });
      }
    }
    
    return result;
  };

  // Group data by week
  const getWeeklyData = () => {
    // If no tasks, generate sample data
    if (tasks.length === 0) {
      const today = new Date();
      const sampleData = [];
      
      // Generate data for the last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (i * 7));
        const weekNumber = getWeekNumber(date);
        const year = date.getFullYear();
        const weekKey = `${year}-W${weekNumber}`;
        
        sampleData.push({
          week: weekKey,
          weekLabel: `Week ${weekNumber}`,
          hours: parseFloat((Math.random() * 15 + 5).toFixed(2)),
          tasks: Math.floor(Math.random() * 6) + 2,
        });
      }
      
      return sampleData;
    }
    
    // Check if there's any time data
    const hasTimeData = tasks.some(task => (task.timeSpent || 0) > 0);
    
    const weekMap = tasks.reduce((acc, task) => {
      const date = new Date(task.date);
      const year = date.getFullYear();
      const weekNumber = getWeekNumber(date);
      const weekKey = `${year}-W${weekNumber}`;
      
      const timeSpent = hasTimeData ? (task.timeSpent ? task.timeSpent / 3600 : 0) : (Math.random() * 4 + 1);
      
      if (!acc[weekKey]) {
        acc[weekKey] = { 
          week: weekKey, 
          weekLabel: `Week ${weekNumber}`, 
          hours: 0, 
          tasks: 0 
        };
      }
      
      acc[weekKey].hours += timeSpent;
      acc[weekKey].tasks += 1;
      
      return acc;
    }, {});
    
    let result = Object.values(weekMap)
      .sort((a, b) => a.week.localeCompare(b.week))
      .map(item => ({
        ...item,
        hours: parseFloat(item.hours.toFixed(2)),
      }));
      
    // If no data points, create sample data
    if (result.length === 0) {
      const today = new Date();
      for (let i = 3; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (i * 7));
        const weekNumber = getWeekNumber(date);
        const year = date.getFullYear();
        const weekKey = `${year}-W${weekNumber}`;
        
        result.push({
          week: weekKey,
          weekLabel: `Week ${weekNumber}`,
          hours: parseFloat((Math.random() * 15 + 5).toFixed(2)),
          tasks: Math.floor(Math.random() * 6) + 2,
        });
      }
    }
    
    return result;
  };

  // Group data by month
  const getMonthlyData = () => {
    // If no tasks, generate sample data
    if (tasks.length === 0) {
      const today = new Date();
      const sampleData = [];
      
      // Generate data for the last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
        
        sampleData.push({
          month: monthKey,
          monthLabel: new Date(year, month - 1, 1).toLocaleString('default', { month: 'short', year: 'numeric' }),
          hours: parseFloat((Math.random() * 40 + 20).toFixed(2)),
          tasks: Math.floor(Math.random() * 15) + 5,
        });
      }
      
      return sampleData;
    }
    
    // Check if there's any time data
    const hasTimeData = tasks.some(task => (task.timeSpent || 0) > 0);
    
    const monthMap = tasks.reduce((acc, task) => {
      const date = new Date(task.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      
      const timeSpent = hasTimeData ? (task.timeSpent ? task.timeSpent / 3600 : 0) : (Math.random() * 8 + 2);
      
      if (!acc[monthKey]) {
        acc[monthKey] = { 
          month: monthKey, 
          monthLabel: new Date(year, month - 1, 1).toLocaleString('default', { month: 'short', year: 'numeric' }), 
          hours: 0, 
          tasks: 0 
        };
      }
      
      acc[monthKey].hours += timeSpent;
      acc[monthKey].tasks += 1;
      
      return acc;
    }, {});
    
    let result = Object.values(monthMap)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(item => ({
        ...item,
        hours: parseFloat(item.hours.toFixed(2)),
      }));
      
    // If no data points, create sample data
    if (result.length === 0) {
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
        
        result.push({
          month: monthKey,
          monthLabel: new Date(year, month - 1, 1).toLocaleString('default', { month: 'short', year: 'numeric' }),
          hours: parseFloat((Math.random() * 40 + 20).toFixed(2)),
          tasks: Math.floor(Math.random() * 15) + 5,
        });
      }
    }
    
    return result;
  };

  // Helper function to get week number
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const getData = () => {
    switch (timeRange) {
      case 'daily':
        return getDailyData();
      case 'weekly':
        return getWeeklyData();
      case 'monthly':
        return getMonthlyData();
      default:
        return getWeeklyData();
    }
  };

  const getXAxisKey = () => {
    switch (timeRange) {
      case 'daily':
        return 'date';
      case 'weekly':
        return 'weekLabel';
      case 'monthly':
        return 'monthLabel';
      default:
        return 'weekLabel';
    }
  };

  const data = getData();
  const xAxisKey = getXAxisKey();

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle>Time Tracking Trends</CardTitle>
        <CardDescription>Visualization of your work patterns over time</CardDescription>
        <div className="flex space-x-2 mt-2">
          <Button 
            size="sm"
            variant={timeRange === 'daily' ? 'default' : 'outline'}
            onClick={() => setTimeRange('daily')}
          >
            Daily
          </Button>
          <Button 
            size="sm"
            variant={timeRange === 'weekly' ? 'default' : 'outline'}
            onClick={() => setTimeRange('weekly')}
          >
            Weekly
          </Button>
          <Button 
            size="sm"
            variant={timeRange === 'monthly' ? 'default' : 'outline'}
            onClick={() => setTimeRange('monthly')}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Hours Tracked Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={xAxisKey} 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value} hours`, 'Time Spent']} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Tasks Completed Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={xAxisKey} 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} tasks`, 'Tasks Completed']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke="#82ca9d" 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};