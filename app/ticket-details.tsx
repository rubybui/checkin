import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { config } from './config';
import { useAuth } from './context/AuthContext';

export default function TicketDetailsScreen() {
  const { ticket, checkinRecord } = useLocalSearchParams();
  const ticketData = JSON.parse(ticket as string);
  const checkinData = checkinRecord ? JSON.parse(checkinRecord as string) : null;

  const router = useRouter();
  const { user } = useAuth();

  const alreadyCheckedIn = !!checkinData;
  console.log('checkinData', checkinData);

  const handleCheckIn = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/checkin-app/checkin/${ticketData.ticketCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${user?.token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to check in');
      }

      const data = await response.json();
      Alert.alert('Success', 'Ticket checked in successfully');
      router.replace({
        pathname: '/ticket-details',
        params: {
          ticket: JSON.stringify(data.ticket),
          checkinRecord: JSON.stringify(data.checkinRecord || { checkedInAt: new Date().toISOString() }),
        },
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to check in');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, alreadyCheckedIn ? styles.cardUsed : styles.cardValid]}>
      <Text style={styles.ticketCode}>TICKET #{ticketData.code}</Text>

<View style={styles.successIcon}>
  <Ionicons
    name={alreadyCheckedIn ? 'close-circle' : 'checkmark-circle'}
    size={80}
    color="#fff"
  />
</View>

<Text style={styles.successText}>
  {alreadyCheckedIn ? 'ALREADY CHECKED IN' : 'VALID TICKET'}
</Text>

{alreadyCheckedIn && (
  <View style={styles.checkinBox}>
    <Text style={styles.checkinLabel}>Checked in at:</Text>
    <Text style={styles.checkinValue}>
      {new Date(checkinData.checkInTime).toLocaleString()}
    </Text>
    <Text style={styles.checkinLabel}>Checked in by:</Text>
    <Text style={styles.checkinValue}>
      {checkinData.checkedInBy.email} {/* Hiển thị email của người check-in */}
    </Text>
  </View>
)}

<View style={styles.divider} />
<Text style={styles.sectionTitle}>TICKET INFORMATION</Text>

<View style={styles.infoContainer}>
  <View style={styles.infoRow}>
    <Text style={styles.label}>NAME:</Text>
    <Text style={styles.value}>{ticketData.attendeeName || 'N/A'}</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.label}>COUNT:</Text>
    <Text style={styles.value}>{ticketData.quantity || 1}</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.label}>ORDER ID:</Text>
    <View style={styles.orderIdContainer}>
      <Text style={styles.orderIdText}>{ticketData.orderId || ticketData.code}</Text>
    </View>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.label}>EVENT NAME:</Text>
    <Text style={styles.value}>{ticketData.eventName || 'Event'}</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.label}>EVENT TIME:</Text>
    <Text style={styles.value}>{ticketData.eventTime || new Date().toLocaleString()}</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.label}>STATUS:</Text>
    <Text style={[styles.value, alreadyCheckedIn ? styles.statusUsed : styles.statusValid]}>
      {alreadyCheckedIn ? 'Used' : 'Valid'}
    </Text>
  </View>

  {alreadyCheckedIn && (
    <View style={styles.infoRow}>
      <Text style={styles.label}>CHECKED IN AT:</Text>
      <Text style={styles.value}>
        {new Date(checkinData.checkedInAt).toLocaleString()}
      </Text>
    </View>
  )}
</View>

<TouchableOpacity
  style={[styles.button, alreadyCheckedIn && styles.buttonDisabled]}
  onPress={handleCheckIn}
  disabled={alreadyCheckedIn}
>
  <Text style={[styles.buttonText, alreadyCheckedIn && styles.buttonTextDisabled]}>
    {alreadyCheckedIn ? 'TICKET ALREADY USED' : 'CHECK IN TICKET'}
  </Text>
</TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardValid: {
    backgroundColor: '#7BC67E',
  },
  cardUsed: {
    backgroundColor: '#FF5C5C',
  },
  ticketCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  successIcon: {
    marginVertical: 20,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#fff',
    width: '100%',
    marginVertical: 20,
    opacity: 0.5,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    fontWeight: '600',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    flex: 2,
    fontSize: 14,
    color: '#333',
  },
  statusValid: {
    color: '#7BC67E',
    fontWeight: '600',
  },
  statusUsed: {
    color: '#FF5C5C',
    fontWeight: '600',
  },
  orderIdContainer: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
  },
  orderIdText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#7BC67E',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#eee',
  },
  buttonTextDisabled: {
    color: '#aaa',
  },
  checkinBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  checkinLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  checkinValue: {
    fontSize: 14,
    color: '#555',
  },  
});
