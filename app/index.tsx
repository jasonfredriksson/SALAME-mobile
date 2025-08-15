import { Redirect, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { WebHeader } from '@/components/WebHeader';

export default function Index() {
  const router = useRouter();
  
  const goToPublish = () => {
    router.push('/publish');
  };

  return (
    <>
      <WebHeader />
      
      {/* Floating action button for publishing */}
      <TouchableOpacity style={styles.publishFAB} onPress={goToPublish}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Redirect href="/(tabs)" />
    </>
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
});