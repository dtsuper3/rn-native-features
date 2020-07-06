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
        imagePreviewUrl = `https://apis.mapmyindia.com/advancedmaps/v1/${KEYS.MAPS_API_KEYS}/still_image?center=${props.latitude},${props.longitude}&zoom=12&size=400x200&ssf=1&markers=${props.latitude},${props.longitude}&size=400x200`;
    }
    console.log(imagePreviewUrl)
    return (
        <View style={styles.mapPreview}>
            {
                (props.latitude && props.longitude) ?
                    <Image source={{ uri: imagePreviewUrl }} onLoad={(mes) => console.log("Image:- ", mes)} /> :
                    props.children
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