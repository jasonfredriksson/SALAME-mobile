import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { mockConversations } from '@/data/mockData';

// Definición de tipos
interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  product: {
    id: string;
    title: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    senderId: string;
  };
  unread: number;
  messages: {
    id: string;
    text: string;
    timestamp: string;
    senderId: string;
    isRead: boolean;
  }[];
}

export default function MessagesScreen() {
  const router = useRouter();
  const [conversations, setConversations] = useState(mockConversations as Conversation[]);

  const navigateToChat = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };

  const renderTimeAgo = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    // Convertir las fechas a números para la operación aritmética
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'ahora mismo';
    if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `hace ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'ayer';
    if (diffInDays < 7) return `hace ${diffInDays} días`;
    
    return messageTime.toLocaleDateString('es-AR');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensajes</Text>
      </View>

      {conversations.length > 0 ? (
        <FlatList<Conversation>
          data={conversations}
          keyExtractor={(item: Conversation) => item.id}
          renderItem={({ item }: { item: Conversation }) => (
            <TouchableOpacity
              style={styles.conversationItem}
              onPress={() => navigateToChat(item.id)}
            >
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: item.user.avatar }}
                  style={styles.avatar}
                />
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </View>
              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.username}>{item.user.name}</Text>
                  <Text style={styles.timeAgo}>{renderTimeAgo(item.lastMessage.timestamp)}</Text>
                </View>
                <Text style={styles.productTitle}>
                  Re: {item.product.title}
                </Text>
                <Text
                  style={[
                    styles.lastMessage,
                    item.unread > 0 && styles.unreadMessage,
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage.text}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Aún no hay mensajes</Text>
          <Text style={styles.emptyMessage}>
            Cuando tengas conversaciones con otros usuarios, aparecerán aquí.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E8FF',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8FF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#0072CE',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  timeAgo: {
    fontSize: 12,
    color: '#666666',
  },
  productTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666666',
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});