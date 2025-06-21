import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft, Send, MessageSquare } from 'lucide-react-native';
import { mockProducts, mockUser, mockConversations } from '@/data/mockData';

export default function NewChatScreen() {
  const { productId, sellerId } = useLocalSearchParams();
  const router = useRouter();
  
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  
  // Simulate loading data
  useEffect(() => {
    // Simulate a network request
    const timer = setTimeout(() => {
      if (productId) {
        const foundProduct = mockProducts.find(p => p.id === productId);
        setProduct(foundProduct);
        
        // If we have a product, we can find the seller too
        if (foundProduct) {
          setSeller(foundProduct.seller);
        }
      } else if (sellerId) {
        // If we only have sellerId, try to find a seller
        const foundProduct = mockProducts.find(p => p.sellerId === sellerId);
        if (foundProduct) {
          setSeller(foundProduct.seller);
        }
      }
      
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [productId, sellerId]);
  
  const startConversation = () => {
    if (message.trim() === '') return;
    
    // Generate a new conversation ID
    const newConversationId = `conv-${Date.now()}`;
    
    // Create a new message
    const newMessage = {
      id: `msg-${Date.now()}`,
      text: message,
      timestamp: new Date().toISOString(),
      senderId: mockUser.id,
      isRead: false,
    };
    
    // In a real app, we would save this conversation to the database
    // For this demo, we'll simulate by navigating to an existing chat
    // and using the mock messages there
    
    // Navigate to the chat screen
    // In a real app, we would navigate to the newly created conversation
    // For this demo, we'll navigate to the first mock conversation
    router.replace(`/chat/${mockConversations[0].id}`);
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nuevo mensaje</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6B46C1" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!seller) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nuevo mensaje</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Vendedor no encontrado</Text>
          <TouchableOpacity
            style={styles.backToButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backToButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Image source={{ uri: seller.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.username}>{seller.name}</Text>
              {product && (
                <Text style={styles.productTitle} numberOfLines={1}>
                  {product.title}
                </Text>
              )}
            </View>
          </View>
          <View style={{ width: 40 }} />
        </View>
        
        <ScrollView style={styles.contentContainer}>
          {product && (
            <View style={styles.productCard}>
              <Image source={{ uri: product.images[0] }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{product.title}</Text>
                <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
              </View>
            </View>
          )}
          
          <View style={styles.messageStartContainer}>
            <View style={styles.iconContainer}>
              <MessageSquare size={28} color="#6B46C1" />
            </View>
            <Text style={styles.startTitle}>
              {product 
                ? 'Consulta sobre este producto'
                : 'Nuevo mensaje para el vendedor'}
            </Text>
            <Text style={styles.startSubtitle}>
              Escribe tu mensaje para iniciar la conversación
            </Text>
          </View>
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un mensaje..."
              value={message}
              onChangeText={setMessage}
              multiline
              placeholderTextColor="#94A3B8"
            />
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled,
            ]}
            onPress={startConversation}
            disabled={!message.trim()}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5FF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8FF',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  productTitle: {
    fontSize: 12,
    color: '#64748B',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B46C1',
  },
  messageStartContainer: {
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  startTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  startSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3E8FF',
  },
  textInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
  },
  input: {
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6B46C1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  backToButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
