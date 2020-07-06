import React, { useState, useEffect } from "react";
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
import { NavigationContainerProps } from "react-navigation";
import { PlacesNavigationEnum } from "../interface/Navigation";
import { ILocation } from "../interface/Location";

interface ILocationPicker extends NavigationContainerProps {
    onLocationPicked: (location: ILocation) => void;
}

export const LocationPicker: React.FC<ILocationPicker> = ({ onLocationPicked, ...props }) => {
    const [pickedLocation, setPickedLocation] = useState<ILocation>({
        latitude: undefined,
        longitude: undefined
    });
    const [isFetching, setIsFetching] = useState(false);
    const mapPickedLocation = props.navigation?.getParam("pickedLocation");

    useEffect(() => {
        if (mapPickedLocation) {
            setPickedLocation(mapPickedLocation);
            onLocationPicked(mapPickedLocation)
        }
    }, [mapPickedLocation, onLocationPicked])

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
            // console.log("location:- ", location)
            setPickedLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
            onLocationPicked({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            })
        } catch (err) {
            Alert.alert(
                "Could not fetch location!",
                "Please try again later or pick a location on the map.",
                [{ text: "Okay" }]
            )
        }
        setIsFetching(false);
    };

    const handlePickOnMap = () => {
        props.navigation?.navigate(PlacesNavigationEnum.Map);
    }

    return (
        <View style={styles.locationPicker}>
            <MapPreview
                style={styles.mapPreview}
                latitude={pickedLocation.latitude}
                longitude={pickedLocation.longitude}
                onPress={handlePickOnMap}>
                {
                    isFetching ?
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        :
                        <Text>No location chosen yet</Text>
                }
            </MapPreview>
            <View style={styles.actions}>
                <Button
                    title="Get User Location"
                    color={COLORS.primary}
                    onPress={getLocationHandler} />
                <Button
                    title="Pick on Map"
                    color={COLORS.primary}
                    onPress={handlePickOnMap} />
            </View>
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
        borderWidth: 1
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%"
    }
})

