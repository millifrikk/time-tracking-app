import React, { useState, useEffect } from 'react';
import { Play, Pause, Plus, Save, Clock, Trash2, Filter, Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarPopup } from "./components/ui/calendar-popup";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TimeTracker = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks).map(task => ({
      ...task,
      date: new Date(task.date)
    })) : [];
  });
  
  const [activeTask, setActiveTask] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'sap-ewm',
    system: 'dev',
    taskType: 'implementation',
    description: '',
    ticketNumber: '',
    project: '',
    date: new Date(),
    startTime: '',
    endTime: '',
  });

  const categories = {
    'sap-ewm': 'SAP EWM Implementation & Support',
    'sap-integration': 'SAP Integration Services',
    'change-management': 'Change Request Management',
    'retrofit': 'Retrofit Tasks',
    'softconfig': 'Softconfig Development',
    'vba-dev': 'VBA Development',
    'power-platform': 'Power Platform Development',
    'ms-dynamics': 'MS Dynamics 365',
    'documentation': 'Technical Documentation',
    'testing': 'Testing & Validation'
  };

  const systems = {
    'dev': 'Development',
    'qa': 'Quality Assurance',
    'uat': 'User Acceptance',
    'prod': 'Production',
    'sandbox': 'Sandbox'
  };

  const taskTypes = {
    'implementation': 'New Implementation',
    'support': 'Support & Maintenance',
    'enhancement': 'Enhancement',
    'bug-fix': 'Bug Fix',
    'consultation': 'Consultation',
    'training': 'Training & Knowledge Transfer',
    'documentation': 'Documentation',
    'testing': 'Testing',
    'deployment': 'Deployment'
  };

  useEffect(() => {
    let interval;
    if (isRunning && activeTask !== null) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeTask]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateSelect = (date) => {
    setNewTask({...newTask, date});
    setIsDatePickerOpen(false);
  };

  const handleStartStop = (taskId) => {
    if (activeTask === taskId) {
      setIsRunning(!isRunning);
    } else {
      setActiveTask(taskId);
      setTimer(tasks.find(t => t.id === taskId).timeSpent || 0);
      setIsRunning(true);
    }
  };

  const calculateDuration = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let durationMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (durationMinutes < 0) durationMinutes += 24 * 60;
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const exportTasks = (format) => {
    const data = tasks.map(task => ({
      ...task,
      date: new Date(task.date).toLocaleDateString(),
      category: categories[task.category],
      system: systems[task.system],
      taskType: taskTypes[task.taskType],
      duration: task.endTime && task.startTime ? 
        calculateDuration(task.startTime, task.endTime) : 
        formatTime(task.timeSpent)
    }));

    if (format === 'json') {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tasks_export_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    } else if (format === 'csv') {
      const headers = ['Title', 'Date', 'Start Time', 'End Time', 'Duration', 'Category', 'System', 'Task Type', 'Project', 'Ticket Number', 'Description'];
      const csvData = data.map(task => [
        task.title,
        task.date,
        task.startTime,
        task.endTime,
        task.duration,
        task.category,
        task.system,
        task.taskType,
        task.project,
        task.ticketNumber,
        task.description.replace(/,/g, ';')
      ]);
      
      const csvString = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tasks_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim() === '') return;
    
    const task = {
      id: Date.now(),
      ...newTask,
      timeSpent: 0,
      created: new Date().toISOString(),
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      category: 'sap-ewm',
      system: 'dev',
      taskType: 'implementation',
      description: '',
      ticketNumber: '',
      project: '',
      date: new Date(),
      startTime: '',
      endTime: '',
    });
  };

  const handleDeleteTask = (taskId) => {
    if (activeTask === taskId) {
      setIsRunning(false);
      setActiveTask(null);
    }
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleSaveTime = () => {
    if (activeTask === null) return;
    
    setTasks(tasks.map(task => 
      task.id === activeTask 
        ? { ...task, timeSpent: timer }
        : task
    ));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>IT Consulting Time Tracker</CardTitle>
          <CardDescription>SAP & Microsoft Technology Solutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end space-x-2 mb-4">
            <Button
              variant="outline"
              onClick={() => exportTasks('csv')}
              className="text-sm"
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => exportTasks('json')}
              className="text-sm"
            >
              Export JSON
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full"
              />
              <Input
                placeholder="Ticket/CR Number"
                value={newTask.ticketNumber}
                onChange={(e) => setNewTask({...newTask, ticketNumber: e.target.value})}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => setIsDatePickerOpen(true)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {newTask.date ? formatDate(newTask.date) : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPopup
                    mode="single"
                    selected={newTask.date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Input
                type="time"
                placeholder="Start Time"
                value={newTask.startTime}
                onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                className="w-full"
              />

              <Input
                type="time"
                placeholder="End Time"
                value={newTask.endTime}
                onChange={(e) => setNewTask({...newTask, endTime: e.target.value})}
                className="w-full"
              />

              <Input
                placeholder="Project/Initiative"
                value={newTask.project}
                onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={newTask.category}
                onValueChange={(value) => setNewTask({...newTask, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categories).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={newTask.system}
                onValueChange={(value) => setNewTask({...newTask, system: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select system" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(systems).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={newTask.taskType}
                onValueChange={(value) => setNewTask({...newTask, taskType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(taskTypes).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="Technical Description (Include: Changes, Impact, Testing Requirements)"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="w-full h-24"
            />

            <Button onClick={handleAddTask} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className={`${activeTask === task.id ? 'border-blue-500' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1 flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{task.title}</h3>
                    <span className="text-sm text-gray-500">#{task.ticketNumber}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-sm bg-blue-100 px-2 py-1 rounded">{categories[task.category]}</span>
                    <span className="text-sm bg-green-100 px-2 py-1 rounded">{systems[task.system]}</span>
                    <span className="text-sm bg-purple-100 px-2 py-1 rounded">{taskTypes[task.taskType]}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(new Date(task.date))} | {task.startTime} - {task.endTime}
                  </div>
                  <p className="text-sm">{task.description}</p>
                  <p className="text-sm text-gray-500">Project: {task.project}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-mono">
                    {formatTime(task.id === activeTask ? timer : task.timeSpent)}
                  </span>
                  <Button
                    variant={activeTask === task.id && isRunning ? "destructive" : "default"}
                    size="icon"
                    onClick={() => handleStartStop(task.id)}
                  >
                    {activeTask === task.id && isRunning ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSaveTime()}
                    disabled={activeTask !== task.id}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TimeTracker;