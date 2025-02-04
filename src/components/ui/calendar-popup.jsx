import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "../../lib/utils"

export function CalendarPopup({
  className,
  classNames,
  showOutsideDays = true,
  onSelect,
  selected,
  ...props
}) {
  const today = new Date()

  const handleSelect = (date) => {
    if (onSelect) {
      onSelect(date);
    }
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-white rounded-lg shadow-lg", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 hover:opacity-100",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm relative",
        day: "h-9 w-9 p-0 font-normal hover:bg-gray-100 rounded-full",
        day_selected: "bg-blue-500 text-white hover:bg-blue-600",
        day_today: "bg-yellow-100 font-bold",
        day_outside: "text-gray-400",
        day_disabled: "text-gray-400",
        day_hidden: "invisible",
        ...classNames,
      }}
      selected={selected}
      onSelect={handleSelect}
      today={today}
      {...props}
    />
  )
}

CalendarPopup.displayName = "CalendarPopup"