import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { WebHeader } from '@/components/WebHeader';
import { UserQualifications } from '@/components/UserQualifications';
import { useDimensions } from '@/utils/responsive';
import {
  ChevronLeft,
  Heart,
  Share2,
  MessageSquare,
  MapPin,
  Clock,
  Star,
  Tag,
  MessageCircle,
  CheckCircle,
  Plus,
} from 'lucide-react-native';
import { mockProducts } from '@/data/mockData';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { isDesktop, isTablet } = useDimensions();
  const isLargeScreen = isDesktop || isTablet;
  const router = useRouter();

  const goToPublish = () => {
    router.push('/publish');
  };
  const productId = typeof id === 'string' ? id : id?.[0] || '';
  
  // Find the product from our mock data
  const product = mockProducts.find((p) => p.id === productId);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Producto no encontrado</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    // In a real app, you would implement sharing functionality here
    alert('Esta funcionalidad de compartir se implementaría en una app real');
  };

  const handleContact = () => {
    // Navigate to the new chat screen with product and seller information
    router.push(`/chat/new?productId=${product.id}&sellerId=${product.sellerId}`);
  };

  const handleOffer = () => {
    // Navigate to the offer screen
    router.push(`/offer/${product.id}`);
  };

  const handleBuy = () => {
    // Navigate to the checkout flow
    router.push(`/checkout/${product.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <WebHeader />
      
      {/* Floating action button for publishing */}
      <TouchableOpacity style={styles.publishFAB} onPress={goToPublish}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <ResponsiveContainer webCentered>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerActionButton}
              onPress={toggleFavorite}
            >
              <Heart
                size={24}
                color={isFavorite ? '#F43F5E' : '#0F172A'}
                fill={isFavorite ? '#F43F5E' : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerActionButton}
              onPress={handleShare}
            >
              <Share2 size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.imageContainer, isLargeScreen && styles.imageContainerDesktop]}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event: {nativeEvent: {contentOffset: {x: number}}}) => {
                const containerWidth = isLargeScreen ? Math.min(width * 0.8, 600) : width;
                const newIndex = Math.round(
                  event.nativeEvent.contentOffset.x / containerWidth
                );
                setCurrentImageIndex(newIndex);
              }}
            >
              {product.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={[
                    styles.productImage, 
                    isLargeScreen && { width: Math.min(width * 0.8, 600), height: 500 }
                  ]}
                  resizeMode="contain"
                />
              ))}
            </ScrollView>
            <View style={styles.pagination}>
              {product.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    currentImageIndex === index && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <Text style={styles.title}>{product.title}</Text>
            
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <MapPin size={16} color="#64748B" />
                <Text style={styles.detailText}>{product.location}</Text>
              </View>
              <View style={styles.detailItem}>
                <Clock size={16} color="#64748B" />
                <Text style={styles.detailText}>{product.postedTime}</Text>
              </View>
              <View style={styles.detailItem}>
                <Tag size={16} color="#64748B" />
                <Text style={styles.detailText}>{product.category}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.sellerContainer}>
              <Image
                source={{ uri: product.seller.avatar }}
                style={styles.sellerAvatar}
              />
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{product.seller.name}</Text>
                <Text style={styles.sellerLocation}>Madrid, España</Text>
                
                {/* Seller qualifications */}
                <UserQualifications 
                  verifiedSeller={true}
                  rating={4.8}
                  totalSales={42}
                  isSalamePay={true}
                />
              </View>
              <View style={styles.ratingContainer}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingText}>
                  {product.seller.rating.toFixed(1)} · {product.seller.totalSales} ventas
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        </ScrollView>

        </ResponsiveContainer>

        <View style={styles.footer}>
          <ResponsiveContainer webCentered>
            <View style={[styles.footerButtons, isLargeScreen && styles.webFooterButtons]}>
              <Text style={styles.footerPrice}>${product.price.toFixed(2)}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleContact}
              >
                <MessageCircle size={16} color="#FFFFFF" />
                <Text style={styles.buttonText}>Contactar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.offerButton}
                onPress={handleOffer}
              >
                <Tag size={16} color="#FFFFFF" />
                <Text style={styles.buttonText}>Hacer oferta</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.buyButton}
                onPress={() => router.push(`/checkout/${product.id}`)}
              >
                <Text style={styles.buyButtonText}>Comprar</Text>
              </TouchableOpacity>
            </View>
          </ResponsiveContainer>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  publishFAB: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6B46C1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  productContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  imageContainer: {
    position: 'relative',
    height: width * 0.8, // Maintain aspect ratio for mobile
    maxHeight: 500, // Cap maximum height
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainerDesktop: {
    height: 500, // Fixed height for desktop
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600, // Cap maximum width on desktop
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width,
    height: width * 0.8,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  productInfo: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  webFooterButtons: {
    maxWidth: 800,
    alignSelf: 'center',
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#6B46C1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  offerButton: {
    flex: 1,
    backgroundColor: '#9F7AEA',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#4C1D95',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
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
});