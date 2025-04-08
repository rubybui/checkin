import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

const TicketResultScreen = () => {
  const router = useRouter();
  
  const ticketData = {
    ticketNumber: '29050-29049-29048T0',
    name: 'Sam Anderson',
    count: 1,
    orderId: '26049',
    eventName: 'Event',
    eventTime: 'January 21, 2022 8:49 pm - 8:49 pm',
    orderStatus: 'completed'
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* Header with close button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <View style={styles.closeButton}>
            <Ionicons name="close" size={20} color="#E6895C" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Success Icon */}
      <View style={styles.successIcon}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={48} color="#fff" />
        </View>
      </View>

      {/* Ticket Number */}
      <Text style={styles.ticketNumber}>TICKET #{ticketData.ticketNumber}</Text>

      {/* Status */}
      <Text style={styles.status}>SUCCESSFULLY CHECKED!</Text>

      {/* Ticket Information Section */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>OTHER TICKET INFORMATION</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NAME:</Text>
            <Text style={styles.infoValue}>{ticketData.name}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>COUNT:</Text>
            <Text style={styles.infoValue}>{ticketData.count}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ORDER ID:</Text>
            <View style={styles.orderIdContainer}>
              <Text style={styles.orderIdText}>{ticketData.orderId}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>EVENT NAME:</Text>
            <Text style={styles.infoValue}>{ticketData.eventName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>EVENT TIME:</Text>
            <Text style={styles.infoValue}>{ticketData.eventTime}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ORDER STATUS:</Text>
            <Text style={styles.infoValue}>{ticketData.orderStatus}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonOutline]}>
          <Text style={styles.buttonOutlineText}>UN-CHECK THIS TICKET</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.buttonFilled]}>
          <Text style={styles.buttonFilledText}>ENTER A NEW TICKET ID</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7BC67E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  infoContainer: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
  },
  orderIdContainer: {
    backgroundColor: '#E3F3E3',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  orderIdText: {
    color: '#7BC67E',
    fontWeight: '500',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#7BC67E',
  },
  buttonFilled: {
    backgroundColor: '#7BC67E',
  },
  buttonOutlineText: {
    color: '#7BC67E',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonFilledText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TicketResultScreen; 