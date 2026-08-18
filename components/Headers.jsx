import { COLORS } from '@/constants/constants'
import { useResponsive } from '@/hook/useResponsive'
import { FontAwesome } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useNotificationModal } from './home/NotificationContext'

/**
 * @param {{
 *   header_name: string,
 *   otherStyles?: string,
 *   textStyles?: string,
 *   fontFamily?: string,
 *   icon?: import('react').ReactNode,
 *   handlePress?: () => void
 * }} props
 */

const Headers = ({
    header_name,
    otherStyles = '',
    textStyles = '',
    fontFamily = 'outfit-medium',
    icon = null,
    handlePress = null,
}) => {
    const router = useRouter();

    const unreadCount = useSelector(state => state.notifications.notifications);
        
    const {
        openNotifications
    } = useNotificationModal();

    const finalNotCount = (unreadCount?.length > 9 ? '9+' : unreadCount?.length) || 0;

    const {
        wp,
        responsiveSize,
        isTablet
    } = useResponsive();

    return (
        <View
            className={`flex-row pt-1 justify-between items-center w-full mb-1 ${otherStyles}`}
        >
            <TouchableOpacity
                className="rounded-full bg-primary justify-center items-center"
                onPress={() => router.back()}
                style={{
                    height: responsiveSize(8, 33, 40), width: responsiveSize(8, 33, 40)
                }}
            >
                <FontAwesome
                    name="angle-left"
                    size={19}
                    style={{ color: COLORS.white }}
                />
            </TouchableOpacity>

            <View
                className={`${icon ? 'justify-center items-center' : ''}`}
                style={{ width: '61%' }}
            >
                <Text
                    numberOfLines={1}
                    style={{ fontFamily }}
                    className={textStyles}
                >
                    {header_name}
                </Text>
            </View>

            <TouchableOpacity
                onPress={openNotifications}
                style={{ backgroundColor: COLORS.navBtnBgHome, height: responsiveSize(8, 20, 30), width: responsiveSize(8, 20, 30) }}
                className='rounded-full justify-center items-center relative'
            >
                <FontAwesome name="bell" size={17} color={COLORS.black} />
                <View
                    style={{ top: -8, width: responsiveSize(8, 12, 21), height: responsiveSize(8, 12, 21) }}
                    className='absolute left-5 bottom-0 justify-center items-center bg-red border border-white rounded-full'
                >
                    <Text className='text-white text-sm'>{finalNotCount}</Text>
                </View>
            </TouchableOpacity>

            {icon && (
                <TouchableOpacity
                    className="border-2 border-lavender rounded-full justify-center items-center"
                    style={{
                        height: wp(9),
                        width: wp(9)
                    }}
                    onPress={() => handlePress?.()}
                >
                    {icon}
                </TouchableOpacity>
            )}
        </View>
    )
}

export default Headers