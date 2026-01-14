import { Link, Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
  if (loading) return;

  setLoading(true);
  router.push("/signup");

  setTimeout(() => {
    setLoading(false);
  }, 500);
};


  return (
    <>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image 
                    source={require('../assets/images/Frame.png')}
                    style={styles.image}
                    resizeMode="cover"
                    />
                <Text style={styles.heading}>Termi-Q</Text>
            </View>
            <View style={styles.mid}>
                <Text style={styles.title}>Welcome to Termi-Q Attendant</Text>
                <Text style={styles.subtitle}>Confirm arrivals. Keep the queue moving.</Text>
            </View>
            <Pressable
                style={[styles.signupButton, loading && { opacity: 0.7 }]}
                onPress={handleSignup}
                disabled={loading}
                >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.signUp}>SIGN UP</Text>
                )}
            </Pressable>
            <View style={styles.bottom}>
                <Text style={styles.bot}>Already have an account? </Text>
                <Link href="/login" style={styles.loginButton}>LOG IN</Link>
            </View>
        </View>
    </>
  )
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
        height: screenHeight * 0.6,
        width:  '100%',
        position: "absolute",
    },
    heading: {
        fontFamily: "Roboto_700Bold",
        fontSize: 16,
        textAlign: "center",
        letterSpacing: 4,
        marginTop: 50,
    },
    mid: {
        flex: 1, 
        marginTop: 80,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontFamily: "Roboto_700Bold",
        fontSize: 30,
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontFamily: "Roboto_300Light",
        fontSize: 16,
        color: "#A1A4B2",
        marginBottom: 30,
    },
    signupButton: {
        borderRadius: 38,
        backgroundColor: "#096B72",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignSelf: "center",
        width: screenWidth * 0.83,
        alignItems: "center",
        marginBottom: 10,
    },
    signUp: {
        fontFamily: "Roboto_500Medium",
        fontSize: 14,
        color: "white",
    },
    bottom: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 60,
        alignItems: "center",
        letterSpacing: 1,
    },
    bot: {
        color: "#A1A4B2",
        fontFamily: "Roboto_300Light",
        fontSize: 14,
    },
    loginButton: {
        color: "#096B72",
        fontFamily: "Roboto_500Medium",
        fontSize: 14,
    },
});