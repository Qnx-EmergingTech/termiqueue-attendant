import messaging from '@react-native-firebase/messaging';
import * as Device from 'expo-device';
import { Alert } from 'react-native';

// Request notification permissions and get FCM token
export async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device.');
      return null;
    }

    console.log('Requesting notification permission...');
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('Notification permission not granted');
      return null;
    }

    console.log('Permission granted, getting FCM token...');
    const token = await messaging().getToken();
    console.log('FCM Token received:', token ? 'Yes' : 'No');

    return token;
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
}

// Send token to backend
export async function sendTokenToServer(token, userId) {
  if (!token) return null;

  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
    const BACKEND_URL = `${apiUrl}/profiles/register-fcm`;

    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userId}`,
      },
      body: JSON.stringify({ fcm_token: token }),
    });

    if (!res.ok) {
      console.error('Failed to send token');
      return null;
    }

    console.log('✅ Token sent successfully');
    return await res.json();
  } catch (err) {
    console.error('sendTokenToServer error:', err);
    return null;
  }
}

// Foreground ONLY: Show alert when app is open
export function setupForegroundNotificationHandler() {
  console.log('🔔 Setting up foreground handler...');

  return messaging().onMessage(async (remoteMessage) => {
    console.log(
      '📬 [FOREGROUND] Notification:',
      remoteMessage.notification?.title,
      'type:',
      remoteMessage.data?.type,
    );

    Alert.alert(
      remoteMessage.notification?.title || 'Notification',
      remoteMessage.notification?.body || '',
      [{ text: 'OK' }],
    );
  });
}

// Background ONLY: Runs when app is background/quit
export function setupBackgroundNotificationHandler() {
  console.log('🔔 Setting up background handler...');

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('📬 [BACKGROUND] Message:', remoteMessage.notification?.title);
    // Return immediately - let Android display notification
    return Promise.resolve();
  });
}

// Handle notification taps
export function setupNotificationOpenHandler(callback) {
  console.log('🔔 Setting up tap handlers...');

  // App in background - user taps notification
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('📬 [TAP-BACKGROUND] Notification tapped');
    if (callback) callback(remoteMessage);
  });

  // App was quit - user taps notification
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('📬 [TAP-QUIT] App opened from notification');
        if (callback) callback(remoteMessage);
      }
    });
}

// Token refresh
export function onTokenRefresh(callback) {
  console.log('🔔 Setting up token refresh listener...');
  return messaging().onTokenRefresh((token) => {
    console.log('🔄 Token refreshed');
    callback(token);
  });
}

export default {
  registerForPushNotificationsAsync,
  sendTokenToServer,
  setupForegroundNotificationHandler,
  setupBackgroundNotificationHandler,
  setupNotificationOpenHandler,
  onTokenRefresh,
};
