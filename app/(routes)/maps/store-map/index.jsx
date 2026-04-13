import { useLocalSearchParams } from 'expo-router'
import { View, Text } from 'react-native'

const index = () => {
    const params = useLocalSearchParams();
    // id, image, name, desc
    return (
        <View className='flex-1 bg-white justify-center items-center'>
            <Text>{params.name}</Text>
        </View>
    )
}

export default index