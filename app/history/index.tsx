import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { config } from '../config';
import { useAuth } from '../context/AuthContext';

const HistoryScreen = () => {
  const [checkins, setCheckins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { token } = useAuth();

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/checkin-app/history-checkin-record`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      const data = await response.json();
      setCheckins(data.records || []);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredCheckins = checkins.filter((item) => {
    const matchesSearch =
      item.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ticket?.seat?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/checkin-app/checkin/${id}/delete-checkin`, {
        method: 'POST',
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Failed to delete record');
        return;
      }

      setCheckins((prev) => prev.filter((item) => item.ticketCode !== id));
      alert('Record deleted successfully');
    } catch (_err) {
      alert('Failed to delete record');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Text style={styles.title}>Check-In History</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <View style={styles.closeButton}>
            <Ionicons name="close" size={20} color="#E6895C" />
          </View>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by ticket code or seat..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView style={styles.historyList}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#E6895C" style={{ marginTop: 40 }} />
        ) : filteredCheckins.length === 0 ? (
          <Text style={styles.noRecords}>No records found</Text>
        ) : (
          filteredCheckins.map((item, index) => (
            <View key={item.id || index} style={styles.historyItem}>
              <View style={styles.itemLeft}>
                <Ionicons name="time-outline" size={24} color="#E6895C" />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.ticketCode} — {item.attendeeName}</Text>
                  <Text style={styles.itemText}>{item.eventTitle}</Text>
                  <Text style={styles.itemText}>Seat: {item.ticket?.seat || 'N/A'}</Text>
                  <Text style={styles.itemText}>Checked in: {item.checkInTime.split('T')[0]}</Text>
                  <Text style={styles.itemText}>Checked in by: {item.checkedInBy?.email || 'Customer'}</Text>
                  <TouchableOpacity onPress={() => handleDelete(item.ticketCode)}>
                    <Text style={styles.deleteText}><Ionicons name="close-circle" size={16} /> Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111' },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E6895C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 22,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 14,
  },
  historyList: { flex: 1 },
  noRecords: { textAlign: 'center', color: '#999', marginTop: 40 },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  itemInfo: { marginLeft: 8 },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  itemText: { fontSize: 12, color: '#555' },
  deleteText: {
    marginTop: 8,
    color: 'red',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default HistoryScreen;
