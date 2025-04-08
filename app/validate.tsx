import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { config } from './config';

export default function CheckInScreen() {
  const [ticketCode, setTicketCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { token } = useAuth();

  const handleCheckIn = async () => {
    if (!ticketCode.trim()) {
      Alert.alert('Error', 'Please enter a ticket code');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'Please login first');
      router.push('/');
      return;
    }

    setIsLoading(true);
    try {

      const response = await fetch(`${config.apiBaseUrl}/checkin-app/validate/${ticketCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}`,
        },
      });
      const data = await response.json();
      if (response.status === 409 && data.ticket && data.checkinRecord) {
        Alert.alert('Already Checked In', 'This ticket was already checked in.');
        router.push({
          pathname: '/ticket-details',
          params: {
            ticket: JSON.stringify(data.ticket),
            checkinRecord: JSON.stringify(data.checkinRecord),
          },
        });
        return;
      }
  

      if (response.status === 404) {
        Alert.alert('Not Found', data.error|| 'Ticket not found');
        return;
      }

      router.push({
        pathname: '/ticket-details',
        params: { ticket: JSON.stringify(data.ticket) }
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to check in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter ticket code"
        value={ticketCode}
        onChangeText={setTicketCode}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleCheckIn}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Checking in...' : 'Check In'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 