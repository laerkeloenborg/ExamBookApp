import { View, Text, Image, Pressable, Modal } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/ProfileStyling.js";
import buttons from "../styles/Buttons.js";
import colors from "../styles/Colors.js";
import { takePhoto, pickImageFromGallery } from "./Camera.js";

export default function ProfileHeader({
  name,
  mail,
  image,
  setImage,
  saveProfileImage,
  handleDeleteUser,
}) {

  const [modalVisible, setModalVisible] = useState(false)
  
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{name}'s bookshelf</Text>
        <Pressable onPress={() => setModalVisible(true)}>
          <Image
            source={{
              uri:
                image ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.profileImage}
          />
        </Pressable>
      </View>

      <Modal visible={modalVisible}>
        <LinearGradient
          colors={colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Profile settings</Text>
              <Image
                source={{
                  uri:
                    image ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                }}
                style={styles.largeProfileImage}
              />

              <Pressable
                style={buttons.buttonForm}
                onPress={async () => {
                  const imageUri = await pickImageFromGallery(setImage);

                  if (imageUri) {
                    saveProfileImage(imageUri);
                  }
                }}
              >
                <Text style={buttons.buttonText}>Choose from gallery</Text>
              </Pressable>

              <Pressable
                style={buttons.buttonForm}
                onPress={async () => {
                  const imageUri = await takePhoto();

                  if (imageUri) {
                    saveProfileImage(imageUri);
                  }
                }}
              >
                <Text style={buttons.buttonText}>Take photo</Text>
              </Pressable>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>{name}</Text>
                <Text style={styles.userMail}>{mail}</Text>
              </View>

              <Pressable
                style={buttons.deleteButton}
                onPress={handleDeleteUser}
              >
                <Text style={buttons.buttonText}>Delete user</Text>
              </Pressable>

              <Pressable
                style={buttons.buttonForm}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={buttons.buttonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </Modal>
    </>
  );
}
