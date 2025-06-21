import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MapPin, Crosshair, ArrowLeft } from 'lucide-react-native';

// Tipo para los productos
type Product = {
  id: string;
  title: string;
  price: number;
  images: string[];
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
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

export const NearbyProductMap = ({ 
  products, 
  userLocation,
  selectedDistance: initialDistance,
  onClose,
  onProductSelect 
}: NearbyProductMapProps) => {
  // Inicializar selectedMarker sin usar tipo genérico
  const [selectedMarker, setSelectedMarker] = useState(null as Product | null);
  const [selectedDistance, setSelectedDistance] = useState(initialDistance);
  const [visibleProducts, setVisibleProducts] = useState(products.slice(0, 3));
  
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
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <ArrowLeft size={24} color="#6B46C1" />
        </TouchableOpacity>
        <Text style={styles.title}>Productos cercanos</Text>
        <TouchableOpacity style={styles.centerButton}>
          <Crosshair size={20} color="#6B46C1" />
        </TouchableOpacity>
      </View>
      
      {/* Este es un mapa simulado para la demo */}
      <View style={styles.mapContainer}>
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
        </View>
        
        {/* Marcadores de productos - Palermo */}
        <TouchableOpacity 
          style={[styles.productMarker, { left: '40%', top: '40%' }]}
          onPress={() => onProductSelect(products[0]?.id || '')}
        >
          <View style={styles.markerContainer}>
            <View style={styles.markerPin}>
              <MapPin size={22} color="#6B46C1" />
            </View>
            <View style={styles.markerPrice}>
              <Text style={styles.markerPriceText}>
                ${products[0]?.price?.toLocaleString() || '9.999'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Marcador con badge de Gran Salame - Recoleta */}
        <TouchableOpacity 
          style={[styles.productMarker, { left: '65%', top: '60%' }]}
          onPress={() => onProductSelect(products[1]?.id || '')}
        >
          <View style={styles.markerContainer}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>Gran Salame</Text>
            </View>
            <View style={styles.markerPin}>
              <MapPin size={22} color="#6B46C1" />
            </View>
            <View style={styles.markerPrice}>
              <Text style={styles.markerPriceText}>
                ${products[1]?.price?.toLocaleString() || '12.500'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Marcador con badge de envío rápido - San Telmo */}
        <TouchableOpacity 
          style={[styles.productMarker, { left: '30%', top: '65%' }]}
          onPress={() => onProductSelect(products[2]?.id || '')}
        >
          <View style={styles.markerContainer}>
            <View style={styles.fastShippingBadge}>
              <Text style={styles.fastShippingText}>24h</Text>
            </View>
            <View style={styles.markerPin}>
              <MapPin size={22} color="#6B46C1" />
            </View>
            <View style={styles.markerPrice}>
              <Text style={styles.markerPriceText}>
                ${products[2]?.price?.toLocaleString() || '8.750'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
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
      
      {/* Información sobre el producto seleccionado */}
      {selectedMarker && (
        <View style={styles.productInfo}>
          <Image 
            source={{ uri: selectedMarker.images[0] }}
            style={styles.productImage}
          />
          <View style={styles.productDetails}>
            <Text style={styles.productTitle} numberOfLines={1}>
              {selectedMarker.title}
            </Text>
            <Text style={styles.productPrice}>
              ${selectedMarker.price.toLocaleString()}
            </Text>
            <Text style={styles.productLocation}>
              {selectedMarker.location}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  centerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    borderRadius: 20,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
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
  },
  userMarkerInner: {
    width: 12,
    height: 12,
    backgroundColor: '#6B46C1',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  productMarker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    transform: [{ translateX: -40 }, { translateY: -40 }],
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
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  productLocation: {
    fontSize: 12,
    color: '#666666',
  },
  distanceCircle: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: '60%',
    height: '60%',
    borderRadius: 500,
    borderWidth: 2,
    borderColor: 'rgba(107, 70, 193, 0.4)',
    backgroundColor: 'rgba(107, 70, 193, 0.08)',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  distanceLabel: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    top: '10%',
    right: '10%',
    borderWidth: 1,
    borderColor: '#6B46C1',
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
});