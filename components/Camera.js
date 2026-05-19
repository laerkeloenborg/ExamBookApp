import * as ImagePicker from "expo-image-picker";

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
        setImage(result.assets[0].uri);
    }
}

export async function pickImageFromGallery(setImage) {
    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        aspect: [3, 4],
        quality: 1,
    });

    if (!result.canceled) {
        setImage(result.assets[0].uri);
    }
}