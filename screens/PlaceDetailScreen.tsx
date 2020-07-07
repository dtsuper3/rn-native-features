import React, { useCallback, useEffect } from 'react'
import { View, Text, StyleSheet, Image, Platform, Alert, ToastAndroid } from 'react-native'
import { NavigationContainerProps } from 'react-navigation'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { MapPreview } from "../components/MapPreview";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { COLORS } from '../constants/Color';
import { PlacesNavigationEnum } from '../interface/Navigation';
import { MaterialIcons } from '@expo/vector-icons';
import { deletePlaceById } from '../helpers/db';
import { SQLResultSet } from 'expo-sqlite';
import * as PlacesAction from "../store/places-action";


interface IPlaceDetailScreen extends NavigationContainerProps { }

export const PlaceDetailScreen: React.FC<IPlaceDetailScreen> = ({ navigation }) => {
    const placeId = navigation?.getParam("placeId");
    const selectedPlace = useSelector((state: RootState) => state.places.places.find(item => item.id === placeId))
    const dispatch = useDispatch();

    const deleteLocation = useCallback(() => {
        const removePlaces = async () => {
            try {
                const res = await deletePlaceById(placeId) as SQLResultSet;
                if (res.insertId == undefined) {
                    ToastAndroid.show("Removed Successfully", 3000);
                    dispatch(PlacesAction.fetchPlacesDispatcher());
                    navigation?.goBack();
                    // console.log("Delete:- ", res);
                }
            } catch (err) {
                Alert.alert("Error", err.message, [{ text: "Okay" }])
                // console.log(err);
            }
        }

        Alert.alert(
            "Remove Places",
            "Are you sure to remove places?",
            [{ text: "Cancel" }, { text: "Okay", onPress: removePlaces }],
            {
                cancelable: true
            }
        )
    }, [placeId]);

    useEffect(() => {
        navigation?.setParams({ deleteLocation: deleteLocation, placeId: placeId });
    }, [deleteLocation, placeId])

    const handleShowMap = () => {
        navigation?.navigate(PlacesNavigationEnum.Map, {
            readonly: true,
            initialLocation: {
                latitude: selectedPlace?.latitude,
                longitude: selectedPlace?.longitude
            }
        });
    }

    return (
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
            <Image source={{ uri: selectedPlace?.image }} style={styles.image} />
            <View style={styles.locationContainer}>
                <View style={styles.addressContainer}>
                    <Text style={styles.address}>{selectedPlace?.address}</Text>
                </View>
                <MapPreview
                    latitude={selectedPlace?.latitude}
                    longitude={selectedPlace?.longitude}
                    onPress={handleShowMap}
                    style={styles.mapPreview}
                />
            </View>
        </ScrollView>
    )
}

(PlaceDetailScreen as any).navigationOptions = (navData: NavigationContainerProps) => {
    const deleteFn = navData.navigation?.getParam("deleteLocation");
    const placeId = navData.navigation?.getParam("placeId");
    return {
        headerTitle: navData.navigation?.getParam("placeTitle"),
        headerRight: <View style={styles.headerActions}>
            <TouchableOpacity onPress={deleteFn}>
                <MaterialIcons
                    name="delete"
                    size={26}
                    color={COLORS.danger} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navData.navigation?.navigate(PlacesNavigationEnum.NewPlace, { placeId: placeId })}>
                <MaterialIcons
                    name="edit"
                    size={26}
                    color={COLORS.info} />
            </TouchableOpacity>
        </View>
    }
}

const styles = StyleSheet.create({
    image: {
        height: '35%',
        minHeight: 300,
        width: '100%',
        backgroundColor: '#ccc'
    },
    locationContainer: {
        marginVertical: 20,
        width: '90%',
        maxWidth: 350,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: 'white',
        borderRadius: 10
    },
    addressContainer: {
        padding: 20
    },
    address: {
        color: COLORS.primary,
        textAlign: 'center'
    },
    mapPreview: {
        width: '100%',
        maxWidth: 350,
        height: 300,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    headerActions: {
        flexDirection: "row",
        marginRight: 10
    }

})