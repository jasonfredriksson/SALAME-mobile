import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { WebHeader } from '@/components/WebHeader';
import { ArrowDown, ArrowUp, Check, MessageSquare, X, Tag } from 'lucide-react-native';

import { mockOffers } from '@/data/mockData';

type OfferStatus = 'pending' | 'accepted' | 'rejected';

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
};

type User = {
  id: string;
  name: string;
  avatar: string;
};

type Offer = {
  id: string;
  type: 'sent' | 'received';
  product: Product;
  seller?: User;
  buyer?: User;
  offerPrice: number;
  offerDate: string;
  status: OfferStatus;
  message?: string;
};

type OfferItemProps = {
  offer: Offer;
  onPress: () => void;
};

const OfferStatusBadge = ({ status }: { status: OfferStatus }) => {
  let color = '';
  let backgroundColor = '';
  let text = '';
  
  switch (status) {
    case 'pending':
      color = '#B45309';
      backgroundColor = '#FEF3C7';
      text = 'Pendiente';
      break;
    case 'accepted':
      color = '#065F46';
      backgroundColor = '#D1FAE5';
      text = 'Aceptada';
      break;
    case 'rejected':
      color = '#991B1B';
      backgroundColor = '#FEE2E2';
      text = 'Rechazada';
      break;
  }
  
  return (
    <View style={[styles.statusBadge, { backgroundColor }]}>
      <Text style={[styles.statusText, { color }]}>{text}</Text>
    </View>
  );
};

const OfferItem = ({ offer, onPress }: OfferItemProps) => {
  const isReceived = offer.type === 'received';
  const priceChangePercentage = Math.abs(
    ((offer.offerPrice - offer.product.price) / offer.product.price) * 100
  ).toFixed(0);
  
  return (
    <TouchableOpacity style={styles.offerItem} onPress={onPress}>
      <View style={styles.offerHeader}>
        <View style={styles.offerTypeContainer}>
          {isReceived ? (
            <ArrowDown size={16} color="#6B46C1" />
          ) : (
            <ArrowUp size={16} color="#6B46C1" />
          )}
          <Text style={styles.offerType}>
            {isReceived ? 'Recibida' : 'Enviada'}
          </Text>
        </View>
        <OfferStatusBadge status={offer.status} />
      </View>
      
      <View style={styles.offerContent}>
        <Image 
          source={{ uri: offer.product.image }} 
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {offer.product.title}
          </Text>
          <Text style={styles.priceInfo}>
            <Text style={styles.originalPrice}>
              ${offer.product.price.toLocaleString()}
            </Text>
            {' → '}
            <Text style={styles.offerPrice}>
              ${offer.offerPrice.toLocaleString()}
            </Text>
            <Text style={styles.discountPercentage}>
              {' '}({offer.offerPrice < offer.product.price ? '-' : '+'}{priceChangePercentage}%)
            </Text>
          </Text>
          <Text style={styles.offerTime}>
            {formatDistanceToNow(new Date(offer.offerDate), {
              addSuffix: true,
              locale: es,
            })}
          </Text>
        </View>
      </View>
      
      {offer.message && (
        <View style={styles.messageContainer}>
          <MessageSquare size={14} color="#6B46C1" />
          <Text style={styles.message} numberOfLines={1}>
            "{offer.message}"
          </Text>
        </View>
      )}
      
      {isReceived && offer.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.acceptButton}>
            <Check size={16} color="white" />
            <Text style={styles.acceptButtonText}>Aceptar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectButton}>
            <X size={16} color="#991B1B" />
            <Text style={styles.rejectButtonText}>Rechazar</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function OffersScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('all' as 'all' | 'sent' | 'received');
  const [offers, setOffers] = useState(mockOffers as Offer[]);
  
  const filteredOffers = offers.filter((offer: Offer) => {
    if (selectedTab === 'all') return true;
    return offer.type === selectedTab;
  });

  const handleOfferPress = (offerId: string) => {
    // Navigate to the product details page or conversation
    const offer = offers.find((o: Offer) => o.id === offerId);
    if (offer) {
      router.push(`/product/${offer.product.id}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebHeader showLogo />
      <StatusBar style="auto" />
      
      <ResponsiveContainer
        webCentered={true}
        style={{maxWidth: 800}}
      >
        {/* ResponsiveContainer children prop wrapper */}
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <Text style={styles.title}>Mis Ofertas</Text>
          </View>
        
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[
                styles.tab, 
                selectedTab === 'all' && styles.activeTab
              ]}
              onPress={() => setSelectedTab('all')}
            >
              <Text style={[
                styles.tabText,
                selectedTab === 'all' && styles.activeTabText
              ]}>Todas</Text>
            </TouchableOpacity>
          
            <TouchableOpacity 
              style={[
                styles.tab, 
                selectedTab === 'sent' && styles.activeTab
              ]}
              onPress={() => setSelectedTab('sent')}
            >
              <ArrowUp size={16} color={selectedTab === 'sent' ? '#6B46C1' : '#64748B'} />
              <Text style={[
                styles.tabText,
                selectedTab === 'sent' && styles.activeTabText
              ]}>Enviadas</Text>
            </TouchableOpacity>
          
            <TouchableOpacity 
              style={[
                styles.tab, 
                selectedTab === 'received' && styles.activeTab
              ]}
              onPress={() => setSelectedTab('received')}
            >
              <ArrowDown size={16} color={selectedTab === 'received' ? '#6B46C1' : '#64748B'} />
              <Text style={[
                styles.tabText,
                selectedTab === 'received' && styles.activeTabText
              ]}>Recibidas</Text>
            </TouchableOpacity>
          </View>
        
          {filteredOffers.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Tag size={64} color="#E2E8F0" />
              <Text style={styles.emptyStateTitle}>No hay ofertas</Text>
              <Text style={styles.emptyStateText}>
                {selectedTab === 'sent' ? 'No has enviado ofertas todavía.' : 
                 selectedTab === 'received' ? 'No has recibido ofertas todavía.' : 
                 'No hay ofertas disponibles.'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredOffers}
              keyExtractor={(item: Offer) => item.id}
              renderItem={({ item }: { item: Offer }) => (
                <OfferItem 
                  offer={item} 
                  onPress={() => handleOfferPress(item.id)}
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
}

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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#6B46C1',
  },
  tabText: {
    color: '#4B5563',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  offerItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  offerTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerType: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B46C1',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  offerContent: {
    flexDirection: 'row',
    padding: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
    maxWidth: '75%', // Limit width to prevent overflow
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    flexShrink: 1, // Allow text to shrink
    flexWrap: 'wrap', // Allow text to wrap
  },
  priceInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  offerPrice: {
    fontWeight: '700',
    color: '#6B46C1',
  },
  discountPercentage: {
    color: '#4B5563',
  },
  offerTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  message: {
    flex: 1,
    marginLeft: 6,
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    flexShrink: 1, // Allow text to shrink
    flexWrap: 'wrap', // Allow text to wrap
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B46C1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
  },
  rejectButtonText: {
    color: '#991B1B',
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  }
});
