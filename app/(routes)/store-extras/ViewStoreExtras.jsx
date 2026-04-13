import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    FlatList, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import CustomButton from '../../../components/Buttons/CustomButton';
import EmptyState from '../../../components/EmptyState';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';
import LoadingIndicator from '../../LoadingIndicator';
import Redirecting from '../../Redirecting';

const ViewStoreExtras = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const store_id = params.store_id;
    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { data, isLoading, error, get, del } = useApi(`/stores/extras/${store_id}`);

    useEffect(() => {
        if (store_id) {
            get();
        }
    }, [store_id]);

    const extrasList = data?.data ?? [];
    const extrasCount = data?.count ?? 0;

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await get();  // re-fetch data
        } catch (err) {
            console.log('Refresh failed:', err);
        } finally {
            setRefreshing(false);
        }
    };

    const toggleSelectAll = () => {
        const allIds = extrasList.map(item => item.extra_id);
        const areAllSelected = selectedExtras.length === allIds.length;
        setSelectedExtras(areAllSelected ? [] : allIds);
    };

    const handleDeleteSelected = async () => {
        if (selectedExtras.length === 0) return;
        try {
            const res = await del({ extra_ids: selectedExtras }, '/stores/extras/delete-multiple');
            if (res?.success) {
                toast.success('Selected extras deleted successfully');
                setSelectedExtras([]);
                get();
            } else {
                toast.error(res?.message || 'Something went wrong.');
            }
        } catch (err) {
            toast.error(err?.message || 'Something went wrong.');
        }
    };

    const handleDeleteExtra = async (extra_id) => {
        try {
            const response = await del(null, `/stores/extras/delete/${extra_id}`);
            if (response?.success) {
                toast.success('Extra deleted successfully');
                setSelectedExtras(prev => prev.filter(id => id !== extra_id));
                get(); // refresh list
            } else {
                toast.error(response?.message || 'Something went wrong.');
            }
        } catch (error) {
            toast.error(error?.message || 'Something went wrong.');
        }
    };

    return (
        <>
            <SafeAreaView className="flex-1 bg-white px-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className='bg-primary rounded-full mb-8 justify-center items-center'
                    style={{ width: 35, height: 35 }}
                >
                    <FontAwesome name="angle-left" size={24} color="white" />
                </TouchableOpacity>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 w-full"
                >
                    <View className="flex-1 bg-white">
                        <View className="flex-1 pb-10">
                            <View className="w-full">
                                <View className="items-center">
                                    <View className="w-full flex-row items-center">
                                        <MaterialCommunityIcons name="french-fries" size={27} color="#2563EB" />
                                        <Text className="text-2xl ml-1"
                                            style={{ fontFamily: 'maven-medium' }}
                                        > View Extras</Text>
                                    </View>
                                </View>
                                <View className="h-[1px] mb-4 mx-2 mt-1 w-full bg-lavender" />
                                <FlatList
                                    data={extrasList}
                                    keyExtractor={item =>
                                        item.extra_id?.toString() ?? Math.random().toString()
                                    }
                                    renderItem={({ item }) => (
                                        <StoreExtrasCard
                                        {...item}
                                            router={router}
                                            selectedExtras={selectedExtras}
                                            setSelectedExtras={setSelectedExtras}
                                            handleDeleteExtra={handleDeleteExtra}
                                        />
                                    )}
                                    ListHeaderComponent={() =>
                                        isLoading ? (
                                            <></>
                                        ) : (
                                            extrasCount === 0 ? <></> :
                                            <>
                                                <View className="bg-rose-200 rounded-full mb-6 p-1 justify-center items-center">
                                                    <Text
                                                        className="text-sm"
                                                        style={{ fontFamily: 'roboto-medium' }}
                                                    >
                                                        You have {extrasCount} extras in this store
                                                    </Text>
                                                </View>
                                                <View className="mb-8" style={{ width: '100%' }}>
                                                    <BouncyCheckbox
                                                        isChecked={selectedExtras.length === extrasList.length ? true : false}
                                                        onPress={toggleSelectAll}
                                                        text='Select all'
                                                        textStyle={{
                                                            textDecorationLine: 'none',
                                                            color: COLORS.slate,
                                                            marginLeft: -10,
                                                            fontSize: 14,
                                                            fontFamily: 'roboto-medium'
                                                        }}
                                                        size={20}
                                                        fillColor={selectedExtras.length === extrasList.length ? COLORS.primary : COLORS.lavender}
                                                        iconStyle={{ borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 2 }}
                                                        innerIconStyle={{ borderWidth: 1.5, borderRadius: 2 }}
                                                    />
                                                </View>
                                            </>
                                        )
                                    }
                                    // description
                                    ListEmptyComponent={() => (
                                        <EmptyState description='No extras found'/>
                                    )}
                                    showsVerticalScrollIndicator={false}
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}  
                                />
                                <View className="w-full">
                                    <Text className="text-sm text-red" style={{ fontFamily: 'roboto-medium' }}>
                                        {errorMessage}
                                    </Text>
                                </View>
                            </View>
                            <Toast />
                        </View>
                        {extrasCount === 0 ? <></> :
                            <CustomButton
                                title={`Delete Selected (${selectedExtras.length})`}
                                handlePress={handleDeleteSelected}
                                disabled={selectedExtras.length === 0}
                                otherStyles={`bg-primary p-4 my-1`}
                                textStyles="text-xl"
                            />
                        }
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
            {isLoading ? <LoadingIndicator loading_text="Fetching extras..." /> : null}
            {isRedirecting && !isLoading ? <Redirecting redirect_text="Please wait..." /> : null}
        </>
    );
};

