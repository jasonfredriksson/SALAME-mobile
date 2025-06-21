import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { View, StyleSheet, Dimensions } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <View style={styles.container}>
      <Stack 
        screenOptions={{
          headerShown: false,
          contentStyle: styles.stackContent,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 500, // Enforcing mobile width
    alignSelf: 'center',
    overflow: 'hidden'
  },
  stackContent: {
    width: '100%',
    height: '100%',
    maxWidth: 500
  }
});
