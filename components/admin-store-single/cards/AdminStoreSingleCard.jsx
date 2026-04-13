import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { COLORS } from '../../../constants/constants';
import { PRODUCTS_IMAGE_URI } from '../../../RequestMethods';
import ModalComponents from './ModalComponents';

const AdminStoreSingleCard = ({
    product_id,
    product_image,
    product_images,
    product_name,
    product_description,
    product_actual_price,
    product_status,
    store_name,
    store_id,
    store_category,
    product_category,
    product_colors,
    product_sizes,
    chili_option,
    product_extras_status,
    store_profileimage,
    handleCheckboxChange,
    selectedItems,
    setSelectedItems,
    active_status,
    is_available,
    variant_groups
}) => {
    const variants = JSON.stringify(variant_groups);

    // Parse JSON safely
const variant = variants ? JSON.parse(variants) : [];
const optionss = variant[0]?.id ?? [];

    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [actionType, setActionType] = useState('');

    const [productDetails, setProductDetails] = useState({
        product_id,
        product_image,
        product_images,
        product_name,
        product_description,
        product_actual_price,
        product_status,
        store_name,
        store_id,
        store_category,
        product_category,
        product_colors,
        product_sizes,
        chili_option,
        product_extras_status,
        store_profileimage,
        handleCheckboxChange,
        selectedItems,
        active_status,
        is_available,
        group_id: variant[0]?.id,
        group_name: variant[0]?.name,
        variant_is_required: variant[0]?.is_required,
        variant_multi_select: variant[0]?.multi_select,
        variant_options: JSON.stringify(variant_groups[0]?.options || [])
    });

    const openModal = (type) => {
        setActionType(type);
        setModalVisible(true);
    };
    
    const closeModal = () => {
        setModalVisible(false);
        setActionType('');  //Reset the action type
    };

    return (
        <View className="mb-4" style={{width: '48.5%'}}>
            <TouchableOpacity
                // onPress={() => openModal('edit')}
                onPress={() => router.push({
                    pathname: '../../(routes)/admin-single-product/',
                    params: {
                        product_id,
                        product_image,
                        product_images,
                        product_name,
                        product_description,
                        product_actual_price,
                        product_status,
                        store_name,
                        store_id,
                        store_category,
                        product_category,
                        product_colors,
                        product_sizes,
                        chili_option,
                        product_extras_status,
                        store_profileimage,
                        handleCheckboxChange,
                        selectedItems,
                        active_status,
                        is_available,
                        group_id: variant[0]?.id,
                        group_name: variant[0]?.name,
                        variant_is_required: variant[0]?.is_required,
                        variant_multi_select: variant[0]?.multi_select,
                        variant_options: JSON.stringify(variant_groups[0]?.options || [])
                    }
                })}
            >
                <View className="justify-center items-center w-full">
                    <View className="relative rounded" style={{width: '100%', height: 180}}>
                        <Image
                            resizeMode="cover"
                            className="w-full h-full rounded"
                            source={{ uri: `${PRODUCTS_IMAGE_URI}${product_image}` }}
                        />
                        <View
                            style={{width: 27, height: 27, justifyContent: 'center', alignItems: 'center'}}
                            className="absolute rounded bg-[#DFF6E6] z-50 top-2 left-2"
                        >
                            <BouncyCheckbox
                                isChecked={selectedItems.includes(product_id)}
                                textStyle={{ textDecorationLine: "none", color: COLORS.slate}}
                                size={20}
                                onPress={() => handleCheckboxChange(product_id)}
                                fillColor={COLORS.green2}
                                iconStyle={{ borderColor: COLORS.green2, borderWidth: 2, borderRadius: 2 }}
                                innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                            />
                        </View>
                        {product_status === false &&
                            <View className='absolute w-full h-full justify-center items-center bg-transparentBlack p-1'>
                                <Feather name="lock" size={18} style={{ color: COLORS.slate, opacity: 0.9, marginRight: 2 }} />
                                <Text className='text-white text-base' style={{fontFamily: 'roboto-medium',  opacity: 0.7,}}>Unpublished</Text>
                            </View>
                        }

                        {is_available === false && product_status === true &&
                            <View className='absolute w-full h-full justify-center items-center bg-transparentBlack p-1'>
                                <Feather name="lock" size={18} style={{ color: COLORS.slate, opacity: 0.9, marginRight: 2 }} />
                                <Text className='text-white text-base' style={{fontFamily: 'roboto-medium',  opacity: 0.7,}}>Unavailable</Text>
                            </View>
                        }
                    </View>
                </View>
                <View className="w-full justify-center items-center"> 
                    <Text numberOfLines={1} style={{fontFamily: 'roboto-medium'}} className="text-base text-center">{product_name}</Text>
                    <Text numberOfLines={1} style={{fontFamily: 'roboto-medium'}} className="text-base text-primary">K{product_actual_price}</Text>
                </View>
            </TouchableOpacity>
            <View className='w-full mt-1 rounded-full bg-slate opacity-10' style={{height: 1}} />
            <ModalComponents
                visible={modalVisible}
                onClose={closeModal}
                actionType={actionType}
                productDetails={productDetails}
            />
        </View>
    );
};

export default AdminStoreSingleCard;