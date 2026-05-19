import { View, Text, Button, StyleSheet, Image, Pressable, Modal } from "react-native"
import { useState, useEffect } from "react"
import { signOut, getAuth } from "firebase/auth"
import { takePhoto, pickImageFromGallery } from "../Camera.js"

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
        }
    },[])

     async function logout() {
        await signOut(getAuth())
        onLogout()
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{name}'s bookshelf</Text>
                <Pressable onPress={() => setModalVisible(true)}>
                    <Image source={{uri: image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}} style={styles.profileImage}/>
                </Pressable>
            </View>

            <Modal visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Profile settings</Text>
                    <Image source={{uri: image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}}style={styles.largeProfileImage}/>

                    <Text>{name}</Text>
                    <Text>{mail}</Text>

                    <Button title="Choose from gallery" onPress={()=>pickImageFromGallery(setImage)}/>
                    <Button title="Take photo" onPress={()=>takePhoto(setImage)}/>
        
                    <Button title="Close" onPress={() => setModalVisible(false)}/>

                </View>
            </Modal>

            <Button
                title="Logout"
                onPress={logout}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30
    },

    title: {
        fontSize: 28,
        fontWeight: "bold"
    },

    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35
    }, 
    modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
},

modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
},

largeProfileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20
}
})