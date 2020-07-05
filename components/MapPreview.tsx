import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { KEYS } from "../constants/Keys";

interface IMapPreview {
    longitude: string;
    latitude: string;
}

export const MapPreview: React.FC<IMapPreview> = (props) => {
    let imagePreviewUrl = "";
    if (props.latitude && props.longitude) {
        imagePreviewUrl = `https://api.tomtom.com/map/1/staticimage?key=${KEYS.MAPS_API_KEYS}&zoom=15&center=${props.longitude},${props.latitude}&format=png&width=400&height=200`;
    }
    console.log(imagePreviewUrl)
    return (
        <View style={styles.mapPreview}>
            {
                (props.latitude && props.longitude) ?
                    <Image source={{ uri: imagePreviewUrl }} /> : props.children
            }
        </View>
    )
}

const styles = StyleSheet.create({
    mapPreview: {
        marginBottom: 10,
        width: "100%",
        height: 150,
        borderColor: "#ccc",
        borderWidth: 1,
        justifyContent: "center"
    }
})