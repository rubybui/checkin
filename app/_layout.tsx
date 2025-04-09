import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="validate" options={{ title: 'Validate' }} />
        <Stack.Screen name="ticket-details" options={{ title: 'Ticket Details' }} />
      </Stack>
    </AuthProvider>
  );
}
