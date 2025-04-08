import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="checkin" options={{ title: 'Check In' }} />
        <Stack.Screen name="ticket-details" options={{ title: 'Ticket Details' }} />
      </Stack>
    </AuthProvider>
  );
}
