import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const DoubleButtomButtons = ({handleLeftPress, handleRightPress, titleLeft, titleRight, bgColorLeft, bgColorRight, textColor, marginTop, leftWidth, rightWidth, btnBorderRadius, btnElevation} ) => {
    return (
        <View className='flex-row w-full justify-between' style={{marginTop:marginTop}}>
            <TouchableOpacity
                onPress={handleLeftPress}
                className='items-center py-3'
                style={{elevation:btnElevation, backgroundColor: bgColorLeft, width:leftWidth, borderRadius:btnBorderRadius}}
            >
                <Text className='font-bold' style={{color: textColor, fontFamily: 'maven-medium'}}>{titleLeft}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleRightPress}
                className='items-center py-3'
                style={{elevation:btnElevation, backgroundColor: bgColorRight, width:rightWidth, borderRadius:btnBorderRadius}}
            >
                <Text className='font-bold' style={{color: textColor, fontFamily: 'maven-medium'}}>{titleRight}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default DoubleButtomButtons