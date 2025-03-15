import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, BarChart } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const NavBar = ({ activePage }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white shadow-sm py-2 px-4 mb-6">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold mr-6">Time Tracker</h1>
          <nav className="flex space-x-2">
            <Button 
              variant={activePage === 'home' ? 'default' : 'ghost'} 
              size="sm"
              className="flex items-center"
              onClick={() => navigate('/')}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button 
              variant={activePage === 'analytics' ? 'default' : 'ghost'} 
              size="sm"
              className="flex items-center"
              onClick={() => navigate('/analytics')}
            >
              <BarChart className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};