import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { config } from './config';
import { Ionicons } from '@expo/vector-icons';

export default function ValidateScreen() {
  const [ticketCode, setTicketCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [multipleTickets, setMultipleTickets] = useState<any[]>([]);
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

      if (response.status === 300 && data.tickets) {
        setMultipleTickets(data.tickets);
        console.log('Multiple tickets found:', data.tickets)
        return;
      }

      if (response.status === 409 && data.ticket && data.checkinRecord) {
        Alert.alert('Already Checked In', 'This ticket was already checked in.');
        const encodedTicket = encodeURIComponent(JSON.stringify({
          code: data.ticket.ticketCode,
          attendeeName: data.ticket.attendeeName,
          eventName: data.ticket.eventTitle,
          eventTime: data.ticket.scheduleDate.split(" ")[0],
          seat: data.ticket.seat,
          orderId: data.ticket.ticketCode
        }));
        const encodedCheckinRecord = encodeURIComponent(JSON.stringify(data.checkinRecord));
        router.push({
          pathname: '/ticket-details',
          params: {
            ticket: encodedTicket,
            checkinRecord: encodedCheckinRecord
          }
        });
        return;
      }

      if (response.status === 404) {
        Alert.alert('Not Found', data.error || 'Ticket not found');
        return;
      }

      const encodedTicket = encodeURIComponent(JSON.stringify({
        code: data.ticket.ticketCode,
        attendeeName: data.ticket.attendeeName,
        eventName: data.ticket.eventTitle,
        eventTime: data.ticket.scheduleDate.split(" ")[0],
        seat: data.ticket.seat,
        orderId: data.ticket.ticketCode
      }));

      router.push({
        pathname: '/ticket-details',
        params: { ticket: encodedTicket }
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to check in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTicket = (ticket: any) => {
    const encodedTicket = encodeURIComponent(JSON.stringify({
      code: ticket.ticketCode,
      attendeeName: ticket.attendeeName,
      eventName: ticket.eventTitle,
      eventLocation: ticket.eventLocation,
      eventTime: ticket.scheduleDate
        ? ticket.scheduleDate.split(" ")[0]
        : 'Invalid date',
      seat: ticket.seat,
      orderId: ticket.ticketCode
    }));

    const params: any = { ticket: encodedTicket };
    if (ticket.isCheckedIn && ticket.checkinRecord) {
      params.checkinRecord = encodeURIComponent(JSON.stringify(ticket.checkinRecord));
    }

    router.push({
      pathname: '/ticket-details',
      params
    });
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
          {isLoading ? 'Validating...' : 'Validate Ticket'}
        </Text>
      </TouchableOpacity>
      <View style={{ alignItems: 'flex-end', marginBottom: 10 }}>
  <TouchableOpacity onPress={() => router.push('/history')}>
    <View style={styles.historyButton}>
      <Ionicons name="time-outline" size={16} color="#007AFF" style={{ marginRight: 4 }} />
      <Text style={styles.historyText}>View History</Text>
    </View>
  </TouchableOpacity>
</View>


      {multipleTickets.length > 0 && (
        <View style={styles.multipleTicketsContainer}>
          <Text style={styles.sectionTitle}>Multiple Tickets Found</Text>
          <ScrollView style={styles.ticketList}>
            {multipleTickets.map((ticket, index) => (
              <TouchableOpacity
                key={`ticket-${ticket.ticketCode}-${index}`}
                style={[styles.ticketItem, ticket.isCheckedIn && styles.ticketItemCheckedIn]}
                onPress={() => handleSelectTicket(ticket)}
              >
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketCode}>{ticket.ticketCode}</Text>
                  <View style={[styles.statusBadge, ticket.isCheckedIn ? styles.statusBadgeUsed : styles.statusBadgeValid]}>
                    <Ionicons
                      name={ticket.isCheckedIn ? "close-circle" : "checkmark-circle"}
                      size={16}
                      color="#fff"
                      style={styles.statusIcon}
                    />
                    <Text style={styles.ticketStatus}>
                      {ticket.isCheckedIn ? 'Used' : 'Valid'}
                    </Text>
                  </View>
                </View>
                <View style={styles.ticketDetails}>
                  <Text style={styles.ticketInfo}>
                    <Text style={styles.label}>Event: </Text>
                    {ticket.eventTitle} — {ticket.eventLocation}
                  </Text>
                  <Text style={styles.ticketInfo}>
                    <Text style={styles.label}>Schedule: </Text>
                    {ticket.scheduleDate.split(" ")[0]}
                  </Text>
                  <Text style={styles.ticketInfo}>
                    <Text style={styles.label}>Seat: </Text>
                    {ticket.seat || 'N/A'}
                  </Text>
                  {ticket.isCheckedIn && ticket.checkinRecord && (
                    <Text style={styles.ticketInfo}>
                      <Text style={styles.label}>Checked in: </Text>
                      {new Date(ticket.checkinRecord.checkedInAt).toLocaleString()}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  historyText: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 14,
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
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  multipleTicketsContainer: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15 },
  ticketList: { flex: 1 },
  ticketItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  ticketItemCheckedIn: {
    borderLeftColor: '#FF5C5C',
    backgroundColor: '#fff5f5',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ticketCode: { fontSize: 16, fontWeight: '600', color: '#333' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  statusBadgeValid: { backgroundColor: '#4CAF50' },
  statusBadgeUsed: { backgroundColor: '#FF5C5C' },
  statusIcon: { marginRight: 4 },
  ticketStatus: { fontSize: 14, color: '#fff', fontWeight: '500' },
  ticketDetails: { gap: 8 },
  ticketInfo: { fontSize: 14, color: '#666' },
  label: { fontWeight: '500', color: '#333' },
});
