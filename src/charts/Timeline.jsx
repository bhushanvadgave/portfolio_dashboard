import React, { useMemo, useState, useCallback } from 'react';
import useStore from '../store';

const Timeline = ({ startDate, endDate, highlights = [] }) => {
  const { activeDay, updateActiveDayAndStartDate, investmentStartDate} = useStore();
  const [hoverDate, setHoverDate] = useState(null);

  // Calculate timeline height and year positions
  const timelineData = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const years = [];
    
    for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
      const yearDate = new Date(year, 0, 1);
      if (yearDate >= start && yearDate <= end) {
        const daysFromStart = Math.ceil((yearDate - start) / (1000 * 60 * 60 * 24));
        const position = 100 - (daysFromStart / totalDays) * 100;
        years.push({ year, position });
      }
    }

    return { totalDays, years };
  }, [startDate, endDate]);

  // Format date to Apr 14, 2025 format
  const formatDate = useCallback((date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, []);

  // Calculate position for a given date
  const getPositionForDate = useCallback((date) => {
    const start = new Date(startDate);
    const daysFromStart = Math.ceil((date - start) / (1000 * 60 * 60 * 24));
    return 100 - (daysFromStart / timelineData.totalDays) * 100;
  }, [startDate, timelineData.totalDays]);

  // Handle timeline click
  const handleTimelineClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const percentage = 100 - (clickY / rect.height) * 100;
    
    const start = new Date(startDate);
    const daysToAdd = Math.round((percentage / 100) * timelineData.totalDays);
    const clickedDate = new Date(start);
    clickedDate.setDate(start.getDate() + daysToAdd);
    
    // setActiveDay(clickedDate);
    updateActiveDayAndStartDate(investmentStartDate, clickedDate);
  }, [startDate, timelineData.totalDays, updateActiveDayAndStartDate]);

  // Handle timeline hover
  const handleTimelineHover = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const hoverY = e.clientY - rect.top;
    const percentage = 100 - (hoverY / rect.height) * 100;
    
    const start = new Date(startDate);
    const daysToAdd = Math.round((percentage / 100) * timelineData.totalDays);
    const hoveredDate = new Date(start);
    hoveredDate.setDate(start.getDate() + daysToAdd);
    
    setHoverDate(hoveredDate);
  }, [startDate, timelineData.totalDays]);

  return (
    <div className="relative w-full h-[950px] flex items-center justify-center">
      {/* Timeline line */}
      <div 
        className="absolute w-[5px] bg-gray-300 h-full cursor-pointer rounded-full"
        onClick={handleTimelineClick}
        onMouseMove={handleTimelineHover}
        onMouseLeave={() => setHoverDate(null)}
      >
        {/* Active day indicator */}
        {activeDay && (
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-5 h-[3px] bg-blue-500"
            style={{ top: `${getPositionForDate(activeDay)}%` }}
          >
            <div className="font-bold w-24 absolute left-7 top-1/2 transform -translate-y-1/2 text-sm text-blue-400">
              {formatDate(activeDay)}
            </div>
          </div>
        )}

        {/* Year markers */}
        {timelineData.years.map(({ year, position }) => (
          <div 
            key={year}
            className="absolute left-1/2 transform -translate-x-1/2 w-3 h-[2px] bg-gray-400"
            style={{ top: `${position}%` }}
          >
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
              {year}
            </div>
          </div>
        ))}

        {/* Highlights */}
        {highlights.map((highlight) => {
          const position = getPositionForDate(new Date(highlight.date));
          return (
            <div 
              key={highlight.date}
              className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-yellow-400 cursor-pointer group"
              style={{ top: `${position}%` }}
            >
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white p-2 rounded shadow-lg text-sm">
                <div className="font-semibold">{highlight.highlightName}</div>
                <div className="text-gray-600">{formatDate(new Date(highlight.date))}</div>
                <div className="text-gray-500">{highlight.description}</div>
              </div>
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 flex items-center gap-2 border border-gray-300 rounded-[4px] p-2 bg-green-500/50">
                <span className="text-sm font-medium text-white">{highlight.highlightName}</span>
                {highlight.icon && (
                  <span className="text-lg">{highlight.icon}</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Hover indicator */}
        {hoverDate && (
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-400"
            style={{ top: `${getPositionForDate(hoverDate)}%` }}
          >
            <div className="w-24 absolute left-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-300">
              {formatDate(hoverDate)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;