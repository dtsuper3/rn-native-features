import React from "react";
import {
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { KEYS } from "../constants/Keys";

interface IMapPreview {
    longitude: number | undefined;
    latitude: number | undefined;
    style: any;
    onPress: () => void
}

export const MapPreview: React.FC<IMapPreview> = (props) => {
    let imagePreviewUrl = "";
    if (props.latitude && props.longitude) {
        imagePreviewUrl = `https://apis.mapmyindia.com/advancedmaps/v1/${KEYS.MAPS_API_KEYS}/still_image?center=${props.latitude},${props.longitude}&zoom=18&size=400x200&ssf=0&markers=${props.latitude},${props.longitude}`;
    }
    console.log("Image:- ", imagePreviewUrl)
    return (
        <TouchableOpacity
            style={{ ...styles.mapPreview, ...props.style }}
            onPress={props.onPress}>
            {
                (props.latitude && props.longitude && imagePreviewUrl.length > 0) ?
                    <Image
                        source={{ uri: imagePreviewUrl }}
                        style={styles.mapImg} /> :
                    props.children
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mapPreview: {
        justifyContent: "center",
        alignItems: "center"
    },
    mapImg: {
        width: "100%",
        height: "100%"
    }
})