import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../constants/constants";
import useApi from "../../../hook/useApi";
import { USER_IMAGE_URI } from "../../../RequestMethods";
import { makeCall } from '../../../utils/getDistance';
import { toast } from "../../../utils/toast";

const GetAvailableRunners = ({
    closeModal,
    setAvailableRunners,
    setRunnerDetails,
    user_phone_num,
    clearRunner
}) => {
    const [loadingRunnerId, setLoadingRunnerId] = useState(null);
    const [selectedRunnerId, setSelectedRunnerId] = useState(null);
    const {data, isLoading, error, get} = useApi(`/runner/available`);

    useEffect(() => {
        get();
    }, []);

    const handleGetRunnerDetails = async (item) => {
        try {
            setLoadingRunnerId(item.runner_id);

            const isAlreadySelected = selectedRunnerId === item.runner_id;

            if (isAlreadySelected) {
                setSelectedRunnerId(null);
                clearRunner();
                toast.success("Runner unselected");
                return;
            }

            const payload = {
                runner_id: item?.runner_id,
                runner_user_id: item?.user_id,
                destination_phone_number: user_phone_num,
                last_name: item?.last_name,
                first_name: item?.first_name,
                profile_image: item?.profile_image,
                order_type: 'General',
                runner_location: item?.location,
                runner_active: true
            };

            setRunnerDetails(payload);
            setSelectedRunnerId(item.runner_id);

            toast.success("Runner selected");

            // ✅ CLOSE MODAL HERE (safe)
            closeModal();

        } catch (error) {
            toast.error("Failed to select runner");
        } finally {
            setLoadingRunnerId(null);
        }
    };

    return (
        <View className='absolute flex-1 h-full w-full bg-white justify-center items-center' style={{zIndex: 9999}}>
            <View className='
                bg-white w-full h-full rounded border border-lavender elevation-sm items-center'
                style={{zIndex: 999}}
            >
                <View
                    style={{borderTopRightRadius: 4, borderTopLeftRadius: 4}}
                    className='bg-primary mb-4 w-full py-1 justify-center items-center'>
                    <Text
                        className='text-white text-lg'
                        style={{fontFamily: 'roboto-medium'}}
                    >Available Runners</Text>
                </View>
                {isLoading && !data ? (
                    <View className='absolute flex-1 h-full w-full bg-white justify-center items-center'>
                        <View className='bg-grey_bg py-6 rounded border border-white elevation-sm justify-center items-center' style={{zIndex: 999, width: '90%'}}>
                            <ActivityIndicator size={40} color={COLORS.primary}/>
                            <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>
                                Lookin for available runners
                            </Text>
                        </View>
                    </View>
                ) : data?.length === 0 ? (
                    <View className='absolute flex-1 h-full w-full bg-white justify-center items-center'>
                        <View className='bg-grey_bg py-6 rounded border border-white elevation-sm justify-center items-center' style={{zIndex: 999, width: '90%'}}>
                            <Text className='text-lg text-slate' style={{fontFamily: 'roboto-medium'}}>
                                No runners available
                            </Text>
                        </View>
                    </View>
                ) : (
                    <FlatList
                        data={data || []}
                        keyExtractor={(item) => item.runner_id}

                        renderItem={({item}) => (
                            <View className='border m-2 border-grey_bg rounded elevation-sm bg-white p-2 mb-8'>
                                <View className='w-full flex-row justify-between items-center'>
                                    <View
                                        className='border-2 border-lavender justify-center items-center rounded-full'
                                        style={{height: 65, width: 65}}
                                    >
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
                                            selectedRunnerId === null && closeModal();
                                        }}
                                        disabled={loadingRunnerId === item.runner_id}
                                        style={{
                                            width: '30%',
                                            backgroundColor:
                                                selectedRunnerId === item.runner_id
                                                    ? COLORS.primary
                                                    : COLORS.green2
                                        }}
                                        className="rounded justify-center items-center py-2 elevation-sm border border-white"
                                    >
                                        {loadingRunnerId === item.runner_id ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <Text style={{ fontFamily: 'roboto-medium' }} className="text-white text-base">
                                                {selectedRunnerId === item.runner_id ? "Activated" : "Activate"}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        ListHeaderComponent={() => (
                            <>
                                <View className='flex-row mx-2 border-end items-center'>
                                    <TouchableOpacity
                                        className='flex-row w-full justify-end items-center'
                                        onPress={closeModal}
                                    >
                                        <Text style={{fontFamily: 'roboto-medium'}} className='mr-1 text-sm'>Close</Text>
                                        <View
                                            className='bg-red rounded-full justify-center items-center'
                                            style={{width: 28, height: 28}}
                                        >
                                            <FontAwesome name="times" color={COLORS.white} size={15}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View className='mx-2 my-4 bg-lavender' style={{height: 0.5}}/>
                                <View className='mx-2'>
                                    <Text
                                        className='mb-4 text-base text-slate'
                                        style={{fontFamily: 'roboto-medium'}}
                                    >There {data?.length === 1 ? 'is only' : 'are'} <Text className='text-primary'>{data?.length}</Text> {data?.length === 1 ? 'runner' : 'runners'} currently available</Text>
                                </View>
                            </>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                {!isLoading && (
                    <TouchableOpacity
                        className='bg-red w-full py-2 rounded elevation-sm border border-white justify-center items-center'
                        onPress={closeModal}
                    >
                        <Text
                            className='text-lg text-white'
                            style={{fontFamily: 'roboto-medium'}}
                        >Close</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default GetAvailableRunners;