import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from '../../../constants/constants';
import { useResponsive } from '../../../hook/useResponsive';
import { addLocalMarketItem } from '../../../redux/store/slices/LocalMarketCartSlice';
import { IMAGE_URI } from '../../../RequestMethods';
import { getAvatarColor } from '../../../utils/getInitials';
import { toast } from '../../../utils/toast';

const LocalMarketCard = (props) => {
    const { latitude, longitude, displayCurrentLocation } = useSelector(state => state.location);
    const router = useRouter();
    const dispatch = useDispatch();
    const localMarketCartItems = useSelector((state) => state.localmarketcart.localMarketCartItems);
    const { wp } = useResponsive();

    // ✅ Add item to Local Market Cart
    const handleAddItem = () => {
        // if (props.is_closed) {
        //     toast.info('Store is currently closed.');
        //     return;
        // }

        dispatch(addLocalMarketItem({ 
            product_id: props.product_id,
            product_images: props.product_image,
            product_name: props.product_name,
            product_description: props.product_description,
            final_price: props.product_price,
            product_price: props.product_price,
            product_qty: 1,
            total_price: props.total_price,
            product_status: props.product_status,
            store_name: props.store_name,
            store_id: props.store_id,
            business_id: props.business_id,
            store_phone_num: props.store_phone_num,
            store_category: props.store_category,
            product_category: props.product_category,
            store_profileImage: props.store_profileImage,
            store_location: props.store_location,
            store_latitude: props.store_latitude,
            store_longitude: props.store_longitude
        }));

        toast.success('Product added to cart');
    };
    
    const pointA = { latitude: latitude, longitude: longitude }; // User
    const pointB = { latitude: props.store_latitude, longitude: props.store_longitude }; //Store

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className='rounded bg-white border border-grey_bg items-center justify-center relative'
            style={{width: '48.5%'}}
        >
            <View
                className='relative w-full overflow-hidden rounded justify-center items-center'
                style={{
                    height: wp(47),
                    backgroundColor: !props.product_image ? getAvatarColor(props.product_id) : 'white',
                }}
            >
                {!props.product_image ? (
                    <Text
                        className="text-white text-xs"
                        style={{ fontFamily: 'roboto-medium' }}
                    >
                        Loading image...
                    </Text>
                ) : (
                    <Image
                        className="rounded"
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={500}

                        source={{uri: `${IMAGE_URI}${props.product_image}`}}
                    />
                )}
                <View className='flex-row px-2 absolute h-7 w-30 top-2 left-2 items-center justify-center bg-transparentBlack rounded-full'>
                    <Text numberOfLines={1} className='text-sm text-white'>Fresh</Text>
                </View>
            </View>
            <View className='w-full justify-center items-center px-1'>
                <Text numberOfLines={1} style={{fontFamily: 'roboto-medium'}} className='text-base'>{props.product_name}</Text>
            </View>
            <View className='w-full justify-center items-center px-1'>
                <Text className='text-lg text-primary' style={{fontFamily: 'roboto-medium'}}>K{props.product_price}</Text>
            </View>
            <TouchableOpacity
                disabled={localMarketCartItems.some(item => item.product_id === props.product_id)}
                onPress={handleAddItem}
                className='flex-row rounded bg-primary elevation bottom-0 items-center justify-center'
                style={{
                    width: '97%', height: wp(8),
                    opacity: localMarketCartItems.some(item => item.product_id === props.product_id) ? 0.5 : 0.9
                }}
            >
                {props.is_closed ? (
                    <Feather name="lock" size={17} color={COLORS.white} />
                ) : (
                    <FontAwesome6 color={COLORS.white} name='bag-shopping' size={14} />
                )}
                <Text style={{fontFamily: 'roboto-medium'}} className='ml-2 text-white'>
                    {localMarketCartItems.some(item => item.product_id === props.product_id) ? "Already In Cart" : "Add To cart"}
                </Text>
            </TouchableOpacity>
            <View className='w-full mt-1 h-[1px] rounded-full bg-slate opacity-10'/>
        </TouchableOpacity>
    )
}

export default LocalMarketCard