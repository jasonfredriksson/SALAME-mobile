import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { useColorScheme } from '../../hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { WebHeader } from '@/components/WebHeader';
import { Bell, BellOff, BellRing, Check, MessageSquare, ShoppingBag, Tag, Heart } from 'lucide-react-native';

import { mockNotifications } from '@/data/mockData';

type Notification = {
  id: string;
  type: 'offer' | 'message' | 'sale' | 'system' | 'offer_accepted';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedId: string | null;
  relatedImage?: string;
  fromUser?: {
    id: string;
    name: string;
    avatar: string;
  };
};

type NotificationItemProps = {
  notification: Notification;
  onPress: () => void;
};

const NotificationItem = ({ notification, onPress }: NotificationItemProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'offer':
        return <Tag size={20} color="#6B46C1" />;
      case 'message':
        return <MessageSquare size={20} color="#6B46C1" />;
      case 'sale':
        return <ShoppingBag size={20} color="#6B46C1" />;
      case 'system':
        return <Bell size={20} color="#6B46C1" />;
      case 'offer_accepted':
        return <Heart size={20} color="#6B46C1" />;
      default:
        return <Bell size={20} color="#6B46C1" />;
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.timestamp), {
    addSuffix: true,
    locale: es,
  });

  return (
    <TouchableOpacity
      style={[styles.notificationItem, !notification.read && styles.unread]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
        {!notification.read && <View style={styles.unreadDot} />}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>

      {notification.relatedImage && (
        <Image
          source={{ uri: notification.relatedImage }}
          style={styles.relatedImage}
        />
      )}
    </TouchableOpacity>
  );
};

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const [notifications, setNotifications] = useState(mockNotifications as Notification[]);

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification: Notification) => ({
      ...notification,
      read: true,
    }));
    setNotifications(updatedNotifications);
  };

  const handleNotificationPress = (id: string) => {
    const updatedNotifications = notifications.map((notification: Notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);

    // Here you would navigate to the relevant screen based on notification type
    const notification = notifications.find((n: Notification) => n.id === id);
    if (notification?.relatedId) {
      // router.push(`/${notification.type}/${notification.relatedId}`);
      console.log(`Navigate to ${notification.type}/${notification.relatedId}`);
    }
  };

  // Calculate unread count
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <WebHeader showLogo />
      <StatusBar style="auto" />

      <ResponsiveContainer webCentered={true} style={{ maxWidth: 800 }}>
        {/* ResponsiveContainer children prop wrapper */}
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.title}>Notificaciones</Text>
            {unreadCount > 0 && (
              <TouchableOpacity
                style={styles.markReadButton}
                onPress={markAllAsRead}
              >
                <Check size={18} color="#6B46C1" />
                <Text style={styles.markReadText}>Marcar todas como leídas</Text>
              </TouchableOpacity>
            )}
          </View>

          {notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Bell size={60} color="#9CA3AF" />
              <Text style={styles.emptyText}>No tienes notificaciones</Text>
            </View>
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={(item: Notification) => item.id}
              renderItem={({ item }: { item: Notification }) => (
                <NotificationItem
                  notification={item}
                  onPress={() => handleNotificationPress(item.id)}
                />
              )}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ResponsiveContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  markReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  markReadText: {
    marginLeft: 4,
    color: '#6B46C1',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: 'space-between',
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 12,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6B46C1',
  },
  notificationTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  notificationImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
  },
});
