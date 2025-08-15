import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// Import the original component directly, we'll handle the type issue inline
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { WebHeader } from '@/components/WebHeader';
import { UserQualifications } from '@/components/UserQualifications';
import {
  ChevronLeft,
  CreditCard,
  Wallet,
  CheckCircle,
  TruckIcon,
  AlertCircle,
  Box,
  Star,
  Shield,
  Clock,
} from 'lucide-react-native';
import { mockProducts } from '@/data/mockData';

// Define styles at the top level outside the component to avoid block-scoped variable issues
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sellerQualificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 4,
  },
  qualificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  qualificationText: {
    fontSize: 12,
    color: '#475569',
    marginLeft: 4,
  },
  freeShippingBanner: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  freeShippingText: {
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
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
    color: '#6B46C1',
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productMetaText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#6B46C1',
    backgroundColor: '#F3E8FF',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentOptionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  selectedOptionText: {
    color: '#6B46C1',
  },
  paymentOptionDesc: {
    fontSize: 14,
    color: '#64748B',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#6B46C1',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6B46C1',
  },
  shippingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  shippingOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shippingOptionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  shippingOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  shippingOptionDesc: {
    fontSize: 14,
    color: '#64748B',
  },
  shippingOptionPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    marginTop: 2,
  },
  freeShippingTextBadge: {
    color: '#10B981',
    fontWeight: '600',
  },
  firstPurchaseContainer: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  firstPurchaseText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#065F46',
    marginTop: 4,
  },
  summaryContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  summarySeparator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 12,
  },
  summaryContent: {
    padding: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
  },
  paymentButton: {
    backgroundColor: '#6B46C1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 12,
  },
  backToHomeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#6B46C1',
    borderRadius: 8,
  },
  backToHomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 24,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 8,
  },
  redirectingText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 12,
  },
});

