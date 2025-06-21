import { Dimensions, Platform, PixelRatio, ScaledSize as RNScaledSize } from 'react-native';
import { useEffect, useState } from 'react';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions we're designing for
const baseWidth = 375; // Standard iPhone width
const baseHeight = 812; // Standard iPhone height

// Calculate normalized scale based on screen width
export const scale = (size: number): number => {
  return (SCREEN_WIDTH / baseWidth) * size;
};

// Calculate vertical scale based on screen height
export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / baseHeight) * size;
};

// Combination of both scales for moderate impact
export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

// Function to convert pt to px (useful for font sizes)
export const normalize = (size: number): number => {
  const newSize = scale(size);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

// Convert percentage string to numerical value
export const percentToDecimal = (percent: string): number => {
  return parseFloat(percent) / 100;
};

// Hook to get current window dimensions and respond to changes
export function useDimensions() {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = ({ window }: { window: any }) => {
      setDimensions(window);
    };

    Dimensions.addEventListener('change', onChange);
    
    return () => {
      // React Native changed the API in newer versions
      if (Dimensions.removeEventListener) {
        Dimensions.removeEventListener('change', onChange);
      } else {
        // Modern approach for newer RN versions
        const subscription = Dimensions.addEventListener('change', onChange);
        return () => subscription.remove();
      }
    };
  }, []);

  return {
    width: dimensions.width,
    height: dimensions.height,
    isLandscape: dimensions.width > dimensions.height,
    isTablet: dimensions.width >= 768,
    isDesktop: dimensions.width >= 1024,
    isMobile: dimensions.width < 768,
  };
}

// Media query style functions
export const getResponsiveStyles = (base: any, options: any = {}) => {
  const dimensions = useDimensions();
  
  if (dimensions.isDesktop && options.desktop) {
    return { ...base, ...options.desktop };
  } else if (dimensions.isTablet && options.tablet) {
    return { ...base, ...options.tablet };
  } else if (options.mobile) {
    return { ...base, ...options.mobile };
  }
  
  return base;
};

export default {
  scale,
  verticalScale,
  moderateScale,
  normalize,
  useDimensions,
  getResponsiveStyles,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};
