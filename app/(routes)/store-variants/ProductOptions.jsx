import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';
import ProductImagesGallery from '../../screens/other-single-product/ProductImagesGallery';

const ProductOptions = () => {
    const params = useLocalSearchParams()
    const {data: getOptions, isLoading: loadingOptions, error: errorOptions, get: fetchOptions} = useApi(
        
    );

    const {data: addoptions, isLoading: addOptionLoading, error: addOptionError, post: addOptions} = useApi(
        '/variants/group/product/options/add'
    );

    const {data: getProductOptions, isLoading: getProductOptionsLoading, error: getProductOptionError, get: getAttachedProductOptions} = useApi(
        
    );
    const {data: deleteOption, isLoading: deleteOptionLoading, error: deleteOptionError, del: deleteOptions} = useApi();
    const router = useRoute();
    const [options, setOptions] = useState([]);
    const [addingOptionId, setaddingOptionId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [deletingOptionId, setDeletingOptionId] = useState(null);

    useEffect(() => {
        fetchOptions(`/variants/group/options/${params.id}?page=1&limit=10`);
    }, []);

    useEffect(() => {
        if (getOptions?.data) {
            setOptions(getOptions.data);
        }
    }, [getOptions?.data]);

    useEffect(() => {
        if (params) {
            getAttachedProductOptions(
                `/variants/product/options/${params.product_id}/${params.id}`
            );   
        }
    }, [params])

    const product_options = getProductOptions?.data ?? [];

    // Add options to product
        const handleAddOptionToProduct = async (id, variant_group_id) => {
            try {
                setErrorMessage('');
                const payload = {
                    product_id: params.product_id,
                    variant_group_id: variant_group_id,
                    group_option_id: id
                };
    
                setaddingOptionId(id);
                const res = await addOptions(payload);
                if (res?.success) {
                    toast.success(res.message || 'Option added successfully');
                    setIsRedirecting(true);
    
                    // setTimeout(() => {
                    //     router.back();
                    // }, 1500);
                } else {
                    toast.error(res?.message || 'Something went wrong');
                }
            } catch (err) {
                toast.error('Request failed');
            } finally {
                setaddingOptionId(null); // 👈 reset
            }
        };

    const handleDeleteOption = async (id) => {
        try {
            setDeletingOptionId(id); // 👈 track which item is deleting

            const res = await deleteOptions(
                null, `/variants/delete/options/product/${params.product_id}/${id}`
            );

            if (res?.success) {
                toast.success('Option removed successfully');

                // update UI instantly (if using local state)
            } else {
                toast.error(res?.message || 'Something went wrong.');
            }
        } catch (error) {
            toast.error(error?.message || 'Something went wrong.');
        } finally {
            setDeletingOptionId(null); // 👈 reset
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className=' px-2'>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className='bg-primary rounded-full mb-2 justify-center items-center'
                    style={{ width: 35, height: 35 }}
                >
                    <FontAwesome name="angle-left" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View className="w-full flex-1 justify-center px-2">
                {loadingOptions ? 
                    (
                        <View className='justify-center flex-1 items-center my-5'>
                            <ActivityIndicator size={40} color={COLORS.primary}/>
                            <Text className='text-lg mt-1 text-primary' style={{fontFamily: 'roboto-medium'}}>
                                Loading options...
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={options || []}
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({item}) => {

                                const isAlreadyAdded = product_options.some(
                                    (items) => items.group_option_id === item.id
                                );

                                return (
                                    <View className='w-full'>
                                        <View className='flex-row w-full justify-between items-center'>
                                            <View className='' style={{width: '76%'}}>
                                                <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>{item.name}</Text>
                                                <Text className='text-sm text-green1' style={{fontFamily: 'roboto-medium'}}>K{item.price}</Text>
                                            </View>

                                            {addingOptionId === item.id || deletingOptionId === item.id ? (
                                                <View className='items-center justify-center' style={{ width: '18%', height: 35 }}>
                                                    <ActivityIndicator size={28} color={COLORS.primary} />
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    className='items-center border border-lavender justify-center rounded elevation-sm flex-row'
                                                    style={{
                                                        width: '22%',
                                                        height: 35,
                                                        backgroundColor: isAlreadyAdded ? COLORS.red : COLORS.green2
                                                    }}
                                                    onPress={() => {
                                                        isAlreadyAdded ? handleDeleteOption(item.id) :
                                                        handleAddOptionToProduct(item.id, item.variant_group_id)
                                                    }}
                                                >
                                                    {isAlreadyAdded ?
                                                        <FontAwesome6 name='trash' color='white' size={13} /> :
                                                        <FontAwesome name='plus' color='red' size={12} />
                                                    }
                                                    <Text className='text-sm text-white ml-1' style={{fontFamily: 'roboto-medium'}}>
                                                        {isAlreadyAdded ? 'Remove' : 'Add'}
                                                    </Text>
                                                                        
                                                    {/* <FontAwesome5 name='trash' color='red' size={21} /> */}
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        <View className='bg-lavender my-3' style={{height: 1}}/>
                                    </View>     
                                )}
                            }
                            ListHeaderComponent={
                                <View className='mb-6'>
                                    <Text className='text-xl text-black' style={{fontFamily: 'roboto-medium'}}>{params.product_name}</Text>
                                    <ProductImagesGallery
                                        mainImage={params.product_image}
                                        images={Array.isArray(params.product_images) ? params.product_image : []}
                                    />

                                    <Text className="text-2xl font-bold mb-1 mt-6">{params.name}</Text>
                                    <View className='mb-4'>
                                        <Text className='text-base text-slate ' style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}>
                                            There are {getOptions?.data?.length === 0 ? 'no' : getOptions?.data?.length} options under <Text className='text-green1'>[{params?.name}]</Text> group.
                                        </Text>
                                    </View>
                                </View>
                            }
                            ListFooterComponent={
                                <TouchableOpacity
                                    className="justify-center items-center py-3 mb-20 elevation-md rounded-sm bg-green1"
                                    // onPress={() => setViewModal(false)}
                                >
                                    <Text className='text-base text-white' style={{fontFamily: 'roboto-medium'}}>Close</Text>
                                </TouchableOpacity>
                            }
                        />
                    )
                }
            </View>
        </SafeAreaView>
    )
}

export default ProductOptions