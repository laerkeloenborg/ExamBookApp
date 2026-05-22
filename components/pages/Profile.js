import { View, Text, Image, Pressable, Modal, Alert } from "react-native"
import { useState, useEffect } from "react"
import { signOut, getAuth, deleteUser, updateProfile } from "firebase/auth"
import { takePhoto, pickImageFromGallery } from "../Camera.js"
import styles from "../../styles/ProfileStyling.js"
import colors from "../../styles/Colors.js"
import { LinearGradient } from "expo-linear-gradient"

export default function Profile({ onLogout }) {
    const [name, setName] = useState("")
    const [mail, setMail] = useState("")
    const [image, setImage] = useState("")
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        const user = getAuth().currentUser

        if(user){
            setName(user.displayName)
            setMail(user.email)
            setImage(user.photoURL)
        }
    },[])

     async function logout() {
        await signOut(getAuth())
        onLogout()
    }

    async function handleDeleteUser(){
        Alert.alert("Delete account", "Are you sure you want to delete your account?",
            [{
                text: "Cancel",
                style: "cancel"
            }, {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try{
                        const user = getAuth().currentUser

                        if(user){
                            await deleteUser(user)
                            onLogout()
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
            }]
        )
    }

    async function saveProfileImage(imageUri){
        try {
            const user = getAuth().currentUser

            if (user){
                await updateProfile(user, {
                    photoURL: imageUri
                })
                setImage(imageUri)
            }
        } catch (error){
            console.log("Image save error: ", error)
        }
    }

    return (
        <LinearGradient
            colors={colors.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{name}'s bookshelf</Text>
                <Pressable onPress={() => setModalVisible(true)}>
                    <Image source={{uri: image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}} style={styles.profileImage}/>
                </Pressable>
            </View>

            <Modal visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Profile settings</Text>
                        <Image source={{uri: image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}}style={styles.largeProfileImage}/>
                   
                        <Pressable style={styles.modalButton} onPress={async () => {
                            const imageUri = await pickImageFromGallery(setImage)
                            
                            if(imageUri){
                                saveProfileImage(imageUri)
                            }
                            }}>
                            <Text style={styles.buttonText}>Choose from gallery</Text>
                        </Pressable>

                        <Pressable style={styles.modalButton} onPress={async () => {
                            const imageUri = await takePhoto()

                            if(imageUri){
                                saveProfileImage(imageUri)
                            }
                        }}>
                            <Text style={styles.buttonText}>Take photo</Text>
                        </Pressable>

                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{name}</Text>
                            <Text style={styles.userMail}>{mail}</Text>
                        </View>

                        <Pressable style={[styles.modalButton, styles.deleteButton]} onPress={handleDeleteUser}>
                            <Text style={styles.buttonText}>Delete user</Text>
                        </Pressable>
                    
                        <Pressable style={styles.modalButton} onPress={() => {setModalVisible(false)}}>
                            <Text style={styles.buttonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Pressable style={styles.logoutButton} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
        </LinearGradient>
    )
}
