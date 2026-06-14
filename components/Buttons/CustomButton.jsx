import { COLORS } from '@/constants/constants'
import { Text, TouchableOpacity } from 'react-native'

const CustomButton = ({ title, handlePress, otherStyles, textStyles, disabled }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled}
            className={`w-full items-center justify-center elevation-sm rounded ${otherStyles}`}
        >
            <Text className={`${textStyles}`} style={{fontFamily: 'maven-medium', color: COLORS.white}}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton