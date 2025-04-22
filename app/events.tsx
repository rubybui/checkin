import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { config } from './config';
import { theme } from './theme';

export default function ChooseEventScreen() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const router = useRouter();
    const { token } = useAuth();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        if (!token) {
            Alert.alert('Error', 'Please login first');
            router.push('/');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/checkin-app/events`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${token}`,
                },
            });
            const json = await response.json();
            setEvents(json.events.docs);
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const onSelectEvent = (event) => {
        setSelectedEvent(event);
        setSelectedSchedule(null);
    };

    const onSelectSchedule = (schedule) => {
        setSelectedSchedule(schedule);
    };

    const onConfirm = () => {
        if (!selectedEvent || !selectedSchedule) {
            Alert.alert('Please select an event and schedule');
            return;
        }
        router.push({
            pathname: '/validate',
            params: {
                eventId: selectedEvent.id,
                scheduleId: selectedSchedule.id,
                eventLocation: selectedEvent.eventLocation,
                eventTitle: selectedEvent.title,
                eventScheduleDate: selectedSchedule.date
            },
        });
    };

    const formatDate = (iso) => new Date(iso).toLocaleString();
    const formatDateRange = (start, end) =>
        `${new Date(start).toLocaleString()} - ${new Date(end).toLocaleString()}`;

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.multipleEventsContainer}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {events.map((event) => (
                    <View key={event.id} style={styles.eventCard}>

                        <Text style={styles.eventTitle}>{event.title}</Text>
                        <Text style={styles.eventDate}>
                            {formatDateRange(event.startDatetime, event.endDatetime)}
                        </Text>
                        <TouchableOpacity
                            onPress={() => onSelectEvent(event)}
                            style={[
                                styles.button,
                                selectedEvent?.id === event.id && styles.buttonDisabled,
                            ]}
                        >
                            <Text style={styles.buttonText}>
                                {selectedEvent?.id === event.id ? 'Selected' : 'Select Event'}
                            </Text>
                        </TouchableOpacity>
                        {selectedEvent?.id === event.id && (
                            <View style={styles.schedulesContainer}>
                                {event.schedules && event.schedules.length > 0 ? (
                                    event.schedules.map((schedule) => (
                                        <TouchableOpacity
                                            key={schedule.id}
                                            onPress={() => onSelectSchedule(schedule)}
                                            style={[
                                                styles.scheduleButton,
                                                selectedSchedule?.id === schedule.id && styles.scheduleSelected,
                                            ]}
                                        >
                                            <Text style={styles.scheduleText}>
                                                {formatDate(schedule.date)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))) : (
                                    <Text style={styles.noSchedulesText}>No schedules available for this event</Text>
                                )}
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
            {selectedSchedule && (
                <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                    <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.background,
        paddingBottom: theme.spacing.xl,
    },
    multipleEventsContainer: {
        flex: 1
    },
    scrollContent: {
        paddingTop: 0, // if you want it *exactly* under the header
        paddingBottom: theme.spacing.xl, // space for Confirm button
        flexGrow: 1,
        justifyContent: 'flex-start', // <-- ensures top alignment
    },

    eventCard: {
        backgroundColor: '#fff',
        borderRadius: theme.radius.md,
        paddingTop: 0,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginTop: 0,
    },
    thumbnail: {
        width: '100%',
        height: 200,
        borderRadius: theme.radius.md,
        marginBottom: theme.spacing.sm,
    },
    eventTitle: {
        fontSize: theme.font.size.lg,
        fontWeight: theme.font.weight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    eventDate: {
        fontSize: theme.font.size.sm,
        color: theme.colors.subtext,
        marginBottom: theme.spacing.sm,
    },
    schedulesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.sm,
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: theme.font.size.base,
        fontWeight: theme.font.weight.medium,
    },
    scheduleButton: {
        padding: theme.spacing.sm,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.primary,
    },
    scheduleSelected: {
        backgroundColor: theme.colors.success,
    },
    scheduleText: {
        color: '#fff',
        fontSize: theme.font.size.sm,
    },
    confirmButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        marginTop: theme.spacing.md,
    },
});
