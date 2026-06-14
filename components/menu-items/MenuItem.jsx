import { Text, TouchableOpacity, View } from 'react-native';
import { SIZES } from '../../constants/constants';

const MenuItem = ({title, router, route_name, icon, textStyles}) => {
    return (
        <TouchableOpacity
            onPress={() => router.push(route_name)}
            style={{width: '30%', height: 75, borderRadius: SIZES.border}}
            className='mb-2 border border-[#E2E8F0] items-center justify-center'
        >
            <View className='h-full items-center justify-center bg-white border-1 rounded-md border-lavender w-full'>
                <View>{icon}</View>
                <Text className={`${textStyles} text-sm`} style={{fontFamily: 'roboto'}}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default MenuItem;