import {
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
// remove safescreen for top white space, temporary solution?
import SafeScreen from "../components/SafeScreen";
import {
  setupBackgroundNotificationHandler,
  setupForegroundNotificationHandler,
  setupNotificationOpenHandler,
} from "../utils/pushNotifications";

SplashScreen.preventAutoHideAsync();
setupBackgroundNotificationHandler();

export default function AppLayout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const unsubscribeForeground = setupForegroundNotificationHandler();

    setupNotificationOpenHandler((remoteMessage) => {
      const { type, bus_id } = remoteMessage.data || {};

      if (type === "prompt_finish_trip") {
        router.push({ pathname: "/finishModal", params: { busId: bus_id } });
      } else if (type === "end_trip") {
        router.push("/(tabs)/home");
      }
    });

    return () => {
      unsubscribeForeground();
    };
  }, [router]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SafeScreen onLayout={onLayoutRootView}>
        <Stack screenOptions={{
          headerShown: false,
          headerBackTitleVisible: false,
        }}
        onLayout={onLayoutRootView}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="index" />
          <Stack.Screen name="kyc" />
          <Stack.Screen name="route" />
        </Stack>
      </SafeScreen>
    </SafeAreaProvider>
  );
}
