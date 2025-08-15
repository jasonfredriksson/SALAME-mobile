import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView,
  Platform, useWindowDimensions
} from 'react-native';
import { 
  ArrowLeft, MapPin, Search, SlidersHorizontal, Check, Star, X, 
  Filter, ChevronDown, Crosshair 
} from 'lucide-react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE, Region } from 'react-native-maps';

// Tipo para los productos
type Product = {
  id: string;
  title: string;
  price: number;
  images: string[];
  proximityKm?: number;
  location: string;
  category: string;
  fastShipping?: boolean;
  securePayment?: boolean;
  seller?: {
    id: string;
    name: string;
    rating: number;
    avatar?: string;
    badges?: string[];
  }
};

interface NearbyProductMapProps {
  products: Product[];
  userLocation: { latitude: number; longitude: number };
  selectedDistance: number;
  onClose: () => void;
  onProductSelect: (productId: string) => void;
}

const DISTANCE_OPTIONS = [
  { value: 500, label: '500m' },
  { value: 1000, label: '1km' },
  { value: 5000, label: '5km' },
  { value: 10000, label: '10km' },
  { value: 0, label: 'Cualquier distancia' },
];

// Lista de categorías disponibles
const CATEGORIES = [
  { id: 'ropa', label: 'Ropa', icon: '👕' },
  { id: 'tecnologia', label: 'Tecnología', icon: '📱' },
  { id: 'deportes', label: 'Deportes', icon: '⚽' },
  { id: 'hogar', label: 'Hogar', icon: '🏠' },
  { id: 'libros', label: 'Libros', icon: '📚' },
  { id: 'automoviles', label: 'Automóviles', icon: '🚗' },
  { id: 'instrumentos', label: 'Instrumentos Musicales', icon: '🎸' },
];

