import { createStackNavigator, createAppContainer, createSwitchNavigator } from "react-navigation";

import { PlaceListScreen } from "../screens/PlaceListScreen";
import { PlacesNavigationEnum } from "../interface/Navigation";
import { PlaceDetailScreen } from "../screens/PlaceDetailScreen";
import { NewPlaceScreen } from "../screens/NewPlaceScreen";
import { MapScreen } from "../screens/MapScreen";
import { Platform } from "react-native";
import { COLORS } from "../constants/Color";
import { AuthSrceen } from "../screens/Auth";


const PlacesNavigator = createStackNavigator({
    [PlacesNavigationEnum.Places]: PlaceListScreen,
    [PlacesNavigationEnum.PlaceDetail]: PlaceDetailScreen,
    [PlacesNavigationEnum.NewPlace]: NewPlaceScreen,
    [PlacesNavigationEnum.Map]: MapScreen
}, {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: Platform.OS === "android" ? COLORS.primary : ""
        },
        headerTintColor: Platform.OS === "android" ? "white" : COLORS.primary
    }
})

const MainNavigator = createSwitchNavigator({
    [PlacesNavigationEnum.Auth]: AuthSrceen,
    [PlacesNavigationEnum.Main]: PlacesNavigator
})

export const RootNavigaton = createAppContainer(MainNavigator);