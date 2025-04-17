import React, { useMemo, useState, useCallback, useEffect } from 'react';
import useStore from '../store';
import { DynamicIcon } from 'lucide-react/dynamic';
import { getCssVariable } from '../utils/Utils';

const Timeline = ({ startDate, endDate, highlights = [] }) => {
    const { activeDay, updateActiveDayAndStartDate, investmentStartDate } = useStore();
    const [hoverDate, setHoverDate] = useState(null);
    const [showHoverDate, setShowHoverDate] = useState(false);
    const [highlightDetails, setHighlightDetails] = useState(null);
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
    }, [startDate, timelineData.totalDays, highlightDetails]);

    // useEffect(()=>{
    //     console.log("changed hoverDate==", hoverDate);
    // },[hoverDate])
    // Handle timeline click
    const handleTimelineClick = useCallback((e, hDate) => {
        // console.log("handleTimelineClick", e);
        // Only handle click on the timeline line itself, not child elements
        if (e.target !== e.currentTarget) return;

        // const rect = e.currentTarget.getBoundingClientRect();
        // const clickY = e.clientY - rect.top;
        // const percentage = 100 - (clickY / rect.height) * 100;

        // const start = new Date(startDate);
        // const daysToAdd = Math.round((percentage / 100) * timelineData.totalDays);
        // const clickedDate = new Date(start);
        // clickedDate.setDate(start.getDate() + daysToAdd);

        // setActiveDay(clickedDate);
        updateActiveDayAndStartDate(investmentStartDate, hDate);
    }, [startDate, timelineData.totalDays, updateActiveDayAndStartDate]);

    // Handle timeline hover
    const handleTimelineHover = useCallback((e) => {
        // Only handle hover on the timeline line itself, not child elements
        if (e.target !== e.currentTarget) return;
        setShowHoverDate(true);

        const rect = e.currentTarget.getBoundingClientRect();
        const hoverY = e.clientY - rect.top;
        const percentage = 100 - (hoverY / rect.height) * 100;

        const start = new Date(startDate);
        const daysToAdd = Math.round((percentage / 100) * timelineData.totalDays);
        const hoveredDate = new Date(start);
        hoveredDate.setDate(start.getDate() + daysToAdd);

        setHoverDate(hoveredDate);
    }, [startDate, timelineData.totalDays]);

    const showHighlightDetails = useCallback((index, highlight, e) => {
        //console.log("showHighlightDetails", index, highlight, e);
        // Only handle click on the highlight itself, not child elements
        if (e.target !== e.currentTarget) return;
        highlight.index = index;
        setHighlightDetails(highlight);
    }, [])
    

    return (
        <div className="relative w-full h-[980px] flex items-center justify-center my-5">
            {/* Timeline line */}
            <div
                className="absolute w-[4px] dark:bg-gray-300 bg-gray-400 h-full cursor-pointer rounded-full"
                // onClick={handleTimelineClick}
                onMouseMove={handleTimelineHover}
                onMouseLeave={() => setShowHoverDate(false)}
            >
                {/* Active day indicator */}
                {activeDay && (
                    <div
                        className="absolute left-1/2 transform -translate-x-1/2 w-42 h-[2px] dark:bg-violet-200 bg-violet-300 rounded-full cursor-default"
                        style={{ top: `${getPositionForDate(activeDay)}%` }}
                    >
                        <div className="font-bold w-16 absolute left-36 top-1/2 transform -translate-y-1/2 text-sm dark:text-violet-400 text-violet-600">
                            {formatDate(activeDay)}
                        </div>
                    </div>
                )}

                {/* Year markers */}
                {timelineData.years.map(({ year, position }) => (
                    <div
                        key={year}
                        className="absolute left-1/2 transform -translate-x-1/2 w-16 h-[1px] dark:bg-gray-400 bg-gray-300 rounded-full cursor-default"
                        style={{ top: `${position}%` }}
                    >
                        <div className="absolute right-20 top-1/2 transform -translate-y-1/2 text-sm dark:text-gray-400 text-gray-600">
                            {year}
                        </div>
                    </div>
                ))}

                {/* Highlights */}
                {highlights.map((highlight, index) => {
                    const position = getPositionForDate(new Date(highlight.date));
                    return (
                        <div
                            key={index}
                            className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 rounded-full bg-blue-400 cursor-default group"
                            style={{ top: `${position}%` }}
                        >
                            <div className={`absolute ${index % 2 == 0 ? "left-1" : "right-1"} transform -translate-y-1/2 flex items-center gap-1 rounded-[4px] p-2 cursor-pointer`}
                            >
                                {/* <span className="text-sm font-medium text-white">{highlight.highlightName}</span> */}
                                {/* {index % 2 == 1 && <div className="text-xs font-medium dark:text-white text-black">{highlight.highlightName}</div>} */}
                                <DynamicIcon 
                                // onClick={(e)=>showHighlightDetails(index, highlight, e)}
                            onMouseMove={(e)=>showHighlightDetails(index, highlight, e)}
                            onMouseLeave={() => setHighlightDetails(null)}
                                name={highlight.icon} size={24} fill={getCssVariable(`--color-${highlight.iconColor}`)} strokeWidth={0} />
                                {/* {index % 2 == 0 && <div className="text-xs font-medium dark:text-white text-black">{highlight.highlightName}</div>} */}
                            </div>
                            {/* <div className="absolute left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white p-2 rounded shadow-lg text-sm">
                <div className="font-semibold">{highlight.highlightName}</div>
                <div className="text-gray-600">{formatDate(new Date(highlight.date))}</div>
                <div className="text-gray-500">{highlight.description}</div>
              </div>
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 flex items-center gap-2 border border-gray-300 rounded-[4px] p-2 bg-green-500/50">
                <span className="text-sm font-medium text-white">{highlight.highlightName}</span>
                {highlight.icon && (
                  <span className="text-lg">{highlight.icon}</span>
                )}
              </div> */}
                        </div>
                    );
                })}

                {/* Hover indicator */}
                {showHoverDate &&hoverDate && (
                    <div
                    onClick={(e)=>handleTimelineClick(e, hoverDate)}
                        className="absolute left-1/2 transform -translate-x-1/2 w-3 h-1 dark:bg-gray-400 bg-gray-700 rounded-full"
                        style={{ top: `${getPositionForDate(hoverDate)}%` }}
                    >
                        <div className="w-24 absolute left-6 top-1/2 transform -translate-y-1/2 text-sm dark:text-gray-300 text-gray-600">
                            {formatDate(hoverDate)}
                        </div>
                    </div>
                )}
                
                {highlightDetails && (
                    <div className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-1 bg-${highlightDetails.iconColor} rounded-full`}
                        style={{ top: `${getPositionForDate(new Date(highlightDetails.date))}%` }}
                    >
                        <div className={`w-36 absolute ${highlightDetails.index % 2 == 0 ? "left-3" : "right-3"} bottom-4 transform text-sm dark:text-gray-900 text-gray-900 rounded-[4px] p-2 bg-${highlightDetails.iconColor}`}>
                        <div className="font-semibold">
                            {highlightDetails.highlightName}
                            </div>
                            <div>
                            {highlightDetails.description}
                            </div>
                            <div className="text-xs font-bold">
                            {formatDate(new Date(highlightDetails.date))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Timeline;