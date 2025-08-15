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
  Switch,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Camera, 
  ImagePlus, 
  MapPin, 
  Trash2, 
  Tag, 
  ArrowRight, 
  DollarSign,
  MessageCircle,
  Clock,
  Percent
} from 'lucide-react-native';
import { WebHeader } from '@/components/WebHeader';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';

export default function PublishScreen() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState(['https://via.placeholder.com/300']);
  
  // Automatic offer handling
  const [enableAutomaticOffers, setEnableAutomaticOffers] = useState(true);
  const [minOfferPrice, setMinOfferPrice] = useState('');
  const [autoAcceptMessage, setAutoAcceptMessage] = useState(
    '¡Gracias por tu oferta! Ha sido aceptada automáticamente. Procede con el pago para completar la compra.'
  );
  const [autoRejectMessage, setAutoRejectMessage] = useState(
    'Lo sentimos, tu oferta está por debajo del mínimo aceptable. Intenta con una cantidad mayor.'
  );
  
  // Shipping options
  const [enableDHL, setEnableDHL] = useState(true);
  const [enableSalamePay, setEnableSalamePay] = useState(true);
  const [enableFreeFirstPurchase, setEnableFreeFirstPurchase] = useState(true);
  
  const calculateMinOfferPercent = () => {
    if (!price || !minOfferPrice) return 0;
    const priceValue = parseFloat(price);
    const minValue = parseFloat(minOfferPrice);
    return priceValue > 0 ? Math.round((minValue / priceValue) * 100) : 0;
  };
  
  const handleMinOfferPercentChange = (percent: number) => {
    if (!price) return;
    const priceValue = parseFloat(price);
    if (priceValue > 0) {
      setMinOfferPrice((priceValue * (percent / 100)).toFixed(2));
    }
  };
  
  // Process an offer and determine if it should be automatically accepted or rejected
  const processOffer = (offerAmount: number) => {
    if (!enableAutomaticOffers || !minOfferPrice) {
      // Auto-handling disabled, offer requires manual review
      return { autoHandled: false };
    }
    
    const minAmount = parseFloat(minOfferPrice);
    if (offerAmount >= minAmount) {
      // Auto-accept the offer
      return {
        autoHandled: true,
        accepted: true,
        message: autoAcceptMessage
      };
    } else {
      // Auto-reject the offer
      return {
        autoHandled: true,
        accepted: false,
        message: autoRejectMessage
      };
    }
  };
  
  const handleSubmit = () => {
    // Validation
    if (!title || !description || !price || !category || images.length === 0) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos requeridos');
      return;
    }
    
    // Validate min offer price if automatic offers are enabled
    if (enableAutomaticOffers && !minOfferPrice) {
      Alert.alert(
        'Precio mínimo requerido', 
        'Por favor establece un precio mínimo para ofertas automáticas o desactiva esta opción'
      );
      return;
    }
    
    // In a real app, this would send data to the backend
    Alert.alert(
      '¡Publicación exitosa!',
      'Tu producto ha sido publicado correctamente',
      [{ text: 'OK', onPress: () => router.replace('/') }]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <WebHeader />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publicar producto</Text>
        <View style={{ width: 40 }} /> {/* Spacer for alignment */}
      </View>
      
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingContainer}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Images section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Fotos del producto</Text>
              <Text style={styles.sectionSubtitle}>Agrega hasta 5 fotos</Text>
              
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageScrollContainer}
              >
                {images.map((image: string, index: number) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.productImage} />
                    <TouchableOpacity
                      style={styles.deleteImageButton}
                      onPress={() => setImages(images.filter((_: string, i: number) => i !== index))}
                    >
                      <Trash2 size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
                
                {images.length < 5 && (
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={() => setImages([...images, 'https://via.placeholder.com/300'])}
                  >
                    <ImagePlus size={32} color="#6B46C1" />
                    <Text style={styles.addImageText}>Agregar foto</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
            
            {/* Basic information */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Información básica</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Título</Text>
                <TextInput
                  style={styles.textInput}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Ej. iPhone 13 Pro Max 256GB"
                  placeholderTextColor="#94A3B8"
                  maxLength={100}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Descripción</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe tu producto, estado, características..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Categoría</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => {
                    // In a real app, this would open a category picker
                    setCategory('Electrónicos');
                  }}
                >
                  <Text style={category ? styles.pickerText : styles.pickerPlaceholder}>
                    {category || 'Seleccionar categoría'}
                  </Text>
                  <ArrowRight size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ubicación</Text>
                <TouchableOpacity style={styles.locationButton}>
                  <MapPin size={16} color="#6B46C1" />
                  <Text style={styles.locationText}>Usar mi ubicación actual</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Pricing and offer settings */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Precio y ofertas</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Precio de publicación</Text>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={price}
                    onChangeText={(value: string) => {
                      setPrice(value);
                      if (minOfferPrice && value) {
                        // Maintain the same percentage when price changes
                        const percent = calculateMinOfferPercent();
                        handleMinOfferPercentChange(percent);
                      }
                    }}
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.switchContainer}>
                <View style={styles.switchLabelContainer}>
                  <Tag size={20} color="#6B46C1" />
                  <Text style={styles.switchLabel}>Habilitar ofertas automáticas</Text>
                </View>
                <Switch
                  value={enableAutomaticOffers}
                  onValueChange={setEnableAutomaticOffers}
                  trackColor={{ false: '#E2E8F0', true: '#DDD6FE' }}
                  thumbColor={enableAutomaticOffers ? '#6B46C1' : '#F8FAFC'}
                />
              </View>
              
              {enableAutomaticOffers && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Precio mínimo para ofertas automáticas</Text>
                    <View style={styles.priceInputContainer}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.priceInput}
                        value={minOfferPrice}
                        onChangeText={setMinOfferPrice}
                        placeholder="0.00"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                      />
                    </View>
                    
                    <View style={styles.percentageContainer}>
                      <Text style={styles.percentageLabel}>
                        {calculateMinOfferPercent()}% del precio original
                      </Text>
                      
                      <View style={styles.percentageButtons}>
                        {[70, 80, 90].map((percent) => (
                          <TouchableOpacity
                            key={percent}
                            style={styles.percentButton}
                            onPress={() => handleMinOfferPercentChange(percent)}
                          >
                            <Text style={styles.percentButtonText}>{percent}%</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Mensaje de aceptación automática</Text>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      value={autoAcceptMessage}
                      onChangeText={setAutoAcceptMessage}
                      placeholder="Mensaje para ofertas aceptadas automáticamente"
                      placeholderTextColor="#94A3B8"
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Mensaje de rechazo automático</Text>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      value={autoRejectMessage}
                      onChangeText={setAutoRejectMessage}
                      placeholder="Mensaje para ofertas rechazadas automáticamente"
                      placeholderTextColor="#94A3B8"
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>
                </>
              )}
            </View>
            
            {/* Shipping options */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Opciones de envío</Text>
              
              <View style={styles.switchContainer}>
                <View style={styles.switchLabelContainer}>
                  <Clock size={20} color="#6B46C1" />
                  <Text style={styles.switchLabel}>DHL Express (recomendado)</Text>
                </View>
                <Switch
                  value={enableDHL}
                  onValueChange={setEnableDHL}
                  trackColor={{ false: '#E2E8F0', true: '#DDD6FE' }}
                  thumbColor={enableDHL ? '#6B46C1' : '#F8FAFC'}
                />
              </View>
              
              <View style={styles.switchContainer}>
                <View style={styles.switchLabelContainer}>
                  <DollarSign size={20} color="#6B46C1" />
                  <Text style={styles.switchLabel}>Salame Pay (pago integrado)</Text>
                </View>
                <Switch
                  value={enableSalamePay}
                  onValueChange={setEnableSalamePay}
                  trackColor={{ false: '#E2E8F0', true: '#DDD6FE' }}
                  thumbColor={enableSalamePay ? '#6B46C1' : '#F8FAFC'}
                />
              </View>
              
              <View style={styles.switchContainer}>
                <View style={styles.switchLabelContainer}>
                  <Percent size={20} color="#6B46C1" />
                  <Text style={styles.switchLabel}>Envío gratis en primera compra</Text>
                </View>
                <Switch
                  value={enableFreeFirstPurchase}
                  onValueChange={setEnableFreeFirstPurchase}
                  trackColor={{ false: '#E2E8F0', true: '#DDD6FE' }}
                  thumbColor={enableFreeFirstPurchase ? '#6B46C1' : '#F8FAFC'}
                />
              </View>
            </View>
            
            {/* Publish button */}
            <TouchableOpacity
              style={styles.publishButton}
              onPress={handleSubmit}
            >
              <Text style={styles.publishButtonText}>Publicar producto</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
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
    zIndex: 10,
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
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  imageScrollContainer: {
    paddingRight: 8,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#DDD6FE',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
  },
  addImageText: {
    fontSize: 12,
    color: '#6B46C1',
    marginTop: 4,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    minHeight: 100,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  pickerText: {
    fontSize: 16,
    color: '#0F172A',
  },
  pickerPlaceholder: {
    fontSize: 16,
    color: '#94A3B8',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B46C1',
    fontWeight: '500',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B46C1',
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    padding: 12,
    fontSize: 18,
    color: '#0F172A',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#0F172A',
    marginLeft: 10,
  },
  percentageContainer: {
    marginTop: 8,
  },
  percentageLabel: {
    fontSize: 14,
    color: '#6B46C1',
    marginBottom: 8,
  },
  percentageButtons: {
    flexDirection: 'row',
  },
  percentButton: {
    backgroundColor: '#F3E8FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  percentButtonText: {
    fontSize: 14,
    color: '#6B46C1',
    fontWeight: '500',
  },
  publishButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
