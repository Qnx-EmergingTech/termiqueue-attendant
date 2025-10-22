import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native'
import { Stack } from 'expo-router';
import { useFonts, Roboto_400Regular, Roboto_700Bold, Roboto_300Light, Roboto_500Medium } from "@expo-google-fonts/roboto";

export default function Index() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_300Light,
    Roboto_700Bold,
    Roboto_500Medium,
  });

  if (!fontsLoaded) return null;

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
            <Pressable style={styles.signupButton}>SIGN UP</Pressable>
            <View style={styles.bottom}>
                <Text style={styles.bot}>Already have an account? </Text>
                <Pressable style={styles.loginButton}>LOG IN</Pressable>
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
        marginBottom: 40,
    },
    signupButton: {
        borderRadius: 38,
        backgroundColor: "#096B72",
        fontFamily: "Roboto_500Medium",
        fontSize: 14,
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
        color: "white",
        alignSelf: "center",
        width: screenWidth * 0.83,
        alignItems: "center",
        marginBottom: 10,
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