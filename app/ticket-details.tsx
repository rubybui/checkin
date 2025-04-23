import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { config } from './config';
import { useAuth } from './context/AuthContext';
import { theme } from './theme';

const screenWidth = Dimensions.get('window').width;

export default function TicketDetailsScreen() {
  const { ticket, checkinRecord } = useLocalSearchParams();

  const ticketData = ticket ? JSON.parse(decodeURIComponent(ticket as string)) : null;
  const checkinData = checkinRecord ? JSON.parse(decodeURIComponent(checkinRecord as string)) : null;
  const alreadyCheckedIn = !!checkinData;

  const router = useRouter();
  const { user } = useAuth();

  const handleCheckIn = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/checkin-app/checkin/${ticketData.code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${user?.token}`,
        },
        body: JSON.stringify({ eventDate: ticketData.eventTime })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to check in');
      }

      Alert.alert('Success', 'Ticket checked in successfully', [
        { text: 'OK', onPress: () => router.push('/validate') },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to check in');
    }
  };

  if (!ticketData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid ticket data</Text>
      </View>
    );
  }
  const categories = [
    {
      id: 'zone1',
      name: 'Zone 1',
      color: '#B60208',
      textColor: '#fff',
    },
    {
      id: 'zone2',
      name: 'Zone 2',
      color: '#F99446',
      textColor: '#fff',
    },
    {
      id: 'zone3',
      name: 'Zone 3',
      color: '#d9cc09',
      textColor: '#fff',
    },
    {
      id: 'zone4',
      name: 'Zone 4',
      color: '#1EB0EF',
      textColor: '#fff',
    },
    {
      id: 'zone5',
      name: 'Zone 5',
      color: '#0FAD4F',
      textColor: '#fff',
    },
  ]

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              categories.find((c) => c.id === ticketData.ticketPriceInfo?.key)?.color,
          },
        ]}
      >
        <Ionicons
          name={alreadyCheckedIn ? 'close-circle' : 'checkmark-circle'}
          size={80}
          color={'#fff'}
          style={styles.statusIcon}
        />
        <Text style={styles.statusText}>
          {alreadyCheckedIn ? 'TICKET USED' : 'VALID TICKET'}
        </Text>
        <Text style={styles.ticketCode}>#{ticketData.code}</Text>

        {alreadyCheckedIn && (
          <View style={styles.infoBox}>
            <Text style={styles.detailLabel}>Checked in at</Text>
            <Text style={styles.detailValue}>{new Date(checkinData.checkedInAt).toLocaleString()}</Text>
            <Text style={styles.detailLabel}>By</Text>
            <Text style={styles.detailValue}>{checkinData.checkedInBy?.email || 'N/A'}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TICKET DETAILS</Text>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Name:</Text><Text style={styles.detailValue}>{ticketData.attendeeName}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Event:</Text><Text style={styles.detailValue}>{ticketData.eventName}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Date:</Text><Text style={styles.detailValue}>{ticketData.eventTime}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Email:</Text><Text style={styles.detailValue}>{ticketData.email}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Phone Number:</Text><Text style={styles.detailValue}>{ticketData.phoneNumber}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Ticket Type:</Text><Text style={styles.detailValue}>{ticketData.ticketPriceInfo.name}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Seat:</Text><Text style={styles.detailValue}>{ticketData.seat}</Text></View>

        </View>

        <TouchableOpacity
          style={[styles.button, alreadyCheckedIn && styles.buttonDisabled]}
          onPress={handleCheckIn}
          disabled={alreadyCheckedIn}
        >
          <Text style={[styles.buttonText, alreadyCheckedIn && styles.buttonTextDisabled]}>
            {alreadyCheckedIn ? 'ALREADY CHECKED IN' : 'CHECK IN NOW'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  errorText: {
    marginTop: theme.spacing.lg,
    textAlign: 'center',
    color: theme.colors.error,
    fontSize: theme.font.size.md,
  },
  card: {
    width: screenWidth - 40,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  statusIcon: {
    marginBottom: theme.spacing.sm,
  },
  statusText: {
    color: '#fff',
    fontSize: theme.font.size.lg,
    fontWeight: theme.font.weight.bold,
    marginBottom: theme.spacing.sm,
  },
  ticketCode: {
    color: '#fff',
    fontSize: theme.font.size.base,
    marginBottom: theme.spacing.md,
    fontWeight: theme.font.weight.medium,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  section: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: theme.font.size.sm,
    color: theme.colors.subtext,
    flexShrink: 1,
    flexBasis: '40%',
  },
  detailValue: {
    fontSize: theme.font.size.sm,
    color: theme.colors.text,
    fontWeight: theme.font.weight.medium,
    flexShrink: 1,
    flexBasis: '58%',
    textAlign: 'right',
  },
  button: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.success,
    fontSize: theme.font.size.base,
    fontWeight: theme.font.weight.bold,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.lightGray,
  },
  buttonTextDisabled: {
    color: theme.colors.muted,
  },
});