export const NearbyProductMap = ({ 
  products, 
  userLocation,
  selectedDistance: initialDistance,
  onClose,
  onProductSelect 
}: NearbyProductMapProps) => {
  // Estados para manejar la interacción
  const [selectedMarker, setSelectedMarker] = useState(null as Product | null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState(initialDistance);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([] as string[]);
  const [maxDistanceKm, setMaxDistanceKm] = useState(42); // Valor para el slider
  
  // Obtener dimensiones de la pantalla para diseño responsivo
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isSmallDevice = screenWidth < 380;
  
  // Ajustar disposición según orientación y tamaño del dispositivo
  const layoutStyles = useMemo(() => {
    const isLandscape = screenWidth > screenHeight;
    const isMobileDemo = screenWidth > 500; // Check if we're viewing this on a screen larger than mobile
    
    return {
      mobileDemoContainer: isMobileDemo ? { 
        width: 360, // Standard mobile width
        alignSelf: 'center',
        height: '100%',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF'
      } : {},
      mapContainer: isLandscape ? { paddingLeft: showFilters ? 140 : 0 } : {},
      filtersPanel: isSmallDevice ? { width: 120 } : {},
      productInfo: isSmallDevice ? { padding: 8 } : {}
    };
  }, [screenWidth, screenHeight, showFilters, isSmallDevice]);
  
  // Filtrar productos basados en los criterios seleccionados
  // Referencia al mapa para controlar la vista y animaciones
  const mapRef = useRef<MapView>(null);
  
  // Estado para la región inicial y actual del mapa
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Actualizar la región del mapa cuando cambia la distancia seleccionada
  useEffect(() => {
    if (selectedDistance > 0) {
      // Calculamos el delta basado en la distancia seleccionada en metros
      // 1 grado de latitud ~ 111km, por lo que convertimos metros a grados
      const latDelta = selectedDistance / 111000 * 2.5; // Factor 2.5 para que el círculo no ocupe toda la pantalla
      
      setMapRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: latDelta,
        longitudeDelta: latDelta * 2, // Ajuste para compensar la relación de aspecto
      });
      
      // Animar el mapa a la nueva región
      mapRef.current?.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: latDelta,
        longitudeDelta: latDelta * 2,
      }, 500);
    }
  }, [selectedDistance, userLocation]);
  
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filtro por distancia - convertir selectedDistance de metros a km para comparar
      if (selectedDistance > 0 && product.proximityKm) {
        // Si la distancia seleccionada es "cualquier distancia", mostrar todos
        if (selectedDistance === 999999) {
          // No filtrar por distancia
        }
        // Si no, comprobar si el producto está dentro del rango seleccionado
        else if (product.proximityKm > selectedDistance/1000) {
          return false;
        }
      }
      
      // Filtro por categoría (asegurándonos de que la categoría exista y comparando correctamente)
      if (selectedCategories.length > 0) {
        // Si el producto no tiene categoría o su categoría no está entre las seleccionadas
        const productCategoryLower = product.category ? product.category.toLowerCase() : '';
        if (!productCategoryLower || !selectedCategories.includes(productCategoryLower)) {
          return false;
        }
      }
      
      // Filtro por búsqueda
      if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [products, selectedDistance, selectedCategories, searchQuery]);
  
  // Calcular rango del mapa basado en la distancia seleccionada
  const getMapRegion = () => {
    const latitudeDelta = selectedDistance / 111000; // Aproximado: 1 grado ≈ 111km
    const longitudeDelta = latitudeDelta * (Dimensions.get('window').width / Dimensions.get('window').height);
    
    return {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: latitudeDelta || 0.02,
      longitudeDelta: longitudeDelta || 0.02,
    };
  };
  
  // Manejar selección de categoría
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev: string[]) => {
      // Verificar si la categoría ya está seleccionada para quitarla
      if (prev.includes(categoryId)) {
        return prev.filter((id: string) => id !== categoryId);
      }
      // Caso contrario, añadir la categoría seleccionada
      return [...prev, categoryId];
    });
  };
  
  // Limpiar todos los filtros y resetear los valores
  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setSelectedDistance(initialDistance);
    setSelectedMarker(null); // Quitar selección de marcador para una experiencia más limpia
  };
  
  return (
    <View style={styles.outerContainer}>
      <View style={[styles.container, layoutStyles.mobileDemoContainer]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <ArrowLeft size={24} color="#6B46C1" />
        </TouchableOpacity>
        <Text style={styles.title}>Productos cercanos</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.iconButton, showFilters && styles.iconButtonActive]} 
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} color={showFilters ? "white" : "#6B46C1"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.centerButton}>
            <Crosshair size={20} color="#6B46C1" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Panel de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={16} color="#6B46C1" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Text style={styles.resultsCount}>
          {filteredProducts.length} productos encontrados
        </Text>
      </View>
      
      {/* Panel lateral de filtros */}
      {showFilters && (
        <View style={[styles.filtersPanel, layoutStyles.filtersPanel]}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filtros</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFilters}>Limpiar todos</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.filterSectionTitle}>Distancia máxima</Text>
          <View style={styles.distanceOptions}>
            {DISTANCE_OPTIONS.map((option) => (
              <TouchableOpacity 
                key={option.value}
                style={[styles.distanceOption, selectedDistance === option.value && styles.selectedOption]}
                onPress={() => setSelectedDistance(option.value)}
              >
                <Text style={[styles.distanceOptionText, selectedDistance === option.value && styles.selectedOptionText]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.filterSectionTitle}>Categorías</Text>
          <View style={styles.categoriesContainer}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity 
                key={category.id}
                style={[styles.categoryButton, selectedCategories.includes(category.id) && styles.selectedCategory]}
                onPress={() => toggleCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[styles.categoryLabel, selectedCategories.includes(category.id) && styles.selectedCategoryLabel]}>
                  {category.label}
                </Text>
                {selectedCategories.includes(category.id) && (
                  <Check size={16} color="#6B46C1" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      
      {/* Este es un mapa simulado para la demo */}
      <View style={[styles.mapContainer, showFilters && styles.mapContainerWithFilters, layoutStyles.mapContainer]}>
        {/* Fondo del mapa estilizado */}
        <View style={styles.mapBackground}>
          {/* Simulación de calles principales */}
          <View style={styles.mainRoadHorizontal} />
          <View style={styles.mainRoadVertical} />
          <View style={[styles.secondaryRoad, {top: '30%', width: '100%'}]} />
          <View style={[styles.secondaryRoad, {top: '60%', width: '100%'}]} />
          <View style={[styles.secondaryRoad, {left: '25%', height: '100%', width: 1}]} />
          <View style={[styles.secondaryRoad, {left: '75%', height: '100%', width: 1}]} />
          
          {/* Etiquetas de zonas */}
          <View style={[styles.areaLabel, {top: '15%', left: '15%'}]}>
            <Text style={styles.areaLabelText}>Palermo</Text>
          </View>
          <View style={[styles.areaLabel, {top: '40%', left: '70%'}]}>
            <Text style={styles.areaLabelText}>Recoleta</Text>
          </View>
          <View style={[styles.areaLabel, {top: '70%', left: '30%'}]}>
            <Text style={styles.areaLabelText}>San Telmo</Text>
          </View>
        </View>
        
        {/* Marcador de la ubicación del usuario */}
        <View style={[styles.userMarker, { left: '50%', top: '50%' }]}>
          <View style={styles.userMarkerInner} />
          <View style={styles.userMarkerRing} />
        </View>
        
        {/* Marcadores de productos filtrados */}
        {filteredProducts.map((product: Product, index: number) => {
          // Posicionamiento dinámico basado en el índice
          const positionStyles = {
            left: `${30 + (index * 15) % 50}%`,
            top: `${35 + (index * 20) % 40}%`,
          };
          
          const isSelected = selectedMarker?.id === product.id;
          
          return (
            <TouchableOpacity 
              key={product.id}
              style={[styles.productMarker, positionStyles, isSelected && styles.selectedMarker]}
              onPress={() => {
                setSelectedMarker(product);
                onProductSelect(product.id);
              }}
            >
              <View style={styles.markerContainer}>
                {/* Badges de reputación y servicios */}
                <View style={styles.badgesContainer}>
                  {product.fastShipping && (
                    <View style={styles.fastBadge}>
                      <Text style={styles.fastBadgeText}>24h</Text>
                    </View>
                  )}
                  
                  {/* Badge Gran Salame para vendedores de alta reputación */}
                  {product.seller && product.seller.rating >= 4.8 && (
                    <View style={styles.granSalameBadge}>
                      <Text style={styles.badgeLabel}>Gran Salame</Text>
                    </View>
                  )}
                  
                  {/* Badge Picado Fino para vendedores confiables */}
                  {product.seller && product.seller.rating >= 4.0 && product.seller.rating < 4.8 && (
                    <View style={styles.picadoFinoBadge}>
                      <Text style={styles.badgeLabel}>Picado Fino</Text>
                    </View>
                  )}
                  
                  {/* Badge Pago Seguro para productos con MercadoPago */}
                  {product.securePayment && (
                    <View style={styles.securePaymentBadge}>
                      <Text style={styles.badgeLabel}>Pago Seguro</Text>
                    </View>
                  )}
                </View>
                
                {/* Pin del marcador */}
                <View style={[styles.markerPin, isSelected && styles.selectedMarkerPin]}>
                  <MapPin size={isSelected ? 26 : 22} color={isSelected ? '#FFFFFF' : '#6B46C1'} />
                </View>
                
                {/* Precio del producto */}
                <View style={[styles.markerPrice, isSelected && styles.selectedMarkerPrice]}>
                  <Text style={[styles.markerPriceText, isSelected && styles.selectedMarkerPriceText]}>
                    ${product.price.toLocaleString()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        
        {/* Círculo de rango de distancia */}
        <View style={styles.distanceCircle}>
          <View style={styles.distanceLabel}>
            <Text style={styles.distanceLabelText}>
              {selectedDistance >= 1000 
                ? `${selectedDistance/1000} km` 
                : `${selectedDistance} m`}
            </Text>
          </View>
        </View>
        
        {/* Información de filtros activos */}
        <View style={styles.filtersInfo}>
          <View style={styles.filterPill}>
            <MapPin size={14} color="#6B46C1" />
            <Text style={styles.filterText}>
              {selectedDistance >= 1000 
                ? `${selectedDistance/1000} km de distancia` 
                : `${selectedDistance} m de distancia`}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Información sobre el producto seleccionado - versión mejorada */}
      {selectedMarker && (
        <View style={[styles.productInfo, layoutStyles.productInfo]}>
          <Image 
            source={{ uri: selectedMarker.images[0] || 'https://via.placeholder.com/150' }}
            style={[styles.productImage, isSmallDevice && styles.productImageSmall]}
            resizeMode="cover"
          />
          <View style={styles.productDetails}>
            <Text style={styles.productTitle} numberOfLines={1}>
              {selectedMarker.title}
            </Text>
            <Text style={styles.productPrice}>
              ${selectedMarker.price.toLocaleString()}
            </Text>
            <View style={styles.productInfoRow}>
              <MapPin size={12} color="#666666" />
              <Text style={styles.productLocation}>
                {selectedMarker.location} • {selectedMarker.proximityKm ? `${selectedMarker.proximityKm} km` : 'Cerca de ti'}
              </Text>
            </View>
            {selectedMarker.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {CATEGORIES.find(c => c.id === selectedMarker.category.toLowerCase())?.icon || ''} {selectedMarker.category}
                </Text>
              </View>
            )}
            {selectedMarker.seller && (
              <View style={styles.sellerInfo}>
                {selectedMarker.seller.avatar && (
                  <Image 
                    source={{ uri: selectedMarker.seller.avatar }} 
                    style={styles.sellerAvatar} 
                  />
                )}
                <Text style={styles.sellerName}>{selectedMarker.seller.name}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={12} color="#FFCA28" fill="#FFCA28" />
                  <Text style={styles.ratingText}>{selectedMarker.seller.rating.toFixed(1)}</Text>
                </View>
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => onProductSelect(selectedMarker.id)}
          >
            <Text style={styles.viewDetailsText}>Ver detalles</Text>
          </TouchableOpacity>
        </View>
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    borderRadius: 18,
    marginRight: 8,
  },
  iconButtonActive: {
    backgroundColor: '#6B46C1',
  },
  centerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    borderRadius: 20,
  },
  // Estilos para el panel de búsqueda
  searchContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    paddingVertical: 4,
  },
  resultsCount: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  mapContainerWithFilters: {
    marginLeft: 140, // Espacio para el panel de filtros
  },
  filtersPanel: {
    position: 'absolute',
    left: 0,
    top: 108, // Por debajo del header y searchContainer
    bottom: 0,
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
    padding: 12,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  clearFilters: {
    fontSize: 12,
    color: '#6B46C1',
    fontWeight: '500',
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 8,
    marginTop: 12,
  },
  distanceOptions: {
    marginBottom: 8,
  },
  distanceOption: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 4,
    backgroundColor: '#F5F5F5',
  },
  selectedOption: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#6B46C1',
  },
  distanceOptionText: {
    fontSize: 12,
    color: '#666666',
  },
  selectedOptionText: {
    color: '#6B46C1',
    fontWeight: '500',
  },
  categoriesContainer: {
    marginTop: 4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
    backgroundColor: '#F5F5F5',
  },
  selectedCategory: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#6B46C1',
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  selectedCategoryLabel: {
    color: '#6B46C1',
    fontWeight: '500',
  },
  mapBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EAEEF2',
    position: 'relative',
  },
  mainRoadHorizontal: {
    position: 'absolute',
    height: 4,
    width: '100%',
    backgroundColor: '#FFFFFF',
    top: '50%',
    left: 0,
    transform: [{ translateY: -2 }],
  },
  mainRoadVertical: {
    position: 'absolute',
    width: 4,
    height: '100%',
    backgroundColor: '#FFFFFF',
    top: 0,
    left: '50%',
    transform: [{ translateX: -2 }],
  },
  secondaryRoad: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
  },
  areaLabel: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  areaLabelText: {
    color: '#666666',
    fontSize: 10,
    fontWeight: '500',
  },
  userMarker: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: 'rgba(107, 70, 193, 0.3)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    zIndex: 10,
  },
  userMarkerInner: {
    width: 12,
    height: 12,
    backgroundColor: '#6B46C1',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userMarkerRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(107, 70, 193, 0.4)',
    backgroundColor: 'transparent',
  },
  productMarker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    transform: [{ translateX: -40 }, { translateY: -40 }],
    zIndex: 5,
  },
  selectedMarker: {
    zIndex: 15,
    transform: [{ translateX: -40 }, { translateY: -40 }, { scale: 1.1 }],
  },
  selectedMarkerPin: {
    backgroundColor: '#6B46C1',
  },
  selectedMarkerPrice: {
    backgroundColor: '#6B46C1',
    borderColor: '#FFFFFF',
  },
  selectedMarkerPriceText: {
    color: '#FFFFFF',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  markerPin: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPrice: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#6B46C1',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  markerPriceText: {
    color: '#6B46C1',
    fontSize: 10,
    fontWeight: '700',
  },
  badgeContainer: {
    position: 'absolute',
    backgroundColor: '#FFE082',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    top: -24,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  badgeText: {
    color: '#5D4037',
    fontSize: 9,
    fontWeight: '700',
  },
  fastShippingBadge: {
    position: 'absolute',
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    top: -22,
    right: -15,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  fastShippingText: {
    color: '#0D47A1',
    fontSize: 9,
    fontWeight: '700',
  },
  productInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
  },
  productImageSmall: {
    width: 60,
    height: 60,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1A1A1A',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  productInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productLocation: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  categoryBadge: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#666666',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  sellerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  sellerName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1A1A',
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 2,
  },
  viewDetailsButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
    marginLeft: 10,
  },
  viewDetailsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // El círculo de distancia ahora se renderiza directamente en el MapView como un componente Circle
  distanceLabel: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    top: 10,
    right: 10,
    borderWidth: 1,
    borderColor: '#6B46C1',
    zIndex: 10,
  },
  distanceLabelText: {
    color: '#6B46C1',
    fontSize: 10,
    fontWeight: '600',
  },
  filtersInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(107, 70, 193, 0.2)',
  },
  filterText: {
    color: '#6B46C1',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
  },
  // Estilos para los badges de reputación
  badgesContainer: {
    position: 'absolute',
    top: -10,
    flexDirection: 'row',
    zIndex: 10,
  },
  fastBadge: {
    backgroundColor: '#FF7043',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  fastBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  granSalameBadge: {
    backgroundColor: '#6B46C1',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  picadoFinoBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  securePaymentBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeLabel: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
});