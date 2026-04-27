import { useEffect, useState } from "react"
import { StyleSheet, Text, View, Button, TextInput, Platform } from 'react-native';
import { app } from './firebase';
import {getAuth, signInWithEmailAndPassword, signOut, signInWithCredential, createUserWithEmailAndPassword, onAuthStateChanged
    ,initializeAuth, getReactNativePersistence, GoogleAuthProvider
} from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import * as LocalAuthentication from 'expo-local-authentication'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'

let auth
if(Platform.OS === "web"){
    auth = getAuth(app)
} else {
    auth = initializeAuth(app, {
        persistence:getReactNativePersistence(ReactNativeAsyncStorage)
    })
}

WebBrowser.maybeCompleteAuthSession()

export default function Login({onLogin}){
    const [enteredEmail, setEnteredEmail] = useState("laca@ek.dk")
    const [enteredPassword, setEnteredPassword] = useState("test1234")
    const [userId, setUserId] = useState(null)
    const [user, setUser] = useState(null)
    
    const [request, response, promptAsync] = Google.useAuthRequest({
        scopes: ["profile","email"],
        iosClientId: "",
        androidClientId: "910602000048-ejrer6kp6jgaafd10nktu6gq9tmi3lsj.apps.googleusercontent.com",
        redirectUri: AuthSession.makeRedirectUri({
            native: ""
        })
    })

    console.log("redirect uri: ", request?.redirectUri)

    useEffect(() => {
        if(response?.type === "success"){
            const {id_token, access_token} = response.params
            const credential = GoogleAuthProvider.credential(id_token, access_token)
            signInWithCredential(auth, credential)
            .then((userCredential) => setUserId(userCredential.user.uid), onLogin())
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
            console.log("signed up as: ", credentials.user.uid)
            setUserId(credentials.user.uid)
            onLogin()
        } catch(error){
            console.log("Create user error: ", JSON.stringify(error))
        }
    }

    async function handleSignOut(){
        await signOut(auth)
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
    () => promptAsync()
    return(
        <View>
            {!userId && 
            <>
                <Button title='Google login' onPress={()=>promptAsync()}/>
                <Button title='Log in with bio' onPress={handleBioLogin}/>
                <Text>Login</Text>
                <TextInput onChangeText={newText => setEnteredEmail(newText)} value={enteredEmail}/>
                <TextInput onChangeText={newText => setEnteredPassword(newText)} value={enteredPassword}/>
                <Button title='Log in' onPress={login} />

                <TextInput onChangeText={newText => setEnteredEmail(newText)} value={enteredEmail}/>
                <TextInput onChangeText={newText => setEnteredPassword(newText)} value={enteredPassword}/>
                <Button title='Sign up' onPress={signUp}/>
            </>
            }
            
        </View>
    )

}