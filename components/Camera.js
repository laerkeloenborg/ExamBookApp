import * as ImagePicker from "expo-image-picker";
import { storage } from "../firebase";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";

export async function takePhoto(setImage) {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
        alert("Camera permission is required!");
        return;
    }

    const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [3, 4],
        quality: 1,
    });

    if (!result.canceled) {
        return result.assets[0].uri
    }
    return null
}

export async function pickImageFromGallery(setImage) {
    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        aspect: [3, 4],
        quality: 1,
    });

    if (!result.canceled) {
        return result.assets[0].uri
    }
    return null
}

export async function uploadImage(uri, path){
    const res = await fetch(uri)
    const blob = await res.blob()
    const storageRef = ref(storage, path)
    const snap = await uploadBytes(storageRef,blob)
    const downloadURL = await getDownloadURL(snap.ref)
    return downloadURL 
}