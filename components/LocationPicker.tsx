import React, { useState } from "react";
import {
    View,
    Button,
    Text,
    ActivityIndicator,
    Alert,
    StyleSheet
} from "react-native";
import { COLORS } from "../constants/Color";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { MapPreview } from "./MapPreview";

interface ILocationPicker {

}

export const LocationPicker: React.FC<ILocationPicker> = (props) => {
    const [pickedLocation, setPickedLocation] = useState<any>({
        latitude: undefined,
        longitude: undefined
    });
    const [isFetching, setIsFetching] = useState(false);
    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if (result.status !== Permissions.PermissionStatus.GRANTED) {
            Alert.alert("Insufficient Permissions",
                "You nedd to grant location permissions to use this app.",
                [{ text: "Okay" }])
            return false
        }
        return true;
    }

    const getLocationHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        try {
            setIsFetching(true);
            const location: Location.LocationData = await Location.getCurrentPositionAsync({
                timeout: 5000,
            });
            console.log("location:- ", location)
            setPickedLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
        } catch (err) {
            Alert.alert(
                "Could not fetch location!",
                "Please try again later or pick a location on the map.",
                [{ text: "Okay" }]
            )
        }
        setIsFetching(false);
    };

    return (
        <View style={styles.locationPicker}>
            <MapPreview
                latitude={pickedLocation.latitude}
                longitude={pickedLocation.longitude}>
                {
                    isFetching ?
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        :
                        <Text>No location chosen yet</Text>
                }
            </MapPreview>
            <Button title="Get User Location" color={COLORS.primary} onPress={getLocationHandler} />
        </View>
    )
};

const styles = StyleSheet.create({
    locationPicker: {
        marginBottom: 15
    },
    mapPreview: {
        marginBottom: 10,
        width: "100%",
        height: 150,
        borderColor: "#ccc",
        borderWidth: 1,
        justifyContent: "center"
    }
})

