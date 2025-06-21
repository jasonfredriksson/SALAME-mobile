import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Camera, XCircle, Image as ImageIcon, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  { id: 'clothing', name: 'Ropa y accesorios' },
  { id: 'electronics', name: 'Electrónica' },
  { id: 'home', name: 'Hogar y jardín' },
  { id: 'sports', name: 'Deportes' },
  { id: 'toys', name: 'Juguetes y juegos' },
  { id: 'books', name: 'Libros' },
  { id: 'other', name: 'Otros' },
];

export default function SellScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleSubmit = () => {
    // In a real app, this would save the listing to your backend
    alert('¡Publicación creada con éxito!');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Vender un artículo</Text>
          </View>

          <View style={styles.photoSection}>
            <Text style={styles.sectionTitle}>Fotos</Text>
            <Text style={styles.sectionSubtitle}>
              Agrega hasta 8 fotos. La primera será la portada.
            </Text>
            <View style={styles.photoGrid}>
              <TouchableOpacity style={styles.addPhotoButton}>
                <Camera size={24} color="#0072CE" />
                <Text style={styles.addPhotoText}>Cámara</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addPhotoButton}>
                <ImageIcon size={24} color="#0072CE" />
                <Text style={styles.addPhotoText}>Galería</Text>
              </TouchableOpacity>
              {/* Empty placeholder photo slots */}
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <View key={index} style={styles.emptyPhotoSlot} />
                ))}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Detalles</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Título</Text>
              <TextInput
                style={styles.textInput}
                placeholder="¿Qué estás vendiendo?"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Precio</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$ARS</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="0.00"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Categoría</Text>
              <TouchableOpacity
                style={styles.categorySelector}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                <Text style={category ? styles.selectedCategory : styles.placeholderText}>
                  {category ? CATEGORIES.find(c => c.id === category)?.name : 'Selecciona una categoría'}
                </Text>
                <ChevronDown size={20} color="#64748B" />
              </TouchableOpacity>
              
              {showCategoryPicker && (
                <View style={styles.categoryDropdown}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={styles.categoryOption}
                      onPress={() => {
                        setCategory(cat.id);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        cat.id === category && styles.selectedCategoryOption
                      ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descripción</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Describe tu artículo (condición, tamaño, etc.)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                placeholderTextColor="#94A3B8"
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              (!title || !price || !category || !description) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!title || !price || !category || !description}
          >
            <Text style={styles.submitButtonText}>Crear publicación</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
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
  photoSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  addPhotoButton: {
    width: '25%',
    aspectRatio: 1,
    padding: 4,
  },
  addPhotoButtonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderStyle: 'dashed',
  },
  addPhotoText: {
    marginTop: 4,
    fontSize: 12,
    color: '#0072CE',
  },
  emptyPhotoSlot: {
    width: '25%',
    aspectRatio: 1,
    padding: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    margin: 4,
  },
  formSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0F172A',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  currencySymbol: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#64748B',
  },
  priceInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#0F172A',
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
  },
  placeholderText: {
    color: '#94A3B8',
    fontSize: 16,
  },
  selectedCategory: {
    color: '#0F172A',
    fontSize: 16,
  },
  categoryDropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  categoryOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#334155',
  },
  selectedCategoryOption: {
    color: '#0072CE',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  submitButton: {
    backgroundColor: '#0072CE',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});