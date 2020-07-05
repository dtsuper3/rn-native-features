import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { NavigationContainerProps } from 'react-navigation'

export const PlaceDetailScreen = () => {
    return (
        <View>
            <Text>PlaceDetailScreen</Text>
        </View>
    )
}

(PlaceDetailScreen as any).navigationOptions = (navData: NavigationContainerProps) => {
    return {
        headerTitle: navData.navigation?.getParam("placeTitle")
    }
}

const styles = StyleSheet.create({

})