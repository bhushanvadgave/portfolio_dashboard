export const formatValue = (value) => {
  if(value === 0 || value === null || value === undefined) {
    return "₹0";
  }
  const absValue = Math.abs(value);
  let formattedValue;

  if (absValue >= 10000000) { // For crores (≥1Cr)
    formattedValue = `${value<0 ? "-" : ""}₹${Number.isInteger(absValue / 10000000) ? (absValue / 10000000).toFixed(0) : (absValue / 10000000).toFixed(1)}Cr`;
  } else if (absValue >= 100000) { // For lakhs (≥1L)
    formattedValue = `${value<0 ? "-" : ""}₹${Number.isInteger(absValue / 100000) ? (absValue / 100000).toFixed(0) : (absValue / 100000).toFixed(1)}L`;
  } else if (absValue >= 1000) { // For thousands (≥1K)
    formattedValue = `${value<0 ? "-" : ""}₹${Number.isInteger(absValue / 1000) ? (absValue / 1000).toFixed(0) : (absValue / 1000).toFixed(1)}K`;
  } else { // For values less than 1000
    formattedValue = `${value<0 ? "-" : ""}₹${Number.isInteger(absValue) ? absValue.toFixed(0) : absValue.toFixed(1)}`;
  }

  return formattedValue;
};

// export const formatValue = (value) => Intl.NumberFormat('en-IN', {
//   style: 'currency',
//   currency: 'INR',
//   maximumSignificantDigits: 3,
//   style: 'compact',
//   notation: 'compact',
// }).format(value);

export const formatValue2 = (value) => Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  // notation: 'standard',
  // roundingMode: 'ceil',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(value);

export const formatDecimal = (value, removeSign = false) => Intl.NumberFormat('en-IN', {
  maximumSignificantDigits: 2,
  notation: 'compact',
  maximumFractionDigits:2
}).format(removeSign ? Math.abs(value) : value);

export const formatDecimal2 = (value, removeSign = false) => Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
}).format(removeSign ? Math.abs(value) : value);

export const formatThousands = (value) => Intl.NumberFormat('en-IN', {
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value);

export const getCssVariable = (variable) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

const adjustHexOpacity = (hexColor, opacity) => {
  // Remove the '#' if it exists
  hexColor = hexColor.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Return RGBA string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const adjustHSLOpacity = (hslColor, opacity) => {
  // Convert HSL to HSLA
  return hslColor.replace('hsl(', 'hsla(').replace(')', `, ${opacity})`);
};

const adjustOKLCHOpacity = (oklchColor, opacity) => {
  // Add alpha value to OKLCH color
  return oklchColor.replace(/oklch\((.*?)\)/, (match, p1) => `oklch(${p1} / ${opacity})`);
};

export const adjustColorOpacity = (color, opacity) => {
  if (color.startsWith('#')) {
    return adjustHexOpacity(color, opacity);
  } else if (color.startsWith('hsl')) {
    return adjustHSLOpacity(color, opacity);
  } else if (color.startsWith('oklch')) {
    return adjustOKLCHOpacity(color, opacity);
  } else {
    throw new Error('Unsupported color format');
  }
};

export const oklchToRGBA = (oklchColor) => {
  // Create a temporary div to use for color conversion
  const tempDiv = document.createElement('div');
  tempDiv.style.color = oklchColor;
  document.body.appendChild(tempDiv);
  
  // Get the computed style and convert to RGB
  const computedColor = window.getComputedStyle(tempDiv).color;
  document.body.removeChild(tempDiv);
  
  return computedColor;
};