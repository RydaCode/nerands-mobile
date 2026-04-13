import { Text, View } from 'react-native'

const EmptyState = ({ icon, description }) => {
    return (
        <View className="flex-1 justify-center items-center">
            <View  className=''>{icon}</View>
            <Text style={{fontFamily: 'roboto-medium'}} className="text-black text-lg">{description}</Text>
        </View>
    )
}

export default EmptyState