import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CalendarPopup } from "./calendar-popup";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRESET_RANGES = {
  'today': 'Today',
  'yesterday': 'Yesterday',
  'last7days': 'Last 7 Days',
  'last14days': 'Last 14 Days',
  'last30days': 'Last 30 Days',
  'thisWeek': 'This Week',
  'lastWeek': 'Last Week',
  'thisMonth': 'This Month',
  'lastMonth': 'Last Month',
  'thisYear': 'This Year',
  'custom': 'Custom Range'
};

export const DateRangePicker = ({ onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('last30days');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [tempDateRange, setTempDateRange] = useState({ from: null, to: null });
  
  // Calculate preset ranges
  const getPresetDates = (preset) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    switch (preset) {
      case 'today':
        return { from: today, to: today };
      
      case 'yesterday':
        return { from: yesterday, to: yesterday };
      
      case 'last7days': {
        const from = new Date(today);
        from.setDate(today.getDate() - 6);
        return { from, to: today };
      }
      
      case 'last14days': {
        const from = new Date(today);
        from.setDate(today.getDate() - 13);
        return { from, to: today };
      }
      
      case 'last30days': {
        const from = new Date(today);
        from.setDate(today.getDate() - 29);
        return { from, to: today };
      }
      
      case 'thisWeek': {
        const from = new Date(today);
        const day = today.getDay();
        from.setDate(today.getDate() - day); // Start of week (Sunday)
        return { from, to: today };
      }
      
      case 'lastWeek': {
        const to = new Date(today);
        const day = today.getDay();
        to.setDate(today.getDate() - day - 1); // Last Saturday
        const from = new Date(to);
        from.setDate(to.getDate() - 6); // Last Sunday
        return { from, to };
      }
      
      case 'thisMonth': {
        const from = new Date(today.getFullYear(), today.getMonth(), 1);
        return { from, to: today };
      }
      
      case 'lastMonth': {
        const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const to = new Date(today.getFullYear(), today.getMonth(), 0);
        return { from, to };
      }
      
      case 'thisYear': {
        const from = new Date(today.getFullYear(), 0, 1);
        return { from, to: today };
      }
      
      default:
        return { from: null, to: null };
    }
  };
  
  // Initialize with default range (last 30 days)
  useEffect(() => {
    const range = getPresetDates('last30days');
    setDateRange(range);
    setTempDateRange(range);
    if (onChange) {
      onChange(range);
    }
  }, []);
  
  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    
    if (preset !== 'custom') {
      const range = getPresetDates(preset);
      setTempDateRange(range);
      
      // Auto-apply preset ranges
      setDateRange(range);
      setIsOpen(false);
      if (onChange) {
        onChange(range);
      }
    }
  };
  
  const handleDateChange = (date) => {
    // If date is null (user cleared the selection), use default range
    if (!date || !date.from) {
      const defaultRange = getPresetDates('last30days');
      setTempDateRange(defaultRange);
      setDateRange(defaultRange);
      if (onChange) {
        onChange(defaultRange);
      }
      return;
    }
    
    if (!tempDateRange.from || (tempDateRange.from && tempDateRange.to)) {
      // If no start date or both dates selected, set new start date
      const newRange = { from: date.from || date, to: null };
      setTempDateRange(newRange);
      setSelectedPreset('custom');
    } else {
      // If only start date is selected, set end date
      const range = { 
        from: tempDateRange.from, 
        to: date.to || date 
      };
      
      // Swap dates if end date is before start date
      if ((date.to || date) < tempDateRange.from) {
        range.from = date.to || date;
        range.to = tempDateRange.from;
      }
      
      setTempDateRange(range);
      
      // Auto-apply when end date is selected
      setDateRange(range);
      setIsOpen(false);
      if (onChange) {
        onChange(range);
      }
    }
  };
  
  const formatDateRange = () => {
    if (!dateRange.from) {
      return 'Select date range';
    }
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };
    
    if (!dateRange.to || dateRange.from.getTime() === dateRange.to.getTime()) {
      return formatDate(dateRange.from);
    }
    
    return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`;
  };
  
  useEffect(() => {
    if (isOpen && selectedPreset !== 'custom') {
      setTempDateRange(getPresetDates(selectedPreset));
    }
  }, [isOpen, selectedPreset]);
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-auto justify-start text-left font-normal flex items-center"
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span>{formatDateRange()}</span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <Select
            value={selectedPreset}
            onValueChange={handlePresetChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRESET_RANGES).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <CalendarPopup
          mode="range"
          selected={{
            from: tempDateRange.from,
            to: tempDateRange.to,
          }}
          onSelect={handleDateChange}
          defaultMonth={tempDateRange.from}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};