const StoreExtrasCard = ({
        extra_name,
        extra_price,
        extra_id,
        store_id,
        router,
        selectedExtras,
        setSelectedExtras,
        handleDeleteExtra
    }) => {
    const isChecked = selectedExtras.includes(extra_id);

    const toggleCheckbox = () => {
        setSelectedExtras(prev =>
        prev.includes(extra_id)
            ? prev.filter(id => id !== extra_id)
            : [...prev, extra_id]
        );
    };

    return (
        <View className="mb-4">
            <View className="w-full mb-1">
                <View className="w-full flex-row justify-between items-center">
                    <View className="" style={{ width: '7%' }}>
                        <BouncyCheckbox
                            isChecked={isChecked}
                            disableBuiltInState
                            onPress={(checked) => toggleCheckbox(checked)}
                            size={20}
                            fillColor={isChecked ? COLORS.primary : COLORS.white}
                            iconStyle={{ borderWidth: 1.5, borderColor: COLORS.red, borderRadius: 2 }}
                            innerIconStyle={{ borderWidth: 1.5, borderRadius: 2 }}
                        />
                    </View>
                    <View
                        className="flex-row justify-between items-center"
                        style={{ width: '90%' }}
                    >
                        <View className="" style={{ width: '78%' }}>
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
                <View className="flex-row w-full justify-end items-center">
                <TouchableOpacity
                    className="flex-row justify-center items-center"
                    onPress={() =>
                        router.push({
                            pathname: '../../store-extras/EditStoreExtras',
                            params: {
                                store_id,
                                extra_id,
                                extra_name,
                                extra_price,
                            },
                        })
                    }
                >
                    <FontAwesome name="edit" size={18} color={COLORS.green2} />
                    <Text className="text-sm ml-1 text-green2">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDeleteExtra(extra_id)}
                    className="flex-row ml-8 justify-center items-center">
                    <FontAwesome name="trash" size={18} color={COLORS.red} />
                    <Text className="text-sm text-red ml-1">Delete</Text>
                </TouchableOpacity>
                </View>
            </View>
            <View className="h-[1px] mb-4 mt-1 bg-lavender" />
        </View>
    );
};

export default ViewStoreExtras;