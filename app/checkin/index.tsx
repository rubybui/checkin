import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import {
  AppState,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function CheckinScreen() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const checkedIn = 23;
  const totalTickets = 100;
  const router = useRouter();
  const { user, logout } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Request camera permission if authenticated
    const setupCamera = async () => {
      try {
        if (!permission?.granted) {
          const { granted } = await requestPermission();
          if (!granted) {
            Alert.alert(
              'Camera Permission Required',
              'Please grant camera permission to scan QR codes',
              [
                { text: 'Cancel', onPress: () => router.back() },
                { text: 'Open Settings', onPress: () => Linking.openSettings() }
              ]
            );
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error setting up camera:', error);
        setIsLoading(false);
      }
    };

    setupCamera();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Camera Permission Required</Text>
        <TouchableOpacity style={styles.scanButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      
      {/* Header with Logout */}
      <View style={styles.header}>
        <Text style={styles.title}>Scan QR code</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Place QR code inside the frame to scan please{'\n'}avoid shake to get results quickly
      </Text>

      {/* Scan Area with Camera */}
      <View style={styles.scanFrame}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              qrLock.current = true;
              setTimeout(() => {
                router.push('/ticket-result');
              }, 500);
            }
          }}
        />
      </View>

      {/* Scanning status */}
      <Text style={styles.scanningText}>Scanning Code...</Text>

      {/* Ticket Counter */}
      <Text style={styles.counterText}>{checkedIn} / {totalTickets} Checked In</Text>

      {/* Icon Bar */}
      <View style={styles.iconBar}>
        <TouchableOpacity>
          <Ionicons name="image-outline" size={28} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="keyboard" size={28} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/history')}>
          <Ionicons name="flashlight-outline" size={28} color="#999" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7BC67E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.8,
  },
  scanFrame: {
    width: '80%',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 20,
    marginBottom: 30,
  },
  scanningText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  counterText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  iconBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 30,
  },
  scanButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    width: '80%',
  },
  buttonText: {
    color: '#7BC67E',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  logoutButton: {
    padding: 8,
  },
}); 