import { COLORS, SIZES } from '@/constants/constants'
import { FontAwesome } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'

const Headers = ({ header_name, otherStyles, textStyles, fontFamily, icon, handlePress }) => {
    const router = useRouter();
    return (
        <View className={`flex-row pt-1 justify-between items-center w-full mb-1 ${otherStyles}`}>
            <View>
                <TouchableOpacity
                    className='rounded-full bg-primary justify-center items-center'
                    onPress={() => router.back()}
                    style={{ height: SIZES.navBtn, width: SIZES.navBtn}}
                >
                    <FontAwesome name='angle-left' size={19} style={{ color: COLORS.white }} />
                </TouchableOpacity>
            </View>
            <View className={`${icon && 'justify-center items-center'}`} style={{width: '75%'}}>
                <Text numberOfLines={1} style={{fontFamily: `${fontFamily}`}} className={`${textStyles}`}>{header_name}</Text>
            </View>
            {icon &&
                <TouchableOpacity
                    className='border-2 border-lavender rounded-full justify-center items-center'
                    style={{ height: SIZES.navBtn, width: SIZES.navBtn}}
                    onPress={() => handlePress ? handlePress() : null}
                >
                    {icon}
                </TouchableOpacity>
            }
        </View>
    )
}

export default Headers