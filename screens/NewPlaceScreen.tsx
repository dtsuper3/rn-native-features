import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Button, ToastAndroid, ActivityIndicator } from 'react-native'
import { NavigationContainerProps } from 'react-navigation'
import { ScrollView } from 'react-native-gesture-handler'
import { COLORS } from '../constants/Color'
import { useDispatch, useSelector } from 'react-redux'
import * as placesAction from "../store/places-action";
import { ImgPicker } from '../components/ImagePicker';
import { LocationPicker } from "../components/LocationPicker";
import { ILocation } from '../interface/Location'
import { RootState } from '../store'
import { PlacesNavigationEnum } from '../interface/Navigation'

interface INewPlaceScreen extends NavigationContainerProps { }

export const NewPlaceScreen: React.FC<INewPlaceScreen> = (props) => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState<string | undefined>();
    const [selectedLocation, setSelectedLocation] = useState<ILocation>({
        latitude: undefined,
        longitude: undefined
    });
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const placeId = props.navigation?.getParam("placeId");
    const placeData = useSelector((state: RootState) => state.places.places.find(item => item.id === placeId));

    useEffect(() => {
        if (placeData) {
            // console.log("Use Effect Data:- ", placeData);
            setTitle(placeData.title);
            setImage(placeData.image);
            setSelectedLocation({
                latitude: placeData.latitude,
                longitude: placeData.longitude
            })
        }

    }, [placeData]);

    const handleInputChange = (text: string) => {
        setTitle(text);
    }

    const savePlaceHnadler = async () => {
        if (image !== undefined && typeof image === "string" && title.length > 0 && selectedLocation.latitude && selectedLocation.longitude) {
            setIsLoading(true);
            if (placeId) {
                try {
                    await dispatch(placesAction.updatePlaceDispatcher(placeId, title, image, selectedLocation))
                    props.navigation?.navigate(PlacesNavigationEnum.Places);
                } catch (err) {
                    ToastAndroid.show(err, 3000)
                }
                setIsLoading(false);
            } else {
                try {
                    await dispatch(placesAction.addPlace(title, image, selectedLocation))
                    props.navigation?.goBack();
                } catch (err) {
                    ToastAndroid.show(err, 3000)
                }
                setIsLoading(false);
            }
        } else {
            ToastAndroid.show("Please fill all details", 3000);
        }
    }

    const handleImageTaken = (img: string) => {
        setImage(img)
    }

    const handleLocationPicked = useCallback((location: ILocation) => {
        setSelectedLocation(location);
    }, []);

    return (
        <ScrollView>
            <View style={styles.form}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.textInput}
                    value={title}
                    onChangeText={handleInputChange} />
                <ImgPicker onImageTake={handleImageTaken} image={image} />
                <LocationPicker
                    navigation={props.navigation}
                    onLocationPicked={handleLocationPicked}
                    location={selectedLocation} />
                {
                    isLoading ?
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 5 }}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View> :
                        <Button
                            title={placeId ? "Update Place" : "Save Place"}
                            color={COLORS.primary}
                            onPress={savePlaceHnadler} />

                }
            </View>
        </ScrollView>
    )
}

(NewPlaceScreen as any).navigationOptions = (navData: NavigationContainerProps) => {
    const placeId = navData.navigation?.getParam("placeId");
    return {
        headerTitle: placeId ? "Update Place" : "Add Place",
    }

}
const styles = StyleSheet.create({
    form: {
        margin: 30
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: "bold"
    },
    textInput: {
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        marginBottom: 15,
        paddingVertical: 4,
        paddingHorizontal: 2
    }
})