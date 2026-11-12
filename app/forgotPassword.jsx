import { Stack, useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { auth } from '../firebaseConfig';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim())
      return Alert.alert('Error', 'Please enter your email address.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return Alert.alert('Error', 'Please enter a valid email address.');

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        'Email Sent',
        'A password reset link has been sent to your email address.',
        [{ text: 'OK', onPress: () => router.replace('/login') }],
      );
    } catch (err) {
      const message =
        err.code === 'auth/user-not-found'
          ? 'No account found with this email address.'
          : err.code === 'auth/network-request-failed'
            ? 'Network error. Please check your connection.'
            : 'Something went wrong. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerBackTitleVisible: false,
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <View style={[styles.imageContainer, { height: 220 }]}>
                <Image
                  source={require('../assets/images/Blob.png')}
                  style={styles.imageBg}
                  resizeMode="stretch"
                />
                <View style={styles.welcome}>
                  <Image
                    source={require('../assets/images/Qnext-logo.png')}
                    style={[
                      styles.logo,
                      { width: 100, height: 100, marginTop: 0 },
                    ]}
                    resizeMode="contain"
                  />
                  <Text style={styles.heading}>Reset your password</Text>
                </View>
              </View>

              <View style={{ paddingTop: 80, paddingBottom: 150 }}>
                <View style={{ paddingHorizontal: '8.5%' }}>
                  <Text
                    style={{
                      color: '#A1A4B2',
                      fontSize: 13,
                      marginBottom: 20,
                      fontFamily: 'Roboto_300Light',
                      lineHeight: 20,
                    }}
                  >
                    Please provide the email address associated with your
                    account, and we`ll send you a link to reset your password.
                  </Text>
                </View>

                <View style={styles.field}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#A1A4B2"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    editable={!loading}
                  />
                </View>

                <Pressable
                  style={[
                    styles.loginButton,
                    { marginTop: 10 },
                    loading && { opacity: 0.7 },
                  ]}
                  onPress={handleReset}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.loginText}>SEND RESET LINK</Text>
                  )}
                </Pressable>

                <View style={styles.bottom}>
                  <Text style={styles.bot}>Remembered your password? </Text>
                  <Text
                    style={[styles.bot, styles.italic]}
                    onPress={() => router.back()}
                  >
                    LOG IN
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  headingWrapper: {
    marginBottom: 40,
  },

  heading: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
  },

  mid: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 30,
    marginBottom: 10,
    textAlign: 'center',
  },

  label: {
    fontFamily: 'Roboto_300Light',
    fontSize: 16,
    textAlign: 'center',
  },

  bot: {
    fontFamily: 'Roboto_300Light',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },

  read: {
    fontFamily: 'Roboto_300Light',
    fontSize: 14,
    textAlign: 'left',
    marginTop: 5,
  },

  policy: {
    fontFamily: 'Roboto_300Light',
    fontSize: 14,
    marginTop: 5,
  },

  fp: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    letterSpacing: 1,
    marginTop: 5,
    marginBottom: 80,
    textAlign: 'center',
  },

  italic: {
    fontFamily: 'Roboto_500Medium',
    color: '#096B72',
  },

  field: {
    marginBottom: 10,
  },

  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },

  icon: {
    position: 'absolute',
    right: 50,
    top: '50%',
    transform: [{ translateY: -11 }],
  },

  input: {
    borderWidth: 1,
    borderColor: '#F2F3F7',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 11,
    fontFamily: 'Roboto_300Light',
    marginTop: 5,
    width: screenWidth * 0.83,
    backgroundColor: '#F2F3F7',
    color: '#3F414E',
    letterSpacing: 1,
    alignSelf: 'center',
  },

  imageContainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.6,
    width: '100%',
  },

  headingOnImage: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    letterSpacing: 4,
    marginTop: 40,
    textAlign: 'center',
  },

  textSection: {
    padding: 30,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  imageBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.45,
    width: '100%',
  },

  welcome: {
    position: 'absolute',
    top: screenHeight * 0.2,
    left: screenWidth * 0.085,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth * 0.83,
  },

  create: {
    position: 'absolute',
    top: screenHeight * 0.13,
    left: screenWidth * 0.21,
    transform: [{ translateX: -50 }, { translateY: -10 }],
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth * 0.82,
  },

  loginButton: {
    backgroundColor: '#096B72',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
    width: screenWidth * 0.83,
    alignItems: 'center',
  },

  proceedButton: {
    backgroundColor: '#096B72',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 50,
    width: screenWidth * 0.83,
    alignItems: 'center',
    alignSelf: 'center',
  },

  registerButton: {
    backgroundColor: '#096B72',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
    alignItems: 'center',
    width: screenWidth * 0.83,
  },

  loginText: {
    color: 'white',
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
  },

  buttonText: {
    color: 'black',
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
  },

  bottom: {
    flexDirection: 'row',
    marginBottom: 60,
    justifyContent: 'center',
  },

  pp: {
    flexDirection: 'row',
    marginBottom: 45,
    alignSelf: 'center',
    letterSpacing: 0.5,
    alignItems: 'center',
  },

  checkbox: {
    marginLeft: 75,
    width: 15,
    height: 15,
  },

  fbButton: {
    backgroundColor: '#096B72',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
  },

  gButton: {
    backgroundColor: '#ffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBEAEC',
  },

  error: {
    color: '#e63946',
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'RobotoMono_500Medium',
    textAlign: 'center',
  },

  logo: {
    width: 79,
    height: 25,
    marginTop: 40,
    alignSelf: 'center',
  },
});