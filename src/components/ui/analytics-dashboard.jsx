import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

export const AnalyticsDashboard = ({ tasks }) => {
  // Generate sample data if no tasks or no time spent
  const hasTimeData = tasks.some(task => (task.timeSpent || 0) > 0);
  
  // Calculate total time spent by category
  let categoryData = [];
  if (hasTimeData) {
    categoryData = Object.entries(
      tasks.reduce((acc, task) => {
        const category = task.category;
        const timeSpent = task.timeSpent || 0;
        acc[category] = (acc[category] || 0) + timeSpent;
        return acc;
      }, {})
    ).map(([category, timeSpent]) => ({
      name: category,
      hours: parseFloat((timeSpent / 3600).toFixed(2)),
    }));
  } else if (tasks.length > 0) {
    // Create sample data based on categories used but with sample hours
    const uniqueCategories = [...new Set(tasks.map(task => task.category))];
    categoryData = uniqueCategories.map((category, index) => ({
      name: category,
      hours: (index + 1) * 0.5, // Sample hours for visualization
    }));
  } else {
    // Default sample data if no tasks exist
    categoryData = [
      { name: 'sap-ewm', hours: 3.5 },
      { name: 'documentation', hours: 2.0 },
      { name: 'testing', hours: 1.5 }
    ];
  }

  // Calculate time spent by task type
  let taskTypeData = [];
  if (hasTimeData) {
    taskTypeData = Object.entries(
      tasks.reduce((acc, task) => {
        const taskType = task.taskType;
        const timeSpent = task.timeSpent || 0;
        acc[taskType] = (acc[taskType] || 0) + timeSpent;
        return acc;
      }, {})
    ).map(([taskType, timeSpent]) => ({
      name: taskType,
      hours: parseFloat((timeSpent / 3600).toFixed(2)),
    }));
  } else if (tasks.length > 0) {
    // Create sample data based on task types used but with sample hours
    const uniqueTaskTypes = [...new Set(tasks.map(task => task.taskType))];
    taskTypeData = uniqueTaskTypes.map((taskType, index) => ({
      name: taskType,
      hours: (index + 1) * 0.7, // Sample hours for visualization
    }));
  } else {
    // Default sample data if no tasks exist
    taskTypeData = [
      { name: 'implementation', hours: 2.5 },
      { name: 'support', hours: 1.8 },
      { name: 'enhancement', hours: 1.2 }
    ];
  }

  // Calculate summary statistics
  const totalTasks = tasks.length;
  const totalTimeSpent = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
  const totalHours = parseFloat((totalTimeSpent / 3600).toFixed(2));
  const avgTaskTime = totalTasks > 0 
    ? parseFloat(((totalTimeSpent / totalTasks) / 3600).toFixed(2)) 
    : 0;

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Time Tracking Analytics</CardTitle>
          <CardDescription>Visualization of your tracked time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800">Total Tasks</h3>
              <p className="text-3xl font-bold">{totalTasks}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-800">Total Hours</h3>
              <p className="text-3xl font-bold">{totalHours}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800">Avg Hours/Task</h3>
              <p className="text-3xl font-bold">{avgTaskTime}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Hours by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value} hours`, 'Time Spent']} />
                  <Legend />
                  <Bar dataKey="hours" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Time Distribution by Task Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="hours"
                  >
                    {taskTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} hours`, 'Time Spent']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};