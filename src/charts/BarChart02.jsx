import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';

import { chartColors } from './ChartjsConfig';
import {
  Chart, BarController, BarElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale
} from 'chart.js';
import 'chartjs-adapter-moment';
// Import utilities
import { getCssVariable } from '../utils/Utils';

// Import utilities
import { formatValue, formatDecimal, formatDecimal2 } from '../utils/Utils';


Chart.register(BarController, BarElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale);

function BarChart02({
  data,
  width,
  height
}) {

  const [chart, setChart] = useState(null)
  const canvas = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;


  const doubleLabels={
    id: 'doubleLabels',
    afterDatasetsDraw: (chart, args, options) => {
      const { ctx, data } = chart;
      ctx.save();
     chart.getDatasetMeta(0).data.forEach((datapoint, index) => {
      // ctx.textAlign = 'right';
      // ctx.textBaseline = 'middle';
      // ctx.font = 'bold 16px sans-serif';
      // ctx.fillStyle = getCssVariable('--color-gray-900');
      // ctx.fillText(data.datasets[0].data[index], datapoint.x-6, datapoint.y);


      ctx.textAlign = data.datasets[0].data[index] > 0 ? 'left' : 'right';
      ctx.textBaseline = 'middle';

      ctx.font = '0.875rem Inter", "sans-serif';
      ctx.fillStyle = getCssVariable(data.datasets[0].data[index] >= 0 ? '--color-green-700':'--color-red-700');
      ctx.fillText(`${formatDecimal2(data.datasets[0].data[index])}%`, datapoint.x + (data.datasets[0].data[index] >= 0 ? 6 : -6), datapoint.y);

     })
    }
  }

  useEffect(() => {
    const ctx = canvas.current;
    // eslint-disable-next-line no-unused-vars
    const newChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        indexAxis: 'y',
        responsive: true,
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each horizontal bar to be 2px wide
        scales: {
          y: {
            // stacked: true,
            // display: false,
            // title: {
            //   display: true,
            //   text: 'Asset Type'
            // // },
            border: {
              display: false,
            },
            ticks: {
              // autoSkip: false,
              // maxTicksLimit: 5,
              // callback: (value) => value,
              font: {
                size: 14,         // 👈 font size
                // weight: 'bold'    // Optional: bold text
              },
              color: darkMode ? textColor.dark : textColor.light,
            },
            grid: {
              color: darkMode ? gridColor.dark : gridColor.light,
            },
            // beginAtZero: true,
          },
          x: {
            stacked: true,
            type: 'linear',
            min: data.datasets[0].data.some(d=>d<0) ? Math.min(...data.datasets[0].data)-15 : undefined,
            max: data.datasets[0].data.some(d=>d>0) ? Math.max(...data.datasets[0].data)+15 : undefined,
            // grace: 5,
            // time: {
            //   parser: 'YYYY-MM',
            //   unit: 'month',
            // },
            title: {
              display: false,
              text: 'Return (%)'
            },
            border: {
              display: false,
            },
            display: true,
            grid: {
              display: false,
            },
            ticks: {
              autoSkipPadding: 48,
              maxRotation: 0,
              color: darkMode ? textColor.dark : textColor.light,
            }
          },
        },
        layout: {
          padding: {
            top: 12,
            bottom: 16,
            left: 20,
            right: 20,
          },
        },
        // elements: {
        //   bar: {
        //     borderWidth: 2,
        //   }
        // },
        // responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
            // callbacks: {
            //   title: () => false,
            //   label: (context) => formatValue(context.parsed.y),
            // },
            // bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            // backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            // borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
          interaction: {
            intersect: false,
            mode: 'nearest',
          },
          animation: {
            duration: 200,
          },
          maintainAspectRatio: false,
          resizeDelay: 200,
        }
      },
      plugins: [doubleLabels]
    });
    setChart(newChart);
    return () => newChart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!chart) return;

    if (darkMode) {
      chart.options.scales.x.ticks.color = textColor.dark;
      chart.options.scales.y.ticks.color = textColor.dark;
      chart.options.scales.y.grid.color = gridColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.scales.x.ticks.color = textColor.light;
      chart.options.scales.y.ticks.color = textColor.light;
      chart.options.scales.y.grid.color = gridColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chart.update('none');
  }, [currentTheme]);

  return (
    <canvas ref={canvas} width={width} height={height}></canvas>
  );
}

export default BarChart02;