import { useEffect, useState } from "react"
import { Text, View, Button, TextInput, Platform, Modal, Pressable } from 'react-native';
import { app } from '../../firebase';
import {getAuth, signInWithEmailAndPassword, signOut, signInWithCredential, createUserWithEmailAndPassword, onAuthStateChanged
    ,initializeAuth, getReactNativePersistence, GoogleAuthProvider, updateProfile
} from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import * as LocalAuthentication from 'expo-local-authentication'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'
import styles from "../../styles/LoginStyling.js"
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../styles/Colors.js"

let auth
if(Platform.OS === "web"){
    auth = getAuth(app)
} else {
    try{
        auth = initializeAuth(app, {
            persistence:getReactNativePersistence(ReactNativeAsyncStorage)
        })
    } catch (error){
        auth = getAuth(app)
    }
}

WebBrowser.maybeCompleteAuthSession()

export default function Login({onLogin}){
    const [enteredEmail, setEnteredEmail] = useState("")
    const [enteredPassword, setEnteredPassword] = useState("")
    const [userId, setUserId] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [enteredName, setEnteredName] = useState("")
    
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: "664617534907-0984pscc8kbi7a1gdmhrntt9f4j3iu2j.apps.googleusercontent.com",
        androidClientId: "910602000048-ejrer6kp6jgaafd10nktu6gq9tmi3lsj.apps.googleusercontent.com",
        scopes: ["profile","email"],
        redirectUri: AuthSession.makeRedirectUri({
            native: "com.googleusercontent.apps.910602000048-ejrer6kp6jgaafd10nktu6gq9tmi3lsj:/oauth2redirect/google"
        })
    })

    console.log("redirect uri: ", request?.redirectUri)

    useEffect(() => {
        if(response?.type === "success"){
            const {id_token, access_token} = response.params
            const credential = GoogleAuthProvider.credential(id_token, access_token)
            signInWithCredential(auth, credential)
            .then((userCredential) => {
                setUserId(userCredential.user.uid)
                onLogin()})
            .catch((error) => console.log("Google login error: ", error))
        }
    }, [response])


    useEffect(() => {
        const auth_ = getAuth(app)
        const unsubscribe = onAuthStateChanged(auth_, (user) => {
            if(user){
                setUserId(user.uid)
                onLogin()
            }else {
                setUserId(null)
            }
        })
        return () => unsubscribe()
    }, [])

    async function login(){
        try{
            const credentials = await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword)
            console.log("logged in as: ", credentials.user.uid)
            setUserId(credentials.user.uid)
            onLogin()
        } catch(error) {
            console.log("login error: ", JSON.stringify(error))
        }
    }

    async function signUp(){
        try {
            const credentials = await createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword)
            await updateProfile(credentials.user, {
                displayName: enteredName
            })
            console.log("signed up as: ", credentials.user.uid)
            setUserId(credentials.user.uid)
            onLogin()
        } catch(error){
            console.log("Create user error: ", JSON.stringify(error))
        }
    }


    async function handleBioLogin(){
        const hasHardware = await LocalAuthentication.hasHardwareAsync()
        if(!hasHardware){
            alert("biometrics not supported")
        }else {
            alert("biometrics ok")
        }

        const isEnrolled = await LocalAuthentication.isEnrolledAsync()
        if(!isEnrolled){
            alert("biometrics not enrolled")
        }else{
            alert("biometrics enrolled")
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Authenticate to continue"
        })
        if(result.success){
            alert("logged in: LOCAL ")
        }else{
            alert("Not logged in with biometrics")
        }
    }
   
    return(
        <LinearGradient
            colors={colors.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {!userId && 
            <>
                <Text style={styles.title}>BookShare</Text>
                <Pressable style={[styles.button, styles.googleButton]} onPress={() => promptAsync({useProxy: true})}>
                    <Text style={styles.buttonText}>Google login</Text>
                </Pressable>
    
                <Pressable style={[styles.button, styles.bioAndModalButton]} onPress={handleBioLogin}>
                    <Text style={styles.buttonText}>Log in with bio</Text>
                </Pressable>
                
                <Text style={styles.title}>Login</Text>

                <TextInput placeholder="Email" onChangeText={newText => setEnteredEmail(newText)} value={enteredEmail} style={styles.input}/>
                <TextInput placeholder="Password" onChangeText={newText => setEnteredPassword(newText)} value={enteredPassword} style={styles.input} secureTextEntry/>
                
                <Pressable style={[styles.button, styles.loginButton]} onPress={login}>
                    <Text style={styles.buttonText}>Log in</Text>
                </Pressable>
                
                <Text style={styles.signUpText} onPress={()=> setModalVisible(true)}>Sign up</Text>

                <Modal visible={modalVisible} transparent animationType="fade">
                     <LinearGradient
                        colors={colors.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.modalContainer}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create user</Text>

                            <TextInput placeholder="Name" value={enteredName} onChangeText={setEnteredName} style={styles.input}/>
                            <TextInput placeholder="Email" value={enteredEmail} onChangeText={setEnteredEmail} style={styles.input}/>
                            <TextInput placeholder="Password" value={enteredPassword} onChangeText={setEnteredPassword} secureTextEntry style={styles.input}/>
                            
                            <Pressable style={[styles.button, styles.bioAndModalButton]} onPress={()=> {signUp(), setModalVisible(false)}}>
                                <Text style={styles.buttonText}>Create user</Text>
                            </Pressable>
                            
                            <Pressable style={[styles.button, styles.bioAndModalButton]} onPress={()=>{setModalVisible(false)}}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>

                        </View>
                    </LinearGradient>
                </Modal>

            </>
            }
            
        </LinearGradient>
    )

}
