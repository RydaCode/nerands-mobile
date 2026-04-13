import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../../components/Buttons/CustomButton';
import EmptyState from '../../../../components/EmptyState';
import { COLORS } from '../../../../constants/constants';
import useApi from '../../../../hook/useApi';
import { toast } from '../../../../utils/toast';
import LoadingIndicator from '../../../LoadingIndicator';
import Redirecting from '../../../Redirecting';

const StoreExtrasCard = ({
    extra_name,
    extra_price,
    extra_id,
    product_id,
    selectedExtras,
    setSelectedExtras,
    handleDeleteExtra,
    handleAddExtra,
    productExtras,
}) => {
    const isChecked = selectedExtras.includes(extra_id);
    const toggleCheckbox = () => {
        setSelectedExtras((prev) =>
            prev.includes(extra_id)
                ? prev.filter((id) => id !== extra_id)
                : [...prev, extra_id]
        );
    };

    const isAlreadyAdded = productExtras?.some(
        (item) => item.extra_id === extra_id && item.product_id === product_id
    );

    return (
        <View className="mb-4">
            <View className="w-full mb-1 flex-row justify-between items-center">
                <View style={{ width: '7%' }}>
                    <BouncyCheckbox
                        isChecked={isChecked}
                        onPress={toggleCheckbox}
                        size={20}
                        fillColor={isChecked ? COLORS.slate : COLORS.lavender}
                        iconStyle={{ borderColor: COLORS.red, borderRadius: 2 }}
                        innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                    />
                </View>
                <View style={{ width: '90%' }} className="flex-row justify-between items-center">
                    <View style={{ width: '78%' }}>
                        <Text className="text-base" style={{ fontFamily: 'roboto-medium' }}>
                            {extra_name}
                        </Text>
                    </View>
                    <View className="flex-row justify-end" style={{ width: '20%' }}>
                        <Text className="text-base" style={{ fontFamily: 'roboto-medium' }}>
                            K{extra_price}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="flex-row w-full justify-end items-center mt-1">
                {isAlreadyAdded ? (
                    <TouchableOpacity
                        onPress={() => handleDeleteExtra(extra_id)}
                        className="flex-row justify-center items-center"
                    >
                        <FontAwesome name="times" size={15} color={COLORS.red} />
                        <Text className="text-sm text-red ml-1">Remove</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        className="flex-row justify-center items-center"
                        onPress={() => handleAddExtra(product_id, extra_id)}
                    >
                        <FontAwesome name="plus" size={13} color={COLORS.green2} />
                        <Text className="text-sm ml-1 text-green2">Add</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View className="h-[1px] mb-4 mt-1 bg-lavender" />
        </View>
    );
};

const Index = () => {
    const params = useLocalSearchParams();
    const store_id = params.store_id;
    const product_id = params.product_id;
    const router = useRouter();

    const [selectedExtras, setSelectedExtras] = useState([]);
    const [productExtras, setProductExtras] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const {
        data: storeExtrasData,
        isLoading: storeExtrasLoading,
        get: getStoreExtras,
    } = useApi(`/stores/extras/${store_id}`);

    const {
        data: deleteExtraResponse,
        isLoading: DeleteLoading,
        post: delStoreExtra,
    } = useApi(`/products/extras/delete`);

    const {
        data: addExtraResponse,
        isLoading: AddingLoading,
        post: addExtraProduct,
    } = useApi(`/products/extras/add`);

    const {
        get: fetchProductExtras,
    } = useApi(`/products/extras/${product_id}`);

    const getProductExtras = async () => {
        const res = await fetchProductExtras();

        if (res?.data?.data) {
            setProductExtras(res.data.data || []);
        } else {
            setProductExtras([]);
        }
    };

    useEffect(() => {
        if (store_id) {
            getStoreExtras();
            getProductExtras();
        }
    }, [store_id]);

    useEffect(() => {
        if (productExtras) {
            const linkedExtraIds = productExtras.map((item) => item.extra_id);
            setSelectedExtras(linkedExtraIds);
            setRefreshKey(prev => prev + 1); // force FlatList refresh
        }
    }, [productExtras]);

    useEffect(() => {
        if (addExtraResponse?.message) {
            if (!addExtraResponse.success) {
                toast.error(addExtraResponse.message);
            } else {
                toast.error(addExtraResponse.message);
                setIsRedirecting(true);
                getProductExtras();
                setTimeout(() => setIsRedirecting(false), 5000);
            }
        }
    }, [addExtraResponse]);

    useEffect(() => {
        if (deleteExtraResponse?.message) {
            if (!deleteExtraResponse.success) {
                toast.error(deleteExtraResponse.message);
            } else {
                toast.success(deleteExtraResponse.message);
                setIsRedirecting(true);
                getProductExtras();
                setTimeout(() => setIsRedirecting(false), 5000);
            }
        }
    }, [deleteExtraResponse]);

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await getStoreExtras();
            await getProductExtras();
        } finally {
            setRefreshing(false);
        }
    };

    const toggleSelectAll = () => {
        const allIds = (storeExtrasData?.data || []).map((item) => item.extra_id);
        const areAllSelected = selectedExtras.length === allIds.length;
        setSelectedExtras(areAllSelected ? [] : allIds);
    };

    const handleAddExtra = (product_id, extra_id) => {
        addExtraProduct({ product_id, extra_id });
    };

    const handleDeleteExtra = async (extra_id) => {
        try {
            const res = await delStoreExtra({ product_id, extra_id });
            const response = res.data || res;

            if (response?.success) {
                toast.success(response.message || 'Extra deleted');
                await getProductExtras();
                setSelectedExtras((prev) => prev.filter((id) => id !== extra_id));
            } else {
                toast.error(response?.message || 'Failed to delete extra');
            }
        } catch (error) {
            toast.error(response?.message || 'Failed to delete extra');
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedExtras.length === 0) return;

        const res = await delStoreExtra(
            { product_id, extra_ids: selectedExtras }, '/products/extras/delete-multiple'
        );

        if (res?.success) {
            toast.success('Extras deleted successfully');
            setSelectedExtras([]);
            setTimeout(() => router.back(), 5000);
        } else {
            toast.error('Extras were not removed');
        }
    };

    const extrasList = storeExtrasData?.data ?? [];
    const extrasCount = storeExtrasData?.count ?? 0;

    return (
        <>
            <SafeAreaView className="flex-1 bg-white items-center">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 w-full"
                >
                    <View className="flex-1 bg-white px-4">
                        <View className="flex-1 pb-10">
                            <View className="w-full p-2">
                                <View className="p-2 items-center">
                                    <View className="w-full flex-row items-center">
                                        <MaterialCommunityIcons name="french-fries" size={27} color="#2563EB" />
                                        <Text className="text-2xl ml-1" style={{ fontFamily: 'ubuntu-medium' }}>
                                            Add Product Extras
                                        </Text>
                                    </View>
                                </View>
                                <View className="h-[1px] mb-4 mx-2 mt-1 w-full bg-lavender" />
                                <FlatList
                                    key={refreshKey}
                                    data={extrasList}
                                    keyExtractor={(item) => `${item.extra_id}`}
                                    renderItem={({ item }) => (
                                        <StoreExtrasCard
                                            {...item}
                                            product_id={product_id}
                                            selectedExtras={selectedExtras}
                                            setSelectedExtras={setSelectedExtras}
                                            handleDeleteExtra={handleDeleteExtra}
                                            handleAddExtra={handleAddExtra}
                                            productExtras={productExtras}
                                        />
                                    )}
                                    ListHeaderComponent={() =>
                                        storeExtrasLoading ? null : extrasCount > 0 && (
                                            <>
                                                <View className="bg-rose-200 rounded-full mb-6 p-1 justify-center items-center">
                                                    <Text className="text-sm" style={{ fontFamily: 'roboto-medium' }}>
                                                        You have {extrasCount} extras in this store
                                                    </Text>
                                                </View>
                                                <View className="mb-8 w-full">
                                                    <BouncyCheckbox
                                                        isChecked={selectedExtras.length === extrasList.length}
                                                        onPress={toggleSelectAll}
                                                        text="Select all"
                                                        textStyle={{
                                                            textDecorationLine: 'none',
                                                            color: COLORS.slate,
                                                            marginLeft: -10,
                                                            fontSize: 14,
                                                            fontFamily: 'roboto-medium',
                                                        }}
                                                        size={20}
                                                        fillColor={
                                                            selectedExtras.length === extrasList.length
                                                                ? COLORS.slate
                                                                : COLORS.lavender
                                                        }
                                                        iconStyle={{ borderColor: COLORS.red, borderRadius: 2 }}
                                                        innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                                                    />
                                                </View>
                                            </>
                                        )
                                    }
                                    ListEmptyComponent={() => <EmptyState description="No extras found" />}
                                    showsVerticalScrollIndicator={false}
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />
                            </View>
                        </View>

                        {extrasCount > 0 && (
                            <CustomButton
                                title={`Delete Selected (${selectedExtras.length})`}
                                handlePress={handleDeleteSelected}
                                disabled={selectedExtras.length === 0}
                                otherStyles="bg-primary p-4 my-1"
                                textStyles="text-xl"
                            />
                        )}
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
            {AddingLoading && <LoadingIndicator loading_text="Adding extra..." />}
            {DeleteLoading && <LoadingIndicator loading_text="Removing extra..." />}
            {isRedirecting && !AddingLoading && <Redirecting redirect_text="Please wait..." />}
        </>
    );
};

export default Index;