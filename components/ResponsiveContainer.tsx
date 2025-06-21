import React from 'react';
import { View, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';

interface ResponsiveContainerProps {  
  style?: any;
  children: any;
  mobileFullWidth?: boolean;
  scrollable?: boolean;
  contentContainerStyle?: any;
  webCentered?: boolean; // Keeping for backward compatibility
}

/**
 * A wrapper component optimized for mobile view.
 * This component ensures proper scrolling and responsive layout for mobile devices.
 */
export function ResponsiveContainer({
  children,
  mobileFullWidth = true,
  scrollable = true,
  style,
  contentContainerStyle,
  webCentered = false // Ignored in mobile-only mode
}: ResponsiveContainerProps) {
  // Force mobile dimensions regardless of device
  const windowWidth = Dimensions.get('window').width;
  
  // Set appropriate styles for mobile
  const viewStyles = [
    styles.container,
    { maxWidth: 500 }, // Cap width for better mobile experience
    style
  ];
  
  const contentStyles = [
    mobileFullWidth ? styles.fullWidth : styles.mobilePadded,
    scrollable ? styles.mobileContainer : null,
    contentContainerStyle
  ];
  
  // Use ScrollView for scrollable content or View for fixed content
  if (scrollable) {
    return (
      <ScrollView 
        style={viewStyles}
        contentContainerStyle={contentStyles}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        removeClippedSubviews={true}
      >
        {children}
      </ScrollView>
    );
  } else {
    return (
      <View style={[...viewStyles, ...contentStyles]}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center', // Center the container
  },
  fullWidth: {
    width: '100%',
  },
  mobilePadded: {
    paddingHorizontal: 16,
    width: '100%',
  },
  mobileContainer: {
    paddingBottom: 80, // Additional padding at the bottom for tab bar
  }
});
