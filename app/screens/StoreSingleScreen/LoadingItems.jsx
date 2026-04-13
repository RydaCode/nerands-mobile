import { ActivityIndicator, Text, View } from 'react-native'
import { COLORS } from '../../../constants/constants'

const LoadingItems = ({ mainStyles, textStyles, indicatorSize, indicatorTitle  }) => {
    return (
        <View
            className={`${mainStyles}`}
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20
            }}>
            <ActivityIndicator size={indicatorSize} color={COLORS.primary} />
            <Text className={`${textStyles}`} style={{fontFamily: 'roboto-medium', marginTop: 4}}>{indicatorTitle}</Text>
        </View>
    )
}

export default LoadingItems