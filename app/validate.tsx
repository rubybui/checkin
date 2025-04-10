import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { config } from './config';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './theme';

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
          Authorization: `JWT ${token}`,
        },
      });
      const data = await response.json();

      if (response.status === 300 && data.tickets) {
        setMultipleTickets(data.tickets);
        return;
      }
      if (response.status === 409 && data.ticket && data.checkinRecord) {
        const encodedTicket = encodeURIComponent(JSON.stringify({
          code: data.ticket.ticketCode,
          attendeeName: data.ticket.attendeeName,
          eventName: data.ticket.eventTitle,
          eventTime: data.ticket.scheduleDate.split(' ')[0],
          seat: data.ticket.seat,
        }));
        const encodedCheckinRecord = encodeURIComponent(JSON.stringify(data.checkinRecord));
        router.push({ pathname: '/ticket-details', params: { ticket: encodedTicket, checkinRecord: encodedCheckinRecord } });
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
        eventTime: data.ticket.scheduleDate.split(' ')[0],
        seat: data.ticket.seat,
      }));
      router.push({ pathname: '/ticket-details', params: { ticket: encodedTicket } });
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
      eventTime: ticket.scheduleDate ? ticket.scheduleDate.split(' ')[0] : 'Invalid date',
      seat: ticket.seat,
    }));
    const params: any = { ticket: encodedTicket };
    if (ticket.isCheckedIn && ticket.checkinRecord) {
      params.checkinRecord = encodeURIComponent(JSON.stringify(ticket.checkinRecord));
    }
    router.push({ pathname: '/ticket-details', params });
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

      <View style={styles.historyContainer}>
        <TouchableOpacity onPress={() => router.push('/history')}>
          <View style={styles.historyButton}>
            <Ionicons name="time-outline" size={16} color={theme.colors.primary} style={{ marginRight: 4 }} />
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
                    <Ionicons name={ticket.isCheckedIn ? 'close-circle' : 'checkmark-circle'} size={16} color="#fff" style={styles.statusIcon} />
                    <Text style={styles.ticketStatus}>{ticket.isCheckedIn ? 'Used' : 'Valid'}</Text>
                  </View>
                </View>
                <View style={styles.ticketDetails}>
                  <Text style={styles.ticketInfo}><Text style={styles.label}>Event: </Text>{ticket.eventTitle} — {ticket.eventLocation}</Text>
                  <Text style={styles.ticketInfo}><Text style={styles.label}>Schedule: </Text>{ticket.scheduleDate.split(' ')[0]}</Text>
                  <Text style={styles.ticketInfo}><Text style={styles.label}>Seat: </Text>{ticket.seat || 'N/A'}</Text>
                  {ticket.isCheckedIn && ticket.checkinRecord && (
                    <Text style={styles.ticketInfo}><Text style={styles.label}>Checked in: </Text>{ticket.checkinRecord.checkInTime.split('T')[0]}</Text>
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
  container: { flex: 1, padding: theme.spacing.md, backgroundColor: theme.colors.background },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.font.size.base,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: theme.font.size.base, fontWeight: theme.font.weight.medium },
  historyContainer: { alignItems: 'flex-end', marginBottom: theme.spacing.sm },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  historyText: {
    color: theme.colors.primary,
    fontWeight: theme.font.weight.medium,
    fontSize: theme.font.size.sm,
  },
  multipleTicketsContainer: { flex: 1 },
  sectionTitle: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  ticketList: { flex: 1 },
  ticketItem: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  ticketItemCheckedIn: {
    borderLeftColor: theme.colors.error,
    backgroundColor: '#fff5f5',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  ticketCode: { fontSize: theme.font.size.base, fontWeight: theme.font.weight.medium, color: theme.colors.text },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  statusBadgeValid: { backgroundColor: theme.colors.success },
  statusBadgeUsed: { backgroundColor: theme.colors.error },
  statusIcon: { marginRight: 4 },
  ticketStatus: { fontSize: theme.font.size.sm, color: '#fff', fontWeight: theme.font.weight.medium },
  ticketDetails: { gap: 8 },
  ticketInfo: { fontSize: theme.font.size.sm, color: theme.colors.subtext },
  label: { fontWeight: theme.font.weight.medium, color: theme.colors.text },
});