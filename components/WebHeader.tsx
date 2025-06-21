import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, User, Heart, BellDot } from 'lucide-react-native';

interface WebHeaderProps {
  showLogo?: boolean;
}

export function WebHeader({ showLogo = true }: WebHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showLogo && (
          <TouchableOpacity 
            style={styles.logoContainer} 
            onPress={() => router.push('/')}
          >
            <ShoppingBag size={24} color="#6B46C1" />
            <Text style={styles.logoText}>SALAME</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.center}>
          <Text style={styles.slogan}>Marketplace de segunda mano para Argentina</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/favorites')}
          >
            <Heart size={20} color="#6B46C1" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/notifications')}
          >
            <BellDot size={20} color="#6B46C1" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.userButton}
            onPress={() => router.push('/profile')}
          >
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=600' }} 
              style={styles.userAvatar} 
            />
            <Text style={styles.userName}>Lucía F.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: '100%',
    maxWidth: 1200,
    marginHorizontal: 'auto',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#6B46C1',
    marginLeft: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  slogan: {
    fontSize: 15,
    color: '#64748B',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  userButton: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginLeft: 12,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B46C1',
    marginLeft: 6,
    marginRight: 8,
  },
});
