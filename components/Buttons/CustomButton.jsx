import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS, icons, SIZES } from '@/constants/constants'

const CustomButton = ({ title, handlePress, otherStyles, textStyles, disabled }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled}
            className={`w-full items-center justify-center ${otherStyles}`} style={{borderRadius: SIZES.border}}
        >
            <Text className={`${textStyles}`} style={{fontFamily: 'maven-medium', color: COLORS.white}}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton