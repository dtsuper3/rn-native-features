import React, { useState, useCallback, useEffect } from 'react'
import { StyleSheet, Text, Platform, Alert } from 'react-native'
import MapView, { MapEvent, Marker } from 'react-native-maps';
import { NavigationContainerProps } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS } from '../constants/Color';
import { PlacesNavigationEnum } from '../interface/Navigation';

interface IMapScreen extends NavigationContainerProps { }

export const MapScreen: React.FC<IMapScreen> = (props) => {
    const initialLocation = props.navigation?.getParam("initialLocation");
    const readonly = props.navigation?.getParam("readonly");
    const [selectedLocation, setSelectedLocation] = useState<any>();
    const mapRegion = {
        latitude: initialLocation ? initialLocation.latitude : 28.6566698,
        longitude: initialLocation ? initialLocation.longitude : 77.1965012,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.041
    }

    const handleSelectLocation = (event: MapEvent) => {
        // console.log("Map Event ", event)
        if (readonly) {
            return;
        }
        setSelectedLocation({
            latitude: event.nativeEvent.coordinate.latitude,
            longitude: event.nativeEvent.coordinate.longitude
        })
    }

    const savedPickedLocationHandler = useCallback(() => {
        if (!selectedLocation) {
            Alert.alert("Select Location", "Please select the location", [{ text: "Okay" }])
            return;
        }
        props.navigation?.navigate(PlacesNavigationEnum.NewPlace, {
            pickedLocation: selectedLocation
        });
    }, [selectedLocation]);

    useEffect(() => {
        props.navigation?.setParams({ saveLocation: savedPickedLocationHandler });
    }, [savedPickedLocationHandler]);

    let markerCoordinates;
    if (selectedLocation) {
        markerCoordinates = {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude
        }
    }

    return (
        <MapView
            style={styles.map}
            region={mapRegion}
            onPress={handleSelectLocation}
        >
            {markerCoordinates && <Marker title="Picked Location" coordinate={markerCoordinates}></Marker>}
        </MapView>
    )
}

(MapScreen as any).navigationOptions = (navData: NavigationContainerProps) => {
    const saveFn = navData.navigation?.getParam("saveLocation");
    const readonly = navData.navigation?.getParam("readonly");
    if (readonly) {
        return {}
    }
    return {
        headerTitle: navData.navigation?.getParam("placeTitle"),
        headerRight: <TouchableOpacity style={styles.headerButton} onPress={saveFn}>
            <Text style={styles.headerButtonText}>Save</Text>
        </TouchableOpacity>
    }
}
const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    headerButton: {
        marginHorizontal: 20
    },
    headerButtonText: {
        fontSize: 16,
        color: Platform.OS === "android" ? "white" : COLORS.primary
    }
})