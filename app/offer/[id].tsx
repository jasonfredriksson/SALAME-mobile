import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Send, Tag, Percent, CheckCircle, X } from 'lucide-react-native';
import { mockProducts } from '@/data/mockData';
import { WebHeader } from '@/components/WebHeader';
import { UserQualifications } from '@/components/UserQualifications';

export default function OfferScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const productId = typeof id === 'string' ? id : id?.[0] || '';
  
  // Find the product from our mock data
  const product = mockProducts.find((p) => p.id === productId);
  
  const [offerAmount, setOfferAmount] = useState(product ? (product.price * 0.9).toFixed(2) : '0');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAutomaticProcessing, setShowAutomaticProcessing] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  
  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ 
          headerShown: false,
        }} />
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

  const discount = offerAmount ? ((1 - parseFloat(offerAmount) / product.price) * 100).toFixed(0) : '0';
  const isValidOffer = parseFloat(offerAmount) > 0 && parseFloat(offerAmount) < product.price;
  
  const handleSubmitOffer = () => {
    if (product.minOfferPrice) {
      setShowAutomaticProcessing(true);
      setTimeout(() => {
        setShowAutomaticProcessing(false);
        if (parseFloat(offerAmount) >= product.minOfferPrice!) {
          setShowSuccess(true);
          setTimeout(() => {
            router.push(`/checkout/${product.id}`);
          }, 3000);
        } else {
          setShowRejected(true);
          setTimeout(() => {
            router.back();
          }, 3000);
        }
      }, 1500);
    } else {
      setShowSuccess(true);
      // Automatically return to product page after 3 seconds
      setTimeout(() => {
        router.back();
      }, 3000);
    }
  };
  
  // Calculate the recommended price if minOfferPrice exists
  const getRecommendedPrice = () => {
    if (product?.minOfferPrice) {
      return product.minOfferPrice;
    }
    return null;
  };
  
  const recommendedPrice = getRecommendedPrice();
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: false,
      }} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hacer una oferta</Text>
          <View style={{ width: 40 }} /> {/* Spacer for alignment */}
        </View>
        
        {showAutomaticProcessing ? (
          <View style={styles.processingContainer}>
            <View style={styles.processingIcon}>
              <Percent size={50} color="#6B46C1" />
            </View>
            <Text style={styles.processingTitle}>Procesando oferta...</Text>
            <Text style={styles.processingText}>
              El sistema está verificando si tu oferta cumple con los criterios automáticos
              establecidos por el vendedor.
            </Text>
          </View>
        ) : showRejected ? (
          <View style={styles.rejectedContainer}>
            <View style={styles.rejectedIcon}>
              <X size={50} color="#EF4444" />
            </View>
            <Text style={styles.rejectedTitle}>Oferta rechazada</Text>
            <Text style={styles.rejectedText}>
              Tu oferta de ${offerAmount} ha sido rechazada automáticamente porque
              es menor que el precio mínimo aceptado por el vendedor (${product.minOfferPrice}).
            </Text>
            <TouchableOpacity
              style={styles.tryAgainButton}
              onPress={() => setShowRejected(false)}
            >
              <Text style={styles.tryAgainText}>Intentar de nuevo</Text>
            </TouchableOpacity>
            <Text style={styles.redirectingText}>
              Volviendo a la página del producto...
            </Text>
          </View>
        ) : showSuccess ? (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Send size={50} color="#6B46C1" />
            </View>
            <Text style={styles.successTitle}>¡Oferta enviada!</Text>
            <Text style={styles.successText}>
              Tu oferta de ${offerAmount} ha sido enviada al vendedor.
              Recibirás una notificación cuando responda.
            </Text>
            <TouchableOpacity
              style={styles.viewOffersButton}
              onPress={() => router.push('/my-offers')}
            >
              <Text style={styles.viewOffersText}>Ver mis ofertas</Text>
            </TouchableOpacity>
            <Text style={styles.redirectingText}>
              Volviendo a la página del producto...
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Auto-offer info box */}
          {product?.minOfferPrice && (
            <View style={styles.autoOfferContainer}>
              <View style={styles.autoOfferHeader}>
                <CheckCircle size={18} color="#10B981" />
                <Text style={styles.autoOfferTitle}>Oferta automática habilitada</Text>
              </View>
              <Text style={styles.autoOfferDescription}>
                Este producto tiene habilitada la aceptación automática de ofertas. Si ofreces un precio igual o mayor a <Text style={styles.highlightText}>${product.minOfferPrice}</Text> tu oferta será aceptada inmediatamente.
              </Text>
            </View>
          )}
          
          {/* Product summary */}
          <View style={styles.productSummary}>
              <Image source={{ uri: product.images[0] }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {product.title}
                </Text>
                <Text style={styles.productPrice}>
                  ${product.price.toFixed(2)}
                </Text>
                <Text style={styles.sellerName}>
                  Vendedor: {product.seller.name}
                </Text>
              </View>
            </View>
            
            {/* Offer input section */}
            <View style={styles.offerSection}>
              <Text style={styles.sectionTitle}>¿Cuánto deseas ofrecer?</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Tu oferta</Text>
                
                {/* Recommended price */}
              {recommendedPrice && (
                <Text style={styles.recommendedPrice}>
                  Oferta mínima recomendada: ${recommendedPrice}
                </Text>
              )}
                <TextInput
                  style={styles.offerInput}
                  value={offerAmount}
                  onChangeText={setOfferAmount}
                  keyboardType="numeric"
                  placeholder="0.00"
                  maxLength={10}
                />
              </View>
              
              <View style={styles.discountContainer}>
                <Percent size={16} color="#6B46C1" />
                <Text style={styles.discountText}>
                  {isValidOffer
                    ? `${discount}% de descuento sobre el precio original`
                    : parseFloat(offerAmount) >= product.price
                      ? 'La oferta debe ser menor al precio original'
                      : 'Ingresa un monto válido'}
                </Text>
              </View>
              
              {/* Recommended offers */}
              <Text style={styles.recommendedTitle}>Ofertas recomendadas</Text>
              <View style={styles.recommendedContainer}>
                {[0.9, 0.85, 0.8].map((percent, index) => {
                  const value = (product.price * percent).toFixed(0);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.recommendedButton}
                      onPress={() => setOfferAmount(value)}
                    >
                      <Text style={styles.recommendedButtonText}>
                        ${value}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              {/* Submit button */}
              <TouchableOpacity
                style={[
                  styles.offerButton,
                  !isValidOffer && styles.disabledButton
                ]}
                disabled={!isValidOffer}
                onPress={handleSubmitOffer}
              >
                <Tag size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Enviar oferta</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  processingIcon: {
    backgroundColor: '#EDE9FE',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  processingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4C1D95',
    marginBottom: 16,
  },
  processingText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
  },
  rejectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  rejectedIcon: {
    backgroundColor: '#FEE2E2',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  rejectedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B91C1C',
    marginBottom: 16,
  },
  rejectedText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
  },
  tryAgainButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  tryAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  autoOfferContainer: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  autoOfferHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  autoOfferTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
    marginLeft: 8,
  },
  autoOfferDescription: {
    fontSize: 14,
    color: '#065F46',
    lineHeight: 20,
  },
  highlightText: {
    fontWeight: '700',
  },
  recommendedPrice: {
    fontSize: 14,
    color: '#6B46C1',
    fontWeight: '500',
    marginBottom: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardAvoidingContainer: {
    flex: 1,
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  productSummary: {
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
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 14,
    color: '#64748B',
  },
  offerSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6B46C1',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6B46C1',
    marginRight: 8,
  },
  offerInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    paddingVertical: 12,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  discountText: {
    fontSize: 14,
    color: '#6B46C1',
    marginLeft: 8,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  recommendedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  recommendedButton: {
    flex: 1,
    backgroundColor: '#F3E8FF',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  recommendedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B46C1',
  },
  submitButton: {
    backgroundColor: '#6B46C1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9F7AEA',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  backButtonText: {
    fontSize: 16,
    color: '#6B46C1',
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6B46C1',
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 24,
  },
  redirectingText: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 12,
  },
  viewOffersButton: {
    backgroundColor: '#F3E8FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  viewOffersText: {
    color: '#6B46C1',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
