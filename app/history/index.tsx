import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

const HistoryScreen = () => {
  const router = useRouter();
  
  const historyItems = [
    {
      title: 'Guideline.pdf',
      url: 'https://musicra...',
      icon: 'document-text-outline',
    },
    {
      title: 'Payment info.txt',
      url: 'https://musicra...',
      icon: 'document-text-outline',
    },
    {
      title: "Cox's Bazar Photo",
      url: 'https://google...',
      icon: 'image-outline',
    },
    {
      title: 'Logo brief.pdf',
      url: 'https://musicra...',
      icon: 'document-text-outline',
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Scanning History</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <View style={styles.closeButton}>
            <Ionicons name="close" size={20} color="#E6895C" />
          </View>
        </TouchableOpacity>
      </View>


      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButtonActive}>
          <Text style={styles.filterTextActive}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
      </View>

      {/* History List */}
      <ScrollView style={styles.historyList}>
        {historyItems.map((item, index) => (
          <View key={index} style={styles.historyItem}>
            <View style={styles.itemLeft}>
              <Ionicons name={item.icon} size={24} color="#E6895C" />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemUrl}>{item.url}</Text>
              </View>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="copy-outline" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="download-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E6895C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
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
  filterText: {
    color: '#666',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#fff',
    fontSize: 14,
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemInfo: {
    marginLeft: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
    marginBottom: 4,
  },
  itemUrl: {
    fontSize: 12,
    color: '#999',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
});

export default HistoryScreen; 