import React, { useEffect, useState, useRef } from "react";
import { View, Image, StyleSheet, Text, Platform, Alert } from "react-native";
import * as LocalAuthentication from 'expo-local-authentication';
import DropdownAlert from 'react-native-dropdownalert';
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationContainerProps } from "react-navigation";
import { PlacesNavigationEnum } from "../interface/Navigation";
import { COLORS } from "../constants/Color";

interface IAuthSrceen extends NavigationContainerProps { }
export const AuthSrceen: React.FC<IAuthSrceen> = (props) => {
    const [compatible, setCompatible] = useState(false);
    const dropdown = useRef<any>();

    useEffect(() => {
        checkDeviceForHardware();
    }, [])

    const checkDeviceForHardware = async () => {
        let compatible = await LocalAuthentication.hasHardwareAsync();
        setCompatible(compatible);
        if (!compatible) {
            showIncompatibleAlert();
        }
    };
    const showIncompatibleAlert = () => {
        dropdown.current?.alertWithType(
            'error',
            'Incompatible Device',
            'Current device does not have the necessary hardware to use this API.'
        );
    };

    const handleLoginPress = () => {
        scanBiometrics();
        // if (Platform.OS === 'android') {
        //     showAndroidAlert();
        // } else {
        // }
    };

    const checkForBiometrics = async () => {
        let biometricRecords = await LocalAuthentication.isEnrolledAsync();
        if (!biometricRecords) {
            dropdown.current?.alertWithType(
                'warn',
                'No Biometrics Found',
                'Please ensure you have set up biometrics in your OS settings.'
            );
        } else {
            handleLoginPress();
        }
    };

    // const showAndroidAlert = () => {
    //     Alert.alert('Fingerprint Scan', 'Place your finger over the touch sensor.');
    //     scanBiometrics();
    // };

    const scanBiometrics = async () => {
        let result = await LocalAuthentication.authenticateAsync();
        if (result.success) {
            props.navigation?.navigate(PlacesNavigationEnum.Main);
            dropdown.current?.alertWithType(
                'success',
                'You are you!',
                'Bio-Authentication succeeded.'
            );
        } else {
            dropdown.current?.alertWithType(
                'error',
                'Uh oh!',
                'Bio-Authentication failed or canceled.'
            );
        }
    };

    return <View style={styles.container}>
        <Image
            style={styles.logo}
            source={require('../assets/auth.png')}
        />
        <TouchableOpacity
            onPress={
                compatible
                    ? checkForBiometrics
                    : showIncompatibleAlert
            }
            style={styles.button}>
            <Text style={styles.buttonText}>
                Bio Login
      </Text>
        </TouchableOpacity>
        <DropdownAlert
            ref={dropdown}
            closeInterval={5000}
        />
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: 10,
        backgroundColor: COLORS.primary,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 60,
        backgroundColor: 'transparent',
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    buttonText: {
        fontSize: 30,
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.30)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    logo: {
        height: 128,
        width: 128,
    },
});