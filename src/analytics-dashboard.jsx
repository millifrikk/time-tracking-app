import React, { useState, useEffect } from 'react';
import { BarChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsDashboard } from "./components/ui/analytics-dashboard";
import { TimeTrendChart } from "./components/ui/time-trend-chart";
import { ProductivityHeatmap } from "./components/ui/productivity-heatmap";
import { DateRangePicker } from "./components/ui/date-range-picker";
import { NavBar } from "./components/ui/nav-bar";
import { useNavigate } from "react-router-dom";

const AnalyticsDashboardPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [filteredTasks, setFilteredTasks] = useState([]);
  
  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map(task => ({
          ...task,
          date: new Date(task.date)
        }));
        setTasks(parsedTasks);
        setFilteredTasks(parsedTasks); // Initialize filtered tasks with all tasks
      } catch (error) {
        console.error("Error parsing tasks from localStorage:", error);
        setTasks([]);
        setFilteredTasks([]);
      }
    }
  }, []);
  
  // Update filtered tasks when date range changes
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    
    if (!range.from || tasks.length === 0) {
      setFilteredTasks(tasks);
      return;
    }
    
    // Set start of day for the from date and end of day for the to date
    const fromDate = new Date(range.from);
    fromDate.setHours(0, 0, 0, 0);
    
    const toDate = new Date(range.to || range.from);
    toDate.setHours(23, 59, 59, 999);
    
    // Filter tasks based on date range
    const filtered = tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate >= fromDate && taskDate <= toDate;
    });
    
    setFilteredTasks(filtered);
  };
  
  // Update filtered tasks when task list changes
  useEffect(() => {
    if (tasks.length > 0) {
      handleDateRangeChange(dateRange);
    }
  }, [tasks]);

  // Debug output
  console.log("Tasks:", tasks.length);
  console.log("Filtered Tasks:", filteredTasks.length);
  console.log("Date Range:", dateRange);
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar activePage="analytics" />
      
      <div className="p-4 max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>
        
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle>Task Summary</CardTitle>
            <CardDescription>
              {dateRange.from ? (
                <>
                  Data from {dateRange.from.toLocaleDateString()} 
                  {dateRange.to && dateRange.from.getTime() !== dateRange.to.getTime() 
                    ? ` to ${dateRange.to.toLocaleDateString()}` 
                    : ''}
                </>
              ) : 'All time data'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800">Total Tasks</h3>
                <p className="text-3xl font-bold">{filteredTasks.length}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800">Total Hours</h3>
                <p className="text-3xl font-bold">
                  {parseFloat((filteredTasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0) / 3600).toFixed(2))}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800">Avg Hours/Task</h3>
                <p className="text-3xl font-bold">
                  {filteredTasks.length > 0 
                    ? parseFloat(((filteredTasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0) / filteredTasks.length) / 3600).toFixed(2))
                    : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {filteredTasks.length === 0 ? (
          <Card className="bg-white shadow-lg p-6 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No task data available</h3>
            <p className="text-gray-600 mb-4">
              {tasks.length === 0 
                ? "You haven't created any tasks yet." 
                : "No tasks match the selected date range."}
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go to Time Tracker
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            <AnalyticsDashboard tasks={filteredTasks} />
            <TimeTrendChart tasks={filteredTasks} />
            <ProductivityHeatmap tasks={filteredTasks} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;