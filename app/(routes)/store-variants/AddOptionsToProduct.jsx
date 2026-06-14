import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../components/Buttons/CustomButton';
import EmptyState from '../../../components/EmptyState';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';
import LoadingIndicator from '../../LoadingIndicator';

const AddOptionsToProduct = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const store_id = params.store_id;
    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [pressCard, setPressedCard] = useState(null);
    const [options, setOptions] = useState([]);
    const { data, isLoading, error, get } = useApi(`/variants/get-group/${store_id}?page=1&limit=10`);
    const {data: deleteGroup, isLoading: deleteLoading, error: deleteError, del} = useApi();
    const {data: deleteOption, isLoading: deleteOptionLoading, error: deleteOptionError, del: deleteOptions} = useApi();
    const {data: addoptions, isLoading: addOptionLoading, error: addOptionError, post: addOptions} = useApi(
        '/variants/group/product/options/add'
    );
    const {data: deleteMultiGroup, isLoading: deleteMultiLoading, error: deleteMultiError, del: delteMultiGroups} = useApi();
    
    useEffect(() => {
        if (store_id) {
            get();
        }
    }, [store_id]);

    const groupList = data?.data ?? [];
    const groupsCount = data?.pagination?.totalItems ?? 0;

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await get();  // re-fetch data
            toast.success('Refresh successful');
        } catch (err) {
            toast.info('Refresh failed:', err);
            console.log('Refresh failed:', err);
        } finally {
            setRefreshing(false);
        }
    };

    const toggleSelectAll = () => {
        const allIds = groupList.map(item => item.id);
        const areAllSelected = selectedGroups.length === allIds.length;
        setSelectedGroups(areAllSelected ? [] : allIds);
    };

    const handleDeleteSelected = async () => {
        if (selectedGroups.length === 0) {
            toast.error('Please select groups to delete');
            return;
        }

        try {
            const res = await delteMultiGroups(
                { group_ids: selectedGroups }, '/variants/delete/groups/multiple'
            );

            if (res?.success) {
                toast.success('Selected groups deleted successfully');
                setSelectedGroups([]);
                get();
            } else {
                toast.error(res?.message || 'Something went wrong.');
            }

        } catch (err) {
            toast.error(err?.message || 'Something went wrong.');
        }
    };

    const handleDeleteGroup = async (id) => {
        try {
            await del(null, `/variants/delete/group/${id}`);
            if (data?.success) {
                toast.success('Group deleted successfully');
                setSelectedGroups(prev => prev.filter(groupId => groupId !== id));
                get(); // refresh list
            } else {
                toast.error(data?.message || 'Something went wrong.');
            }
        } catch (error) {
            toast.error(error?.message || 'Something went wrong.');
        }
    };

    return (
        <>
            <SafeAreaView className="flex-1 bg-white relative">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 w-full "
                >
                    <View className=' px-4'>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className='bg-primary rounded-full mb-8 justify-center items-center'
                            style={{ width: 35, height: 35 }}
                        >
                            <FontAwesome name="angle-left" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    
                    <View className="flex-1 bg-white px-4">
                        <View className="flex-1 pb-10">
                            <View className="w-full p-2">
                                <View className="p-2 items-center">
                                    <View className="w-full flex-row items-center">
                                        <MaterialCommunityIcons name="tune" size={20} color="#2563EB" />
                                        <Text className="text-2xl ml-2"
                                            style={{ fontFamily: 'maven-medium' }}
                                        >Variant Groups</Text>
                                    </View>
                                </View>
                                <View className="h-[1px] mb-4 mx-2 mt-1 w-full bg-lavender" />
                                <FlatList
                                    data={groupList}
                                    keyExtractor={item => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <StoreGroupsCard
                                            {...item}
                                            router={router}
                                            params={params}

                                            selectedGroups={selectedGroups}
                                            setSelectedGroups={setSelectedGroups}
                                            handleDeleteGroup={handleDeleteGroup}
                                        />
                                    )}

                                    ListHeaderComponent={() => {
                                        if (isLoading || groupsCount === 0) return null;
                                        return (
                                            <>
                                                <View className="bg-rose-200 rounded mb-6 p-2">
                                                    <Text className='text-red' style={{fontFamily: 'maven-bold'}}>NOTE*</Text>
                                                    <Text
                                                        className="text-base"
                                                        style={{ fontFamily: 'roboto-medium', textAlign: 'justify' }}
                                                    >
                                                        You can add and delete groups and add group options from this screen.
                                                    </Text>
                                                </View>

                                                <View className="rounded-full mb-6 p-1 justify-center items-center">
                                                    <Text
                                                        className="text-base text-slate"
                                                        style={{ fontFamily: 'roboto-medium' }}
                                                    >
                                                        You have {groupsCount} group variants in this store
                                                    </Text>
                                                </View>

                                                <View className="mb-8" style={{ width: '100%' }}>
                                                    <BouncyCheckbox
                                                        isChecked={selectedGroups.length === groupList.length}
                                                        onPress={toggleSelectAll}
                                                        text='Select all'
                                                        textStyle={{
                                                            textDecorationLine: 'none',
                                                            color: COLORS.slate,
                                                            marginLeft: -10,
                                                            fontSize: 14,
                                                            fontFamily: 'roboto-medium'
                                                        }}
                                                        size={21}
                                                        fillColor={
                                                            selectedGroups.length === groupList.length
                                                                ? COLORS.primary
                                                                : COLORS.lavender
                                                        }
                                                        iconStyle={{
                                                            borderWidth: 1.5,
                                                            borderColor: COLORS.primary,
                                                            borderRadius: 2
                                                        }}
                                                        innerIconStyle={{ borderWidth: 1.5, borderRadius: 2 }}
                                                    />
                                                </View>
                                            </>
                                        );
                                    }}
                                    // description
                                    ListEmptyComponent={() => (
                                        <EmptyState description='No groups found'/>
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
                        </View>
                        {groupsCount > 0 && selectedGroups.length > 0 && (
                            <CustomButton
                                title={
                                    deleteMultiLoading
                                        ? 'Deleting...'
                                        : `Delete Selected (${selectedGroups.length})`
                                }
                                handlePress={handleDeleteSelected}
                                otherStyles="bg-primary p-4 my-1"
                                textStyles="text-xl"
                            />
                        )}
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
            {isLoading ? <LoadingIndicator loading_text="Fetching groups..." /> : null}
            {/* {isRedirecting && !isLoading ? <Redirecting redirect_text="Please wait..." /> : null} */}
        </>
    );
};

const StoreGroupsCard = ({
        name,
        id,
        store_id,
        is_required,
        multi_select,
        router,
        params,
        selectedGroups,
        setSelectedGroups,
        handleDeleteGroup,
    }) => {

    const isChecked = selectedGroups.includes(id);

    const toggleCheckbox = () => {
        setSelectedGroups(prev =>
        prev.includes(id)
            ? prev.filter(groupId  => groupId  !== id)
            : [...prev, id]
        );
    };

    return (
        <View className="">
            <View className="w-full">
                <View className="w-full flex-row justify-between items-center">
                    <View className="" style={{ width: '7%' }}>
                        <BouncyCheckbox
                            isChecked={isChecked}
                            disableBuiltInState
                            onPress={(checked) => toggleCheckbox(checked)}
                            size={21}
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
                            <Text className="text-lg" style={{ fontFamily: 'roboto-medium' }}>
                                {name}
                            </Text>
                        </View>
                        <TouchableOpacity
                            className="flex-row justify-center bg-green2 elevation-sm items-center border border-lavender rounded"
                            style={{ width: 30, height: 30 }}
                            onPress={() =>
                                router.push({
                                    pathname: './variant-actions/EditGroupVariant',
                                    params: {
                                        store_id,
                                        id,
                                        name,
                                        is_required,
                                        multi_select
                                    },
                                })
                            }
                        >
                            <FontAwesome name="edit" size={15} color={COLORS.white} />
                        </TouchableOpacity>
                        
                    </View>
                </View>
                <View className="flex-row w-full justify-between mt-2 items-center">
                    <TouchableOpacity
                        style={{width: '43%'}}
                        className="flex-row justify-center items-center py-2 rounded border elevation-sm border-lavender bg-grey_bg"
                        onPress={() => router.push({
                            pathname: './ProductOptions',
                            params: {
                                id,
                                name,
                                is_required,
                                store_id,
                                product_image: params.product_image,
                                product_images: params.product_images,
                                product_id: params.product_id,
                                product_name: params.product_name,
                            }
                        })}
                    >
                        <FontAwesome name="eye" size={16} color={COLORS.extra_blue} />
                        <Text className="text-base ml-1" style={{fontFamily: 'roboto-medium', color: COLORS.extra_blue}}>Options</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{width: '43%'}}
                        className="flex-row justify-center items-center py-2 border elevation-sm border-lavender bg-grey_bg rounded"
                        onPress={() =>
                            router.push({
                                pathname: './variant-actions/CreateGroupOptionVariants',
                                params: {
                                    store_id,
                                    id,
                                    name
                                },
                            })
                        }
                    >
                        <FontAwesome name="plus" size={13} color={COLORS.extra_blue} />
                        <Text className="text-base ml-1" style={{fontFamily: 'roboto-medium', color: COLORS.extra_blue}}>Add Options</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{width: 30}}
                        className="flex-row justify-center items-center border border-lavender bg-red py-3 rounded elevation-sm"
                        onPress={() => handleDeleteGroup(id)}
                    >
                        <FontAwesome5 name="trash" size={14} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>
            <View className="h-[1px] my-4 bg-lavender" />
        </View>
    );
};

export default AddOptionsToProduct;