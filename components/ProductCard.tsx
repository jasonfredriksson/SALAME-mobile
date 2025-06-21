import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Heart, MessageSquare, Shield, Truck, Award, ChevronLeft, ChevronRight } from 'lucide-react-native';

type Product = {
  id: string;
  title: string;
  price: number;
  images: string[];
  location: string;
  fastShipping?: boolean;
  securePayment?: boolean;
  seller: {
    name: string;
    avatar: string;
    rating: number;
    totalSales?: number;
    reputationBadge?: string;
  };
  isNew?: boolean;
};

type ProductCardProps = {
  product: Product;
  onPress: () => void;
  style?: any;
};

export function ProductCard({ product, onPress, style }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[currentImageIndex] }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Indicadores de paginación */}
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
        
        {/* Botones de navegación */}
        {product.images.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <TouchableOpacity style={styles.navButtonLeft} onPress={handlePrevImage}>
                <ChevronLeft size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            {currentImageIndex < product.images.length - 1 && (
              <TouchableOpacity style={styles.navButtonRight} onPress={handleNextImage}>
                <ChevronRight size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </>
        )}
        
        {/* Etiqueta de nuevo producto */}
        {product.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NUEVO</Text>
          </View>
        )}
        
        {/* Indicador de envío rápido */}
        {product.fastShipping && (
          <View style={styles.shippingBadge}>
            <Truck size={10} color="#FFFFFF" />
            <Text style={styles.shippingBadgeText}>24h</Text>
          </View>
        )}
        
        {/* Botón favorito */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={(e: any) => {
            e.stopPropagation();
            // Aquí iría la lógica para marcar como favorito
          }}
        >
          <Heart size={18} color="#6B46C1" />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          {product.securePayment && (
            <View style={styles.securePayment}>
              <Shield size={10} color="#6B46C1" />
              <Text style={styles.securePaymentText}>Pago Seguro</Text>
            </View>
          )}
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <View style={styles.locationContainer}>
          <Text style={styles.location} numberOfLines={1}>
            {product.location}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.sellerContainer}>
          <View style={styles.sellerAvatarContainer}>
            <Image source={{ uri: product.seller.avatar }} style={styles.sellerAvatar} />
            {/* Badge de reputación según ventas */}
            {product.seller.totalSales && product.seller.totalSales >= 25 && product.seller.rating >= 4.8 && (
              <View style={styles.reputationBadge}>
                <Award size={8} color="#FFFFFF" />
              </View>
            )}
          </View>
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName} numberOfLines={1}>
              {product.seller.name}
            </Text>
            {product.seller.reputationBadge && (
              <Text style={styles.reputationText}>{product.seller.reputationBadge}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.messageButton}>
          <MessageSquare size={16} color="#6B46C1" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pagination: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  navButtonLeft: {
    position: 'absolute',
    left: 5,
    top: '50%',
    transform: [{ translateY: -15 }],
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  navButtonRight: {
    position: 'absolute',
    right: 5,
    top: '50%',
    transform: [{ translateY: -15 }],
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#6B46C1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  shippingBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B46C1',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  shippingBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
    marginLeft: 2,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 8,
    height: 76, // Altura fija reducida para la sección de información
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  securePayment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  securePaymentText: {
    fontSize: 8,
    color: '#6B46C1',
    fontWeight: '600',
    marginLeft: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 6,
    height: 18, // Altura fija para asegurar consistencia
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 11,
    color: '#666666',
    flexShrink: 1,
    height: 14, // Altura fija para la ubicación
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#6B46C1',
    height: 42, // Altura fija para el footer
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sellerAvatarContainer: {
    position: 'relative',
    marginRight: 8,
  },
  sellerAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  reputationBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#6B46C1',
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 12,
    color: '#666666',
    marginRight: 4,
    ellipsizeMode: 'tail',
    numberOfLines: 1,
  },
  reputationText: {
    fontSize: 9,
    color: '#6B46C1',
    fontWeight: '600',
  },
  messageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});