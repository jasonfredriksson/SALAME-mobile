import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Modal,
  Dimensions
} from 'react-native';
import { MapPin, Navigation, Map as MapIcon } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { useDimensions } from '@/utils/responsive';
import { Heart } from 'lucide-react-native';
import { mockProducts } from '@/data/mockData';
import { additionalProducts } from '@/data/additionalProducts';
import { WebHeader } from '@/components/WebHeader';
import { ProductCard } from '@/components/ProductCard';
import { NearbyProductMap } from '@/components/NearbyProductMap';
import { CategoryPill } from '@/components/CategoryPill';
import { Product } from '@/types/product';

const CATEGORIES = [
  { id: 'all', name: 'Todo' },
  { id: 'clothing', name: 'Ropa' },
  { id: 'electronics', name: 'Electrónica' },
  { id: 'home', name: 'Hogar' },
  { id: 'sports', name: 'Deportes' },
  { id: 'toys', name: 'Juegos' },
  { id: 'books', name: 'Libros' },
  { id: 'other', name: 'Otros' },
];

const DISTANCE_OPTIONS = [
  { value: 500, label: '500m' },
  { value: 1000, label: '1km' },
  { value: 5000, label: '5km' },
  { value: 10000, label: '10km' },
  { value: 0, label: 'Cualquier distancia' },
];

export default function HomeScreen() {
  const { isTablet, isDesktop } = useDimensions();
  // Determine if we're on a larger screen for responsive layout
  const isLargeScreen = isTablet || isDesktop;
  const router = useRouter();
  // Combine standard and additional products for desktop view
  const allProducts = isLargeScreen ? [...mockProducts, ...additionalProducts] : mockProducts;
  const [products, setProducts] = useState(allProducts as Product[]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState(5000);
  const [userLocation, setUserLocation] = useState('Palermo, Buenos Aires');
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  
  // Coordenadas simuladas para Buenos Aires
  const [userCoordinates, setUserCoordinates] = useState({
    latitude: -34.5997,
    longitude: -58.3819
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Filtrar productos por categoría y distancia
  const filteredProducts = products
    .filter((product: Product) => selectedCategory === 'all' || product.category === selectedCategory)
    // En un MVP real, esto utilizaría cálculos geoespaciales con PostGIS
    .sort((a: Product, b: Product) => {
      // Simulamos dar prioridad a los productos más cercanos cuando se elige una distancia
      if (selectedDistance > 0) {
        // Lógica simple para demo: los productos con 'Buenos Aires' aparecen primero si estamos en Buenos Aires
        const userInBuenosAires = userLocation.includes('Buenos Aires');
        const aInBuenosAires = a.location.includes('Buenos Aires');
        const bInBuenosAires = b.location.includes('Buenos Aires');
        
        if (userInBuenosAires) {
          if (aInBuenosAires && !bInBuenosAires) return -1;
          if (!aInBuenosAires && bInBuenosAires) return 1;
        }
      }
      return 0;
    });

  const handleProductPress = (id: string) => {
    router.push(`/product/${id}`);
  };

  return (
    <SafeAreaView style={[styles.safeArea, isLargeScreen && styles.webSafeArea]}>
      {isLargeScreen && <WebHeader />}
      <View style={[styles.container, isLargeScreen && styles.webContainer]}>
        <StatusBar style="auto" />
        <ResponsiveContainer webCentered mobileFullWidth={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mercado</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.locationButton} onPress={() => setLocationModalVisible(true)}>
                <MapPin size={18} color="#6B46C1" />
                <Text style={styles.locationText} numberOfLines={1}>{userLocation}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.mapButtonPrimary} 
                onPress={() => setMapVisible(true)}
              >
                <MapIcon size={18} color="#FFFFFF" />
                <Text style={styles.mapButtonText}>Ver mapa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{marginLeft: 8}}>
                <Heart size={24} color="#6B46C1" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {CATEGORIES.map((category) => (
              <CategoryPill
                key={category.id}
                title={category.name}
                selected={category.id === selectedCategory}
                onPress={() => setSelectedCategory(category.id)}
              />
            ))}
          </ScrollView>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.distanceContainer}
            contentContainerStyle={styles.distanceContent}
          >
            {DISTANCE_OPTIONS.map((option) => (
              <TouchableOpacity 
                key={option.value} 
                style={[styles.distancePill, selectedDistance === option.value && styles.selectedDistancePill]}
                onPress={() => setSelectedDistance(option.value)}
              >
                <Text style={[styles.distancePillText, selectedDistance === option.value && styles.selectedDistancePillText]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <FlatList
            key="product-list-mobile-optimized"
            data={filteredProducts}
            renderItem={({ item }: { item: Product }) => (
              <ProductCard
                product={item}
                onPress={() => handleProductPress(item.id)}
                style={styles.mobileProductCard}
              />
            )}
            numColumns={1} /* Set to 1 column for vertical mobile layout */
            keyExtractor={(item: Product) => item.id}
            contentContainerStyle={[styles.productsContainer]}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No se encontraron productos</Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#6B46C1']}
                tintColor={'#6B46C1'}
              />
            }
          />

          {/* Banner publicitario superior */}
          <View style={styles.adBanner}>
            <Text style={styles.adText}>PUBLICIDAD</Text>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=600' }}
              style={styles.adImage}
              resizeMode="cover"
            />
          </View>
        </ResponsiveContainer>

        {/* Modal de selección de ubicación */}
        <Modal
          visible={locationModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setLocationModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecciona tu ubicación</Text>
              
              <TouchableOpacity 
                style={styles.locationOption}
                onPress={() => {
                  setUserLocation('Palermo, Buenos Aires');
                  setLocationModalVisible(false);
                }}
              >
                <MapPin size={16} color="#6B46C1" />
                <Text style={styles.locationOptionText}>Palermo, Buenos Aires</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.locationOption}
                onPress={() => {
                  setUserLocation('Belgrano, Buenos Aires');
                  setLocationModalVisible(false);
                }}
              >
                <MapPin size={16} color="#6B46C1" />
                <Text style={styles.locationOptionText}>Belgrano, Buenos Aires</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.locationOption}
                onPress={() => {
                  setUserLocation('Recoleta, Buenos Aires');
                  setLocationModalVisible(false);
                }}
              >
                <MapPin size={16} color="#6B46C1" />
                <Text style={styles.locationOptionText}>Recoleta, Buenos Aires</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.locationOption}
                onPress={() => {
                  setUserLocation('Córdoba Capital, Córdoba');
                  setLocationModalVisible(false);
                }}
              >
                <MapPin size={16} color="#6B46C1" />
                <Text style={styles.locationOptionText}>Córdoba Capital, Córdoba</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.useLocationButton}
                onPress={() => {
                  // En una implementación real, esto usaría Geolocation API
                  setLocationModalVisible(false);
                }}
              >
                <Navigation size={16} color="#FFFFFF" />
                <Text style={styles.useLocationButtonText}>Usar mi ubicación actual</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setLocationModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal del mapa de productos cercanos */}
        <Modal
          visible={mapVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setMapVisible(false)}
        >
          <NearbyProductMap
            products={filteredProducts.slice(0, 10)}
            userLocation={userCoordinates}
            selectedDistance={selectedDistance}
            onClose={() => setMapVisible(false)}
            onProductSelect={(productId) => {
              setMapVisible(false);
              handleProductPress(productId);
            }}
          />
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  webSafeArea: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  webContainer: {
    backgroundColor: '#F8F9FA',
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6F0FA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 12,
  },
  mapButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    width: 34,
    height: 34,
  },
  mapButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B46C1',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#6B46C1',
    maxWidth: 100,
  },
  categoriesContainer: {
    height: 52,
    backgroundColor: '#FFFFFF',
    marginBottom: 0,
  },
  categoriesContent: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    minHeight: 40,
  },
  distanceContainer: {
    height: 48,
    backgroundColor: '#FFFFFF',
    marginBottom: 6,
  },
  distanceContent: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    minHeight: 36,
  },
  distancePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F9F9F9',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  selectedDistancePill: {
    backgroundColor: '#6B46C1',
    borderColor: '#6B46C1',
  },
  distancePillText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666666',
  },
  selectedDistancePillText: {
    color: '#FFFFFF',
  },
  productsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 90, // Extra padding at bottom for tab bar
  },
  webProductsContainer: {
    paddingHorizontal: 20,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  webProductRow: {
    justifyContent: 'flex-start',
    gap: 16, // Add space between cards on web
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  locationOptionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333333',
  },
  useLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B46C1',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  useLocationButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  closeButton: {
    paddingVertical: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#666666',
    fontSize: 16,
  },
  adBanner: {
    marginHorizontal: 16,
    marginVertical: 12,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  adImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  adText: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#FFFFFF',
    fontSize: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    zIndex: 1,
  },
  productCardContainer: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 12,
  },
  mobileProductCard: {
    width: '100%',
    marginBottom: 14,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});