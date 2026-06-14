import { FontAwesome } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { COLORS } from '../../../../constants/constants';
import useApi from '../../../../hook/useApi';
import { addRunner, clearRunner } from "../../../../redux/store/slices/CustomOrdersCartSlice";
import { USER_IMAGE_URI } from '../../../../RequestMethods';
import { makeCall } from '../../../../utils/getDistance';
import { toast } from '../../../../utils/toast';

const GetAvailableRunners = ({
    errorMessage,
    setErrorMessage,
    openAvailableRunnersModal,
    setOpenAvailableRunnersModal,
    user_phone_num
}) => {
    const [loadingRunnerId, setLoadingRunnerId] = useState(null);
    const [selectedRunnerId, setSelectedRunnerId] = useState(null);
    const {data, isLoading, error, get} = useApi(`/runner/available`);
    const dispatch = useDispatch();

    useEffect(() => {
        get();
    }, []);

    const handleGetRunnerDetails = async (item) => {
        try {
            setLoadingRunnerId(item.runner_id);

            const isAlreadySelected = selectedRunnerId === item.runner_id;

            if (isAlreadySelected) {
                setSelectedRunnerId(null);
                dispatch(clearRunner());
                toast.success("Runner unselected");
                return;
            }
            
            const payload = {
                runner_id: item?.runner_id,
                destination_phone_number: user_phone_num || 0,
                runner_phone_number: item?.phone_num,
                last_name: item?.last_name,
                first_name: item?.first_name,
                runner_gender: item?.gender,
                profile_image: item?.profile_image,
                order_type: 'Custom',
                runner_location: item?.location,
                runner_active: true
            };

            dispatch(addRunner(payload));
            setSelectedRunnerId(item.runner_id);

            toast.success("Runner selected");

            // ✅ CLOSE MODAL HERE (safe)
            setOpenAvailableRunnersModal(false);

        } catch (error) {
            toast.error("Failed to select runner");
            console.error("Error selecting runner:", error);
        } finally {
            setLoadingRunnerId(null);
        }
    };

    const fadeAnim = useRef(new Animated.Value(1)).current;
    return (
        <Modal
            transparent
            statusBarTranslucent
            visible={openAvailableRunnersModal}
            animationType="none"
            onRequestClose={() => setOpenAvailableRunnersModal(false)}
        >
            {/* Overlay */}
            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.overlay}
            >
                <Pressable
                    className="flex-1 inset-0 top-0 bottom-0 left-0 right-0 bg-transparentBlack"
                    onPress={() => setOpenAvailableRunnersModal(false)}
                />
            </MotiView>

            {/* Bottom Sheet */}
            <MotiView
                from={{ translateY: 400 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 400 }}
                transition={{ type: 'timing', duration: 400 }}
                style={styles.productsheet}
            >
                <View className='w-full relative flex-1 mb-14'>
                    <TouchableOpacity
                        className='w-full justify-center items-center my-1'
                        onPress={() => setOpenAvailableRunnersModal(false)}
                    >
                        <View className='h-1.5 rounded-full my-1 bg-[#ccc] w-[30%]'/>
                    </TouchableOpacity>  
                    <View className='flex-row justify-between items-center w-full mt-2'>
                        <View className='rounded py-1' style={{width: '75%'}}>
                            <Text
                                className='text-2xl text-black'
                                style={{fontFamily: 'ubuntu-medium'}}
                            >Available Runners</Text>
                        </View>
                        <TouchableOpacity className='p-3 justify-center items-center rounded-full bg-grey_bg'
                            style={{width: 35, height: 35}}
                            onPress={() => setOpenAvailableRunnersModal(false)}
                        >
                            <FontAwesome name="times" size={15} color='red'/>
                        </TouchableOpacity>
                    </View>

                    <View className='w-full bg-lavender mb-6 mt-2' style={{height: 1}}/>
                    <View className='bg-white w-full items-center'>
                        {isLoading && !data ? (
                            <View className='flex-1 mb-8 h-full w-full bg-white justify-center items-center'>
                                <View className='bg-grey_bg py-6 rounded border border-white elevation-sm justify-center items-center' style={{zIndex: 999, width: '90%'}}>
                                    <ActivityIndicator size={40} color={COLORS.primary}/>
                                    <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>
                                        Lookin for available runners
                                    </Text>
                                </View>
                            </View>
                        ) : data?.length === 0 ? (
                            <View className='flex-1 mb-8 h-full w-full bg-white justify-center items-center'>
                                <View className='bg-grey_bg py-6 rounded border border-white elevation-sm justify-center items-center' style={{zIndex: 999, width: '90%'}}>
                                    <Text className='text-lg text-slate' style={{fontFamily: 'roboto-medium'}}>
                                        No runner available
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <FlatList
                                data={data || []}
                                keyExtractor={(item) => item.runner_id}

                                renderItem={({item}) => (
                                    <View 
                                        className='border rounded elevation-sm p-2 mb-8'
                                        style={{
                                            backgroundColor: selectedRunnerId === item.runner_id ? "#ECFDF5" : "#FFFFFF",
                                            borderColor: selectedRunnerId === item.runner_id ? "#22C55E" : COLORS.grey_bg,
                                        }}
                                    >
                                        <View className='w-full flex-row justify-between items-center'>
                                            <View
                                                className='border-2 border-lavender justify-center items-center rounded-full relative'
                                                style={{height: 65, width: 65}}
                                            >
                                                {selectedRunnerId === item.runner_id && (
                                                    <View
                                                        style={{zIndex: 999, backgroundColor: '#22C55E', right: -4, top: 0, height: 25, width: 25}}
                                                        className='absolute border-2 border-white rounded-full justify-center items-center'>
                                                        <FontAwesome name='check' size={12} color='white'/>
                                                    </View>
                                                )}
                                                {item?.profile_image === null ?
                                                <FontAwesome name="user" size={30} color={COLORS.slate}/>
                                                    : <Image
                                                        source={{ uri: `${USER_IMAGE_URI}${item?.profile_image}` }}
                                                        style={{ height: '100%', width: '100%' }}
                                                        className='rounded-full border-2 border-white'
                                                    />
                                                }
                                            </View>

                                            <View
                                                className='flex-row justify-between items-center'
                                                style={{width: '77%'}}
                                            >
                                                <View
                                                    className=''
                                                    style={{width: '79%'}}
                                                >
                                                    <Text
                                                        className='text-base text-black'
                                                        style={{fontFamily: 'roboto-medium'}}
                                                        numberOfLines={1}
                                                    >
                                                        {item?.first_name} {item?.last_name}
                                                    </Text>
                                                    <Text
                                                        className='text-sm text-slate'
                                                        style={{fontFamily: 'roboto-medium'}}
                                                        numberOfLines={1}
                                                    >
                                                        {item?.phone_num}
                                                    </Text>
                                                </View>

                                                <TouchableOpacity
                                                    className='border border-lavender bg-grey_bg justify-center items-center rounded-full'
                                                    style={{width: 45, height: 45}}
                                                    onPress={() => makeCall(item?.phone_num)}
                                                >
                                                    <FontAwesome name="phone" size={20} color={COLORS.green2}/>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View className='flex-row justify-between items-center mt-2'>
                                            <View
                                                className='bg-grey_bg rounded-full justify-center items-center py-1'
                                                style={{width: '60%'}}
                                            >
                                                <Text
                                                    className='text-black text-base'
                                                    style={{fontFamily: 'roboto-medium'}}
                                                >
                                                    <Text className='text-primary'>{item?.errands_count < 1 ? `No ${''}` : item?.errands_count}</Text>
                                                    {item?.errands_count > 0 && <Text className='mx-6 text-lavender'>{' '}|{' '}</Text>}
                                                    Active Errands
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    handleGetRunnerDetails(item)
                                                    selectedRunnerId === null && setOpenAvailableRunnersModal(false);
                                                }}
                                                disabled={loadingRunnerId === item.runner_id}
                                                style={{
                                                    width: '30%',
                                                    backgroundColor:
                                                        selectedRunnerId === item.runner_id
                                                            ? COLORS.primary
                                                            : '#22C55E'
                                                }}
                                                className="rounded justify-center items-center py-2 elevation-sm border border-white"
                                            >
                                                {loadingRunnerId === item.runner_id ? (
                                                    <ActivityIndicator size="small" color="#fff" />
                                                ) : (
                                                    <Text style={{ fontFamily: 'roboto-medium' }} className="text-white text-base">
                                                        {selectedRunnerId === item.runner_id ? "Unselect" : "Select"}
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                                ListHeaderComponent={
                                    <View>
                                        <View className=''>
                                            <Text
                                                className='mb-4 text-lg text-slate'
                                                style={{fontFamily: 'roboto-medium'}}
                                            >There {data?.length === 1 ? 'is only' : 'are'} <Text className='text-primary'>{data?.length}</Text> {data?.length === 1 ? 'runner' : 'runners'} currently available</Text>
                                        </View>

                                        <View
                                            style={{
                                                backgroundColor: COLORS.grey_bg,
                                                borderColor: COLORS.lavender,
                                            }}
                                            className='border mb-4 px-3 py-2 rounded'
                                        >
                                            <Text
                                                className='mb-4 text-sm text-slate'
                                                style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}
                                            >
                                                Choose a runner that will run this will run your order. We recommend selecting a runner with less active errands as they are more likely to accept your order.
                                            </Text>
                                        </View>
                                    </View>
                                }
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>
                </View>
            </MotiView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    sheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },

    productsheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        maxHeight: '95%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12
    },

    button: {
        backgroundColor: '#6200ee',
        padding: 12,
        borderRadius: 10,
    },

    closeBtn: {
        marginTop: 15,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 10,
    },
});

export default GetAvailableRunners