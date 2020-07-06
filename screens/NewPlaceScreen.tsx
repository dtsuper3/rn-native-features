import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, TextInput, Button } from 'react-native'
import { NavigationContainerProps } from 'react-navigation'
import { ScrollView } from 'react-native-gesture-handler'
import { COLORS } from '../constants/Color'
import { useDispatch } from 'react-redux'
import * as placesAction from "../store/places-action";
import { ImgPicker } from '../components/ImagePicker';
import { LocationPicker } from "../components/LocationPicker";
import { ILocation } from '../interface/Location'

interface INewPlaceScreen extends NavigationContainerProps { }

export const NewPlaceScreen: React.FC<INewPlaceScreen> = (props) => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState<string | undefined>();
    const [selectedLocation, setSelectedLocation] = useState<ILocation>({
        latitude: undefined,
        longitude: undefined
    });

    const dispatch = useDispatch();
    const handleInputChange = (text: string) => {
        setTitle(text);
    }

    const savePlaceHnadler = () => {
        if (image !== undefined && typeof image === "string") {
            dispatch(placesAction.addPlace(title, image, selectedLocation))
            props.navigation?.goBack()
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
                <ImgPicker onImageTake={handleImageTaken} />
                <LocationPicker
                    navigation={props.navigation}
                    onLocationPicked={handleLocationPicked} />
                <Button
                    title="Save Place"
                    color={COLORS.primary}
                    onPress={savePlaceHnadler} />
            </View>
        </ScrollView>
    )
}

(NewPlaceScreen as any).navigationOptions = (navData: NavigationContainerProps) => {
    return {
        headerTitle: "Add Place",
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