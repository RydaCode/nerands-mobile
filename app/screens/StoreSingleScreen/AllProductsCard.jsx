import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Image, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { COLORS } from '../../../constants/constants';
import { Carticons } from '../../../constants/icons';
import { PRODUCTS_IMAGE_URI } from '../../../RequestMethods';
import ProductDetailsModal from './ProductDetailsModal';
import { useProductDetailsReducer } from './useProductDetailsReducer';

const AllProductsCard = ({ store_data, item }) => {
  if (!item) return null;

  const isAvailable = item.is_available === true || item.is_available === "true";
  const extras = item.product_extras || [];

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [state, localDispatch] = useProductDetailsReducer();

  const imageDimensions = isLandscape
    ? { width: '35%', height: 170, marginRight: 10 }
    : { width: width * 0.25, height: height * 0.09 };

  // Use first product image or placeholder
  const productImage = Array.isArray(item.product_images) && item.product_images.length > 0
    ? item.product_images[0]
    : Carticons.placeholder;

  return (
    <>
      <MotiView
          from={{ opacity: 0, translateY: 50 }}   // start hidden + lower
          animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
          transition={{ duration: 1000 }}
          className='justify-end'
      >
      <ProductDetailsModal
        state={state}
        localDispatch={localDispatch}
        item={item}
        extras={extras}
        isAvailable={isAvailable}
        is_closed={store_data.is_closed}
        store_profileimage={store_data.store_profileimage}
        product_iamges={productImage}
        store_description={store_data.store_description}
        store_name={store_data.store_name}
        store_latitude={store_data.store_latitude}
        store_longitude={store_data.store_longitude}
        store_location={store_data.store_location}
        store_id={store_data.store_id}
        store_phone_num={store_data.store_phone_num}
        business_id={store_data.business_id}
      />

      {/* Product Card */}
      <TouchableOpacity
        onPress={() => localDispatch({ type: 'TOGGLE_MODAL' })}
        className='flex-row justify-center items-center bg-white'
      >
        <View className='flex-row w-full justify-between items-center'>
          
          {/* Product Info */}
          <View className='w-[70%] flex-row justify-between items-center'>
            <TouchableOpacity
              onPress={() => localDispatch({ type: 'TOGGLE_MODAL' })}
              className='w-8 h-8 items-center justify-center rounded-full border border-primary bg-navBtnBgHome'
            >
              <FontAwesome name="shopping-cart" size={15} color={COLORS.primary} />
            </TouchableOpacity>

            <View className='ml-2 flex-1'>
              <Text numberOfLines={1} className='text-lg font-semibold' style={{ fontFamily: 'roboto-medium' }}>
                {item.product_name}
              </Text>
              <Text numberOfLines={1} className='text-slate text-sm' style={{ fontFamily: 'roboto-medium' }}>
                {item.product_description}
              </Text>
              <Text className='text-lg text-primary mt-1' style={{ fontFamily: 'roboto-medium' }}>
                K{item.final_price}
              </Text>
            </View>
          </View>

          {/* Product Image */}
          <View className='rounded-md relative' style={imageDimensions}>
            <Image
              className='rounded-md w-full h-full'
              source={{ uri: `${PRODUCTS_IMAGE_URI}${productImage}` }}
            />
            {!isAvailable && (
              <View className='absolute w-full h-full bg-black rounded-md opacity-70 justify-center items-center'>
                <MaterialCommunityIcons name="lock" size={13} style={{ color: COLORS.lite }} />
                <Text style={{ fontFamily: 'roboto-regular' }} className='text-sm text-white'>
                  Unavailable
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
      <View style={{height: 1}} className='bg-grey_bg w-full my-4'/>
      </MotiView>
    </>
  );
};

export default AllProductsCard;