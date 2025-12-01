import Checkbox from 'expo-checkbox';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { signUp } from '../api/auth';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

const handleProceed = async () => {
  setError("");
  if (!accepted) {
    setError("Please accept the privacy policy.");
    return;
  }
  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  const result = await signUp(email, password);
  if (result.success) {
      router.replace({
        pathname: "/kyc",
        params: { token: result.token }
      });
  } else {
    setError(result.message);
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

      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/Blob.png')}
            style={styles.image}
          />
          <Text style={styles.heading}>Create your account</Text>

          <View style={styles.mid}>
            <TextInput
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
            />
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              secureTextEntry
              onChangeText={setConfirmPassword}
              style={styles.input}
            />

            {error ? <Text style={{ color: 'red', marginTop: 5 }}>{error}</Text> : null}

            <View style={styles.privacy}>
              <Text style={styles.read}>I have read the </Text>
              <Text style={styles.policy}>Privacy Policy</Text>
              <Checkbox
                value={accepted}
                onValueChange={setAccepted}
                tintColors={{ true: '#096B72', false: '#ccc' }}
                style={styles.box}
              />
            </View>

            <Pressable style={styles.loginButton} onPress={handleProceed}>
              <Text style={styles.login}>PROCEED</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
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
        height: screenHeight * 0.45,
        width:  '100%'
    },
    heading: {
       position: 'absolute',
       top: screenHeight * 0.25,    
       left: '9%',                 
       justifyContent: "center",
       alignItems: "center",
       width: screenWidth * 0.85,
        fontFamily: "Roboto_700Bold",
        fontSize: 28,
        textAlign: "center",
        marginTop: 30,
    },
    mid: {
        flex: 1, 
        marginTop: 60,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: "#F2F3F7",
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 15,
      fontSize: 11,
      fontFamily: "Roboto_300Light",
      marginTop: 15,
      width: screenWidth * 0.83,
      backgroundColor: "#F2F3F7",
      color: "#A1A4B2",
      letterSpacing: 1,
      alignSelf: "center",
    },
    privacy: {
        flexDirection: "row",
        alignSelf: "flex-start",
        marginLeft: 15,
        marginTop: 20,
        alignItems: "center",
    },
    policy: {
        fontFamily: "Roboto_500Medium",
        fontSize: 14,
        color: "#7583CA",
    },
    box: {
        marginLeft: 120,
    },
    read: {
        fontFamily: "Roboto_500Medium",
        fontSize: 14,
        color: "#A1A4B2",
    },
    loginButton: {
        borderRadius: 38,
        backgroundColor: "#096B72",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignSelf: "center",
        width: screenWidth * 0.83,
        alignItems: "center",
        marginBottom: 10,
        marginTop: 20,
    },
    login: {
        color: "white",
        fontFamily: "Roboto_500Medium",
        fontSize: 14,
    },
});