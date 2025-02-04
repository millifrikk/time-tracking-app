import React, { useState, useEffect } from 'react';
import { Play, Pause, Plus, Save, Clock, Trash2 } from 'lucide-react';

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

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning && activeTask !== null) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeTask]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">IT Consulting Time Tracker</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleAddTask}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Task
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-lg shadow p-4 ${
              activeTask === task.id ? 'border-2 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-mono">
                  {formatTime(task.id === activeTask ? timer : task.timeSpent)}
                </span>
                <button
                  onClick={() => handleStartStop(task.id)}
                  className={`p-2 rounded ${
                    activeTask === task.id && isRunning
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {activeTask === task.id && isRunning ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTracker;