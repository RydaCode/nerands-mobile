import { FontAwesome } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'
import { COLORS, SIZES } from '../constants/constants'

const ViewCart = ({cart_qty, cart_total, router}) => {
    return (
        <TouchableOpacity
            onPress={() => router.push('../cart/')}
            activeOpacity={0.5}
            className='flex-row w-full rounded bg-primary justify-between items-center absolute px-2'
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5, bottom: 46, paddingVertical: 6 }}
        >
            <View
                className='p-2 justify-center items-center bg-white h-[35px] w-[35px] rounded-full'
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5 }}
            >
                <Text className='text-primary text-lg' style={{fontFamily: 'maven-medium'}}>{cart_qty}</Text>
            </View>

            <View className='flex-row justify-start items-center' >
                <FontAwesome name='shopping-cart' color={COLORS.white} size={19} />
                <Text className='ml-2 text-white text-2xl' style={{ fontFamily: 'maven-medium' }}>View Cart</Text>
            </View>
            <View
                className='items-center justify-center px-2 bg-white'
                style={{paddingVertical: 7, borderRadius: SIZES.radius, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5,}}
            >
                <Text className='text-primary text-lg' style={{fontFamily: 'maven-medium'}}>K{cart_total}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ViewCart