import React from "react";
import { HeaderButton, HeaderButtonProps } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Color";
import { Platform } from "react-native";

interface ICustomHeaderButton extends HeaderButtonProps { }
export const CustomHeaderButton: React.FC<ICustomHeaderButton> = (props) => {
    return <HeaderButton
        {...props}
        IconComponent={Ionicons}
        iconSize={23}
        color={Platform.OS === "android" ? "white" : COLORS.primary} />
}
