import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Clock, Check, X, MessageCircle, Tag } from 'lucide-react-native';
import { mockProducts } from '@/data/mockData';

type OfferStatus = 'pending' | 'accepted' | 'rejected';

interface Offer {
  id: string;
  productId: string;
  originalPrice: number;
  offerAmount: number;
  createdAt: string;
  status: OfferStatus;
  product: any; // Using any here for simplicity, but in a real app we'd define a proper Product type
}

// This would normally come from an API or local storage
// For the demo, we're creating a mock pending offer
const MOCK_OFFERS: Offer[] = [
  {
    id: '1',
    productId: mockProducts[0].id,
    originalPrice: mockProducts[0].price,
    offerAmount: mockProducts[0].price * 0.85,
    createdAt: '2025-06-08T18:30:00Z',
    status: 'pending', // pending, accepted, rejected
    product: mockProducts[0],
  },
  {
    id: '2',
    productId: mockProducts[2].id,
    originalPrice: mockProducts[2].price,
    offerAmount: mockProducts[2].price * 0.9,
    createdAt: '2025-06-07T14:45:00Z',
    status: 'accepted',
    product: mockProducts[2],
  },
  {
    id: '3',
    productId: mockProducts[3].id,
    originalPrice: mockProducts[3].price,
    offerAmount: mockProducts[3].price * 0.7,
    createdAt: '2025-06-06T09:15:00Z',
    status: 'rejected',
    product: mockProducts[3],
  }
];

const getStatusColor = (status: OfferStatus) => {
  switch(status) {
    case 'pending': return '#9F7AEA'; // Light purple
    case 'accepted': return '#10B981'; // Green
    case 'rejected': return '#EF4444'; // Red
    default: return '#9F7AEA';
  }
};

const getStatusIcon = (status: OfferStatus) => {
  switch(status) {
    case 'pending': return <Clock size={16} color="#9F7AEA" />;
    case 'accepted': return <Check size={16} color="#10B981" />;
    case 'rejected': return <X size={16} color="#EF4444" />;
    default: return <Clock size={16} color="#9F7AEA" />;
  }
};

const getStatusText = (status: OfferStatus) => {
  switch(status) {
    case 'pending': return 'Pendiente';
    case 'accepted': return 'Aceptada';
    case 'rejected': return 'Rechazada';
    default: return 'Pendiente';
  }
};

export default function MyOffersScreen() {
  const router = useRouter();
  const [offers] = useState(MOCK_OFFERS);
  const [activeTab, setActiveTab] = useState('all'); // all, pending, accepted, rejected

  const filteredOffers = activeTab === 'all' 
    ? offers 
    : offers.filter((offer: Offer) => offer.status === activeTab);

  const renderOfferItem = ({ item }: { item: Offer }) => {
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);
    const statusText = getStatusText(item.status);
    const discountPercent = ((1 - (item.offerAmount / item.originalPrice)) * 100).toFixed(0);
    
    return (
      <TouchableOpacity 
        style={styles.offerCard}
        onPress={() => router.push(`/product/${item.productId}`)}
      >
        <View style={styles.offerHeader}>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            {statusIcon}
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          </View>
          <Text style={styles.offerDate}>
            {new Date(item.createdAt).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </Text>
        </View>
        
        <View style={styles.productInfo}>
          <Image source={{ uri: item.product.images[0] }} style={styles.productImage} />
          <View style={styles.productDetails}>
            <Text style={styles.productTitle} numberOfLines={1}>{item.product.title}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.originalPrice}>${item.originalPrice.toFixed(2)}</Text>
              <View style={styles.offerBadge}>
                <Tag size={10} color="#6B46C1" />
                <Text style={styles.offerBadgeText}>-{discountPercent}%</Text>
              </View>
            </View>
            <Text style={styles.offerAmount}>Tu oferta: ${item.offerAmount.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.offerFooter}>
          {item.status === 'pending' ? (
            <View style={styles.pendingInfo}>
              <Clock size={14} color="#9F7AEA" />
              <Text style={styles.pendingText}>Esperando respuesta del vendedor</Text>
            </View>
          ) : item.status === 'accepted' ? (
            <View style={styles.acceptedInfo}>
              <Check size={14} color="#10B981" />
              <Text style={styles.acceptedText}>¡Oferta aceptada! Procede al pago</Text>
            </View>
          ) : (
            <View style={styles.rejectedInfo}>
              <X size={14} color="#EF4444" />
              <Text style={styles.rejectedText}>Oferta rechazada</Text>
            </View>
          )}
          
          <View style={styles.actionButtons}>
            {item.status === 'pending' && (
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => alert('La cancelación de ofertas estará disponible en la versión final')}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => router.push(`/chat/new?productId=${item.productId}&sellerId=${item.product.sellerId}`)}
            >
              <MessageCircle size={14} color="#FFFFFF" />
              <Text style={styles.contactButtonText}>Contactar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>Mis ofertas</Text>
        <View style={{ width: 40 }} /> {/* Spacer for alignment */}
      </View>
      
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text 
              style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}
            >
              Todas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
            onPress={() => setActiveTab('pending')}
          >
            <Text 
              style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}
            >
              Pendientes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'accepted' && styles.activeTab]}
            onPress={() => setActiveTab('accepted')}
          >
            <Text 
              style={[styles.tabText, activeTab === 'accepted' && styles.activeTabText]}
            >
              Aceptadas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'rejected' && styles.activeTab]}
            onPress={() => setActiveTab('rejected')}
          >
            <Text 
              style={[styles.tabText, activeTab === 'rejected' && styles.activeTabText]}
            >
              Rechazadas
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {filteredOffers.length > 0 ? (
        <FlatList
          data={filteredOffers}
          renderItem={renderOfferItem}
          keyExtractor={(item: Offer) => item.id}
          contentContainerStyle={styles.offersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Tag size={48} color="#9F7AEA" />
          <Text style={styles.emptyStateTitle}>No hay ofertas</Text>
          <Text style={styles.emptyStateText}>
            {activeTab === 'all' 
              ? 'No has realizado ninguna oferta todavía.'
              : activeTab === 'pending'
                ? 'No tienes ofertas pendientes.'
                : activeTab === 'accepted'
                  ? 'No tienes ofertas aceptadas.'
                  : 'No tienes ofertas rechazadas.'}
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.browseButtonText}>Explorar productos</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    fontWeight: '700',
    color: '#0F172A',
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabs: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  activeTab: {
    backgroundColor: '#6B46C1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  offersList: {
    padding: 12,
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  offerDate: {
    fontSize: 12,
    color: '#64748B',
  },
  productInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  offerBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B46C1',
    marginLeft: 2,
  },
  offerAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B46C1',
  },
  offerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  pendingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pendingText: {
    fontSize: 13,
    color: '#9F7AEA',
    marginLeft: 6,
  },
  acceptedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  acceptedText: {
    fontSize: 13,
    color: '#10B981',
    marginLeft: 6,
  },
  rejectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rejectedText: {
    fontSize: 13,
    color: '#EF4444',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#9F7AEA',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 12,
    color: '#9F7AEA',
    fontWeight: '600',
  },
  contactButton: {
    backgroundColor: '#6B46C1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#6B46C1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
