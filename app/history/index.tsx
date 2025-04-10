import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { config } from '../config';
import { useAuth } from '../context/AuthContext';

const HistoryScreen = () => {
  const [checkins, setCheckins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      console.log(data.records);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

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

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButtonActive}>
          <Text style={styles.filterTextActive}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.historyList}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#E6895C" />
        ) : checkins.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>No records found</Text>
        ) : (
          checkins.map((item, index) => (
            <View key={item.id || index} style={styles.historyItem}>
              <View style={styles.itemLeft}>
                <Ionicons name="checkbox-outline" size={24} color="#E6895C" />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.ticketCode} — {item.attendeeName}</Text>
                  <Text style={styles.itemUrl}>{item.eventTitle}</Text>
                  <Text style={styles.itemUrl}>Seat: {item.ticket.seat || 'N/A'}</Text>
                  <Text style={styles.itemUrl}>Checked in: {item.checkInTime.split('T')[0]}</Text>
                  <Text style={styles.itemUrl}>Checked in by: {item.checkedInBy.email}</Text>
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
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  filterButtonActive: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#E6895C',
  },
  filterText: { color: '#666', fontSize: 14 },
  filterTextActive: { color: '#fff', fontSize: 14 },
  historyList: { flex: 1, paddingHorizontal: 24 },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  itemInfo: { marginLeft: 8 },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  itemUrl: { fontSize: 12, color: '#777' },
});

export default HistoryScreen;