export default function CheckoutScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const productId = typeof id === 'string' ? id : id?.[0] || '';
  
  // Find the product from mock data
  const [product, setProduct] = useState(() => {
    return mockProducts.find(p => p.id === productId) || mockProducts[0];
  });
  
  // Payment state
  const [selectedPayment, setSelectedPayment] = useState('salame_pay');
  const [selectedShipping, setSelectedShipping] = useState('dhl_express');
  const [loading, setLoading] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  // For demo purposes, assume first purchase for the user
  const [isFirstPurchase, setIsFirstPurchase] = useState(true);
  
  // Seller qualifications data
  const sellerQualifications = [
    { icon: 'star', text: '4.9 (120 ventas)', color: '#F59E0B' },
    { icon: 'shield', text: 'Vendedor verificado', color: '#6B46C1' },
    { icon: 'clock', text: 'Responde en <1h', color: '#10B981' }
  ];
  
  // Handle payment process
  const handlePayment = () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setPaymentComplete(true);
      
      // After showing success, redirect to home
      setTimeout(() => {
        router.replace('/');
      }, 3000);
    }, 2000);
  };
  
  // Calculate total cost
  const calculateTotal = () => {
    let total = product.price;
    // Add shipping cost unless free shipping applies for first purchase
    if (!isFirstPurchase) {
      if (selectedShipping === 'dhl_express') {
        total += 8.99;
      } else {
        total += 4.99;
      }
    }
    return total;
  };
  
  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color="#EF4444" />
        <Text style={styles.errorText}>Producto no encontrado</Text>
        <TouchableOpacity
          style={styles.backToHomeButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.backToHomeText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (paymentComplete) {
    return (
      <View style={styles.successContainer}>
        <CheckCircle size={64} color="#10B981" />
        <Text style={styles.successTitle}>¡Pago completado!</Text>
        <Text style={styles.successText}>
          Tu compra ha sido procesada correctamente.
        </Text>
        <Text style={styles.redirectingText}>
          Serás redirigido en unos segundos...
        </Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <WebHeader />
      {/* @ts-ignore - TypeScript doesn't recognize JSX children properly */}
      <ResponsiveContainer webCentered={true}>
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Finalizar compra</Text>
            <View style={{ width: 40 }} /> {/* Spacer for alignment */}
          </View>
          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Free shipping banner for first purchase */}
            {isFirstPurchase && (
              <View style={styles.freeShippingBanner}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.freeShippingTextBadge}>Envío gratis con tu primera compra</Text>
              </View>
            )}
            
            {/* Product summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resumen del producto</Text>
              
              <View style={styles.productCard}>
                <Image source={{ uri: product.images[0] }} style={styles.productImage} />
                
                <View style={styles.productDetails}>
                  <Text style={styles.productTitle}>{product.title}</Text>
                  <Text style={styles.productPrice}>€{product.price}</Text>
                  <View style={styles.productMeta}>
                    <Box size={12} color="#64748B" />
                    <Text style={styles.productMetaText}>
                      {product.condition || 'Nuevo - En su embalaje original'}
                    </Text>
                  </View>
                  
                  {/* Seller qualifications */}
                  <View style={styles.sellerQualificationsContainer}>
                    {sellerQualifications.map((qual, index) => (
                      <View key={index} style={styles.qualificationItem}>
                        {qual.icon === 'star' && <Star size={12} color={qual.color} />}
                        {qual.icon === 'shield' && <Shield size={12} color={qual.color} />}
                        {qual.icon === 'clock' && <Clock size={12} color={qual.color} />}
                        <Text style={styles.qualificationText}>{qual.text}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
            
            {/* Payment options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Método de pago</Text>
              
              {/* Salame Pay option */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  selectedPayment === 'salame_pay' && styles.selectedOption
                ]}
                onPress={() => setSelectedPayment('salame_pay')}
              >
                <View style={styles.paymentOptionContent}>
                  <Wallet size={24} color={selectedPayment === 'salame_pay' ? '#6B46C1' : '#64748B'} />
                  <View style={styles.paymentOptionInfo}>
                    <Text style={[
                      styles.paymentOptionTitle,
                      selectedPayment === 'salame_pay' && styles.selectedOptionText
                    ]}>
                      Salame Pay
                    </Text>
                    <Text style={styles.paymentOptionDesc}>
                      Paga directamente con tu monedero integrado
                    </Text>
                  </View>
                </View>
                
                <View style={[
                  styles.radioButton,
                  selectedPayment === 'salame_pay' && styles.radioButtonSelected
                ]}>
                  {selectedPayment === 'salame_pay' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  selectedPayment === 'credit_card' && styles.selectedOption
                ]}
                onPress={() => setSelectedPayment('credit_card')}
              >
                <View style={styles.paymentOptionContent}>
                  <CreditCard size={24} color={selectedPayment === 'credit_card' ? '#6B46C1' : '#64748B'} />
                  <View style={styles.paymentOptionInfo}>
                    <Text style={[
                      styles.paymentOptionTitle,
                      selectedPayment === 'credit_card' && styles.selectedOptionText
                    ]}>
                      Tarjeta de crédito
                    </Text>
                    <Text style={styles.paymentOptionDesc}>
                      Paga con VISA, Mastercard o American Express
                    </Text>
                  </View>
                </View>
                
                <View style={[
                  styles.radioButton,
                  selectedPayment === 'credit_card' && styles.radioButtonSelected
                ]}>
                  {selectedPayment === 'credit_card' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            
            {/* Shipping details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Método de envío</Text>
              
              {/* First purchase badge */}
              {isFirstPurchase && (
                <View style={styles.firstPurchaseContainer}>
                  <UserQualifications isFirstPurchase={true} />
                  <Text style={styles.firstPurchaseText}>
                    ¡Envío gratis en tu primera compra!
                  </Text>
                </View>
              )}
              
              <TouchableOpacity
                style={[
                  styles.shippingOption,
                  selectedShipping === 'dhl_express' && styles.selectedOption
                ]}
                onPress={() => setSelectedShipping('dhl_express')}
              >
                <View style={styles.shippingOptionContent}>
                  <TruckIcon size={24} color={selectedShipping === 'dhl_express' ? '#6B46C1' : '#64748B'} />
                  <View style={styles.shippingOptionInfo}>
                    <Text style={[
                      styles.shippingOptionTitle,
                      selectedShipping === 'dhl_express' && styles.selectedOptionText
                    ]}>
                      DHL Express
                    </Text>
                    <Text style={styles.shippingOptionDesc}>
                      Entrega en 1-2 días hábiles
                    </Text>
                    {!isFirstPurchase && (
                      <Text style={styles.shippingOptionPrice}>
                        €8.99
                      </Text>
                    )}
                    {isFirstPurchase && (
                      <Text style={styles.freeShippingTextBadge}>
                        Gratis
                      </Text>
                    )}
                  </View>
                </View>
                
                <View style={[
                  styles.radioButton,
                  selectedShipping === 'dhl_express' && styles.radioButtonSelected
                ]}>
                  {selectedShipping === 'dhl_express' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.shippingOption,
                  selectedShipping === 'standard' && styles.selectedOption
                ]}
                onPress={() => setSelectedShipping('standard')}
              >
                <View style={styles.shippingOptionContent}>
                  <TruckIcon size={24} color={selectedShipping === 'standard' ? '#6B46C1' : '#64748B'} />
                  <View style={styles.shippingOptionInfo}>
                    <Text style={[
                      styles.shippingOptionTitle,
                      selectedShipping === 'standard' && styles.selectedOptionText
                    ]}>
                      Envío estándar
                    </Text>
                    <Text style={styles.shippingOptionDesc}>
                      Entrega en 3-5 días hábiles
                    </Text>
                    {!isFirstPurchase && (
                      <Text style={styles.shippingOptionPrice}>
                        €4.99
                      </Text>
                    )}
                    {isFirstPurchase && (
                      <Text style={styles.freeShippingTextBadge}>
                        Gratis
                      </Text>
                    )}
                  </View>
                </View>
                
                <View style={[
                  styles.radioButton,
                  selectedShipping === 'standard' && styles.radioButtonSelected
                ]}>
                  {selectedShipping === 'standard' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            
            {/* Order summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resumen del pedido</Text>
              
              <View style={styles.summaryContainer}>
                <View style={styles.summarySeparator} />
                
                <View style={styles.summaryContent}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Producto</Text>
                    <Text style={styles.summaryValue}>€{product.price}</Text>
                  </View>
                  
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Envío</Text>
                    <Text style={[styles.summaryValue, isFirstPurchase && styles.freeShippingTextBadge]}>
                      {isFirstPurchase 
                        ? 'Gratis' 
                        : (selectedShipping === 'dhl_express' ? '€8.99' : '€4.99')}
                    </Text>
                  </View>
                  
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>€{calculateTotal().toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Payment button */}
            <TouchableOpacity
              style={styles.paymentButton}
              onPress={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.paymentButtonText}>
                  Realizar pago
                </Text>
              )}
            </TouchableOpacity>
            
            <View style={{ height: 40 }} /> {/* Bottom spacing */}
          </ScrollView>
        </View>
      </ResponsiveContainer>
    </SafeAreaView>
  );
}

// Duplicate styles definition removed - already defined at top of file
