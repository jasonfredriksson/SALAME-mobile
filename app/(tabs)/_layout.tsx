import { Tabs } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { Chrome as Home, Search, CirclePlus as PlusCircle, MessageSquare, User, BellDot, Tag } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6B46C1', // Púrpura corporativo
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
        tabBarShowLabel: false, // Hide default labels to avoid duplication
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <View style={styles.tabIconContainer}>
              <Home size={size} color={color} />
              <Text style={[styles.tabBarLabel, { color }]}>Inicio</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <View style={styles.tabIconContainer}>
              <Search size={size} color={color} />
              <Text style={[styles.tabBarLabel, { color }]}>Explorar</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <View style={styles.tabIconContainer}>
              <BellDot size={size} color={color} />
              <Text style={[styles.tabBarLabel, { color }]}>Notificaciones</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: 'Ofertas',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <View style={styles.tabIconContainer}>
              <Tag size={size} color={color} />
              <Text style={[styles.tabBarLabel, { color }]}>Ofertas</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Vender',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <View style={styles.tabIconContainer}>
              <PlusCircle size={size} color={color} />
              <Text style={[styles.tabBarLabel, { color }]}>Vender</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Mensajes',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <View style={styles.tabIconContainer}>
              <MessageSquare size={size} color={color} />
              <Text style={[styles.tabBarLabel, { color }]}>Mensajes</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <View style={styles.tabIconContainer}>
              <User size={size} color={color} />
              <Text style={[styles.tabBarLabel, { color }]}>Perfil</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#F3E8FF',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 70, // Taller bar to accommodate custom icons with text
  },
  tabBarLabel: {
    fontSize: 9, // Even smaller text for better fit
    fontWeight: '600',
    marginTop: 4, // Space between icon and text
    lineHeight: 12,
  },
  tabBarItem: {
    height: 70,
    paddingVertical: 8,
  },
  tabIconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
});