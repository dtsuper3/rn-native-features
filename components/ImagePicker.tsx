import React, { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet, Image, Alert } from 'react-native';
import { COLORS } from "../constants/Color";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

interface IImgPicker {
    onImageTake: any;
    image: string | undefined;
}
export const ImgPicker: React.FC<IImgPicker> = (props) => {
    const [pickedImage, setPickedImage] = useState<string>();

    useEffect(() => {
        if (props.image) {
            setPickedImage(props.image)
        }
    }, [props.image]);

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        if (result.status !== Permissions.PermissionStatus.GRANTED) {
            Alert.alert("Insufficient Permissions",
                "You nedd to grant camera permissions to use this app.",
                [{ text: "Okay" }])
            return false
        }
        return true;
    }

    const takeImageHandler = async () => {
        const hasPermission = await verifyPermissions;
        if (!hasPermission) {
            return;
        }
        const image = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5
        });
        // console.log("Image:-", image)
        if (!image.cancelled) {
            setPickedImage(image.uri)
            props.onImageTake(image.uri);
        }
    }

    return (
        <View style={styles.imagePicker}>
            <View style={styles.imagePreview}>
                {
                    !pickedImage ?
                        <Text>No image picked yet.</Text>
                        :
                        <Image style={styles.image} source={{ uri: pickedImage }} />
                }
            </View>
            <Button
                title="Take Image"
                color={COLORS.primary}
                onPress={takeImageHandler} />
        </View>
    )
}

const styles = StyleSheet.create({
    imagePicker: {
        alignItems: "center",
        marginBottom: 15
    },
    imagePreview: {
        width: "100%",
        height: 200,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1
    },
    image: {
        width: "100%",
        height: "100%"
    }
})