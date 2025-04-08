import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { AuthProvider } from "./context/AuthContext";

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
        }}
      />
    </AuthProvider>
  );
}
