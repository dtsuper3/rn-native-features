import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { CustomHeaderButton } from '../components/HeaderButton'
import { NavigationContainerProps } from 'react-navigation'
import { PlacesNavigationEnum } from '../interface/Navigation'
import { FlatList } from 'react-native-gesture-handler'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { PlaceItem } from '../components/PlaceItem'
import * as PlacesAction from "../store/places-action";

interface IPlaceListScreen extends NavigationContainerProps { }

export const PlaceListScreen: React.FC<IPlaceListScreen> = (props) => {
    const places = useSelector((state: RootState) => state.places.places);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(PlacesAction.fetchPlacesDispatcher());
    }, [dispatch]);

    return (
        <FlatList
            data={places}
            keyExtractor={item => item.id.toString()}
            renderItem={item => (
                <PlaceItem
                    image={item.item.image}
                    title={item.item.title}
                    address={""}
                    onSelect={() => {
                        props.navigation?.navigate(PlacesNavigationEnum.PlaceDetail, {
                            placeTitle: item.item.title,
                            placeId: item.item.id,
                        })
                    }}
                />
            )}
        />
    )
}

(PlaceListScreen as any).navigationOptions = (navData: NavigationContainerProps) => {
    return {
        headerTitle: "All Places",
        headerRight: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
                title="Add Place"
                iconName={Platform.OS === "android" ? "md-add" : "ios-add"}
                onPress={() => {
                    navData.navigation?.navigate(PlacesNavigationEnum.NewPlace)
                }} />
        </HeaderButtons>
    }

}

const styles = StyleSheet.create({

})