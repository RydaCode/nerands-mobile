import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
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
import Redirecting from '../../Redirecting';

const ViewGroupVariants = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const store_id = params.store_id;
    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const [pressCard, setPressedCard] = useState(null);
    const [viewModal, setViewModal] = useState(false);
    const [options, setOptions] = useState([]);
    const { data, isLoading, error, get } = useApi(`/variants/get-group/${store_id}?page=1&limit=10`);
    const {data: deleteGroup, isLoading: deleteLoading, error: deleteError, del} = useApi();
    const {data: deleteOption, isLoading: deleteOptionLoading, error: deleteOptionError, del: deleteOptions} = useApi();
    const {data: deleteMultiGroup, isLoading: deleteMultiLoading, error: deleteMultiError, del: delteMultiGroups} = useApi();
    const {data: getOptions, isLoading: loadingOptions, error: errorOptions, get: fetchOptions} = useApi();
    const [deletingOptionId, setDeletingOptionId] = useState(null);

    useEffect(() => {
        if (store_id) {
            get();
        }
    }, [store_id]);

    useEffect(() => {
        if (pressCard) {
            setOptions([]); // clear old options
            fetchOptions(`/variants/group/options/${pressCard.id}?page=1&limit=10`);
        }
    }, [pressCard]);

    useEffect(() => {
        if (getOptions?.data) {
            setOptions(getOptions.data);
        }
    }, [getOptions?.data]);

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

    const handleDeleteOption = async (id) => {
        try {
            setDeletingOptionId(id); // 👈 track which item is deleting

            const res = await deleteOptions(null, `/variants/delete/options/${id}`);

            if (res?.success) {
                toast.success('Option deleted successfully');

                // update UI instantly (if using local state)
                setOptions(prev => prev.filter(option => option.id !== id));
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
        <>
            <SafeAreaView className="flex-1 bg-white items-center relative">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 w-full "
                >
                   {viewModal && pressCard && (
                        <>
                            {/* OVERLAY */}
                            <Pressable
                                onPress={() => setViewModal(false)}
                                className="absolute top-0 left-0 right-0 bottom-0 bg-black/40"
                                style={{ zIndex: 40 }}
                            />

                            {/* MODAL */}
                            <View
                                className="absolute justify-end items-center" style={{ width: '100%', height: '100%' }}
                            >
                                <View
                                    className='bg-grey_bg elevation-md rounded-sm py-4 px-2 border border-lavender'
                                    style={{ width: '92%', zIndex: 50, bottom: 10, maxHeight: '75%' }}
                                >
                                    {loadingOptions ? 
                                        (
                                            <View className='justify-center items-center my-5'>
                                                <ActivityIndicator size={30} color={COLORS.primary}/>
                                                <Text className='text-base mt-1 text-primary' style={{fontFamily: 'roboto-medium'}}>
                                                    Loading options...
                                                </Text>
                                            </View>
                                        ) : (
                                            <FlatList
                                                data={options || []}
                                                keyExtractor={(item) => item.id.toString()}
                                                renderItem={({item}) => (
                                                    <View className='w-full'>
                                                        <View className='flex-row w-full justify-between items-center'>
                                                            <View className='' style={{width: '90%'}}>
                                                                <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>{item.name}</Text>
                                                                <Text className='text-sm text-green1' style={{fontFamily: 'roboto-medium'}}>K{item.price}</Text>
                                                            </View>

                                                            {deletingOptionId === item.id ? (
                                                                <ActivityIndicator size={20} color={COLORS.primary} />
                                                            ) : (
                                                                <TouchableOpacity
                                                                    className='items-center justify-end flex-row'
                                                                    style={{ marginLeft: 10 }}
                                                                    onPress={() => handleDeleteOption(item.id)}
                                                                >
                                                                    <FontAwesome5 name='trash' color='red' size={21} />
                                                                </TouchableOpacity>
                                                            )}
                                                        </View>
                                                        <View className='bg-lavender my-3' style={{height: 1}}/>
                                                    </View>      
                                                )}
                                                ListHeaderComponent={
                                                    <View className='mb-6'>
                                                        <Text className="text-2xl font-bold mb-1">{pressCard?.name}</Text>
                                                        <View className='mb-4'>
                                                            <Text className='text-base text-slate ' style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}>
                                                                There are {getOptions?.data?.length === 0 ? 'no' : getOptions?.data?.length} options under <Text className='text-green1'>[{pressCard?.name}]</Text> group.
                                                            </Text>
                                                        </View>
                                                    </View>
                                                }
                                                ListFooterComponent={
                                                    <TouchableOpacity
                                                        className="justify-center items-center py-3 elevation-md rounded-sm bg-green1"
                                                        onPress={() => setViewModal(false)}
                                                    >
                                                        <Text className='text-base text-white' style={{fontFamily: 'roboto-medium'}}>Close</Text>
                                                    </TouchableOpacity>
                                                }
                                            />
                                        )
                                    }
                                </View>
                            </View>
                        </>
                    )}
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

                                            onView={(group) => {
                                                setPressedCard(group);
                                                setViewModal(true);
                                            }}
                                            pressCard={pressCard}
                                            setPressedCard={setPressedCard}

                                            selectedGroups={selectedGroups}
                                            setSelectedGroups={setSelectedGroups}
                                            handleDeleteGroup={handleDeleteGroup}
                                            viewModal={viewModal}
                                            setViewModal={setViewModal}
                                        />
                                    )}

                                    ListHeaderComponent={() => {
                                        if (isLoading || groupsCount === 0) return null;
                                        return (
                                            <>
                                                <View className="bg-rose-200 rounded-full mb-6 p-1 justify-center items-center">
                                                    <Text
                                                        className="text-sm"
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
            {isRedirecting && !isLoading ? <Redirecting redirect_text="Please wait..." /> : null}
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
        onView,
        selectedGroups,
        setSelectedGroups,
        handleDeleteGroup,
        pressCard,
        setPressedCard,
        viewModal,
        setViewModal
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
                        onPress={() =>
                            onView({
                                id,
                                name,
                                is_required,
                                store_id
                            })
                        }
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

export default ViewGroupVariants;