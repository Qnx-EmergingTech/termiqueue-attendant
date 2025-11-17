import { Link, Stack, useRouter } from 'expo-router';
import { Dimensions, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Login() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,           
          headerTitle: '',              
          headerTransparent: true,      
          headerBackTitleVisible: false 
        }}
      />
    
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/images/Blob.png')}
          style={styles.image}
        />
        <Text style={styles.heading}>Welcome Back!</Text>

      <View style={styles.mid}>
        <TextInput 
          placeholder="Email address"
          //value={email}
          style={styles.input}
        />
        <TextInput 
          placeholder="Password"
          //value={password}
          secureTextEntry
          style={styles.input}
        />
        <Pressable style={styles.loginButton} onPress={() => router.push("/home")}>
          <Text style={styles.login}>LOG IN</Text>
        </Pressable>
        <Text style={styles.fp}>Forgot Password?</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.bot}>ALREADY HAVE AN ACCOUNT? </Text>
        <Link href="/signup" style={styles.signUp}>SIGN UP</Link>
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
       left: '11%',                 
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
    fp: {
        fontFamily: "Roboto_500Medium",
        fontSize: 14,
        letterSpacing: 1, 
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
    signUp: {
        color: "#096B72",
        fontFamily: "Roboto_500Medium",
        fontSize: 14,
    },
});