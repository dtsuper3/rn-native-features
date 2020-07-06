import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { NavigationContainerProps } from 'react-navigation'
import { ScrollView } from 'react-native-gesture-handler'
import { MapPreview } from "../components/MapPreview";
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { COLORS } from '../constants/Color';
import { PlacesNavigationEnum } from '../interface/Navigation';

interface IPlaceDetailScreen extends NavigationContainerProps { }

export const PlaceDetailScreen: React.FC<IPlaceDetailScreen> = (props) => {
    const placeId = props.navigation?.getParam("placeId");
    const selectedPlace = useSelector((state: RootState) => state.places.places.find(item => item.id === placeId))

    const handleShowMap = () => {
        props.navigation?.navigate(PlacesNavigationEnum.Map, {
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
    return {
        headerTitle: navData.navigation?.getParam("placeTitle")
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
    }

})