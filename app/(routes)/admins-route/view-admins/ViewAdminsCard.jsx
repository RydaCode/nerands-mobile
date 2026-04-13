import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { COLORS } from "../../../../constants/constants";
import useApi from "../../../../hook/useApi";
import { toast } from "../../../../utils/toast";
import LoadingIndicator from "../../../LoadingIndicator";
import Redirecting from "../../../Redirecting";

const ViewAdminsCard = ({
    store_id,
    user_id,
    first_name,
    last_name,
    profile_image,
    phone_num,
    email_add,
    admin_status,
    params = { params }
}) => {
    const { user_id: loggedInUserId } = useSelector((state) => state.auth);

    const [selectedLevel, setSelectedLevel] = useState(admin_status);
    const [isRedirecting, setIsRedirecting] = useState(false);

    // For updating admin status
    const {
        data: updateData,
        isLoading: updateLoading,
        error: updateError,
        patch: updatePatch,
    } = useApi(`/stores/update-admin-status`);

    // For removing admin
    const {
        data: deleteData,
        isLoading: deleteLoading,
        error: deleteError,
        del: removeAdmin,
    } = useApi(`/stores/remove_admin`);

    const handleUpdateStoreLevel = () => {
        const payload = {
            store_id,
            user_id,
            admin_status: selectedLevel,
        };

        updatePatch(payload); // useApi for update
    };

    const handleRemoveAdmin = () => {
        const payload = {
            store_id,
            user_id,
        };

        removeAdmin(payload); // useApi for delete
    };

    useEffect(() => {
        if (updateData?.data?.Response) {
            const isSuccess = updateData.data.Response === 'Success';

            if (isSuccess) {
                return toast.success(updateData.data.Response)
            } else {
                return toast.error(updateData.data.Response)
            }
        }

        if (updateError) {
            const errorMsg = updateError?.response?.data?.Response || 'Failed to update admin level.';
            toast.error(errorMsg);
        }
    }, [updateData, updateError]);

    useEffect(() => {
        if (deleteData?.Response) {
            const isSuccess = deleteData.Response === 'Success';
            toast.success(updateData.data.Response);
            if (isSuccess) {
                setIsRedirecting(true);
                setTimeout(() => setIsRedirecting(false), 5000);
            }
        }

        if (deleteError) {
            toast.success(updateData.data.Response);
        }
    }, [deleteData, deleteError]);

    {(updateLoading || deleteLoading) && <LoadingIndicator loading_text="Processing..." />}

    return (
        <View className="w-full mt-2">
            <View className="w-full items-center justify-center">
                <View className="w-full items-center mt-4">
                    <TouchableOpacity className="w-full flex-row items-center justify-start">
                        <View style={{ height: 70, width: 70 }} className="rounded-full border-2 border-lavender justify-center items-center relative">
                            {!profile_image ? (
                                <FontAwesome5 size={30} name="user" />
                            ) : (
                                <Image className="h-full w-full rounded-full border-2 border-white" source={profile_image} />
                            )}
                            <View className={`absolute z-50 left-14 bottom-4 top-0 right-0 ${loggedInUserId === user_id ? 'bg-red' : 'bg-grey_bg'}  rounded-full items-center justify-center w-[30px] h-[30px] border-2 border-white`}>
                                <Text style={{ fontFamily: 'roboto-medium' }} className={`text-sm text-${loggedInUserId === user_id ? 'white' : 'red'}`}>{admin_status}</Text>
                            </View>
                        </View>
                        <View className="ml-4">
                            <Text className="text-base" style={{ fontFamily: 'roboto-bold' }}>{first_name} {last_name}</Text>
                            <Text className="text-sm text-slate" style={{ fontFamily: 'roboto-medium' }}>{phone_num}</Text>
                        </View>
                    </TouchableOpacity>
                    <View className="flex-row w-full justify-between items-center mt-4">
                        <View className="justify-between items-center">
                            <Text className="text-slate text-sm">Level</Text>
                            <View className="flex-row justify-center items-center p-1">
                                <TouchableOpacity
                                    disabled={selectedLevel <= 1}
                                    onPress={() => setSelectedLevel(prevCount => prevCount - 1)}
                                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5 }}
                                    className="bg-grey_bg px-3 py-2 w-[30px] rounded-full h-[30px] justify-center items-center"
                                >
                                    <FontAwesome name="minus" style={{ color: COLORS.black }} />
                                </TouchableOpacity>
                                <Text className="mx-2 text-lg text-slate">{selectedLevel}</Text>
                                <TouchableOpacity
                                    disabled={selectedLevel === 4}
                                    onPress={() => setSelectedLevel(prevCount => prevCount + 1)}
                                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5 }}
                                    className="bg-grey_bg px-3 py-2 w-[30px] rounded-full h-[30px] justify-center items-center"
                                >
                                    <FontAwesome name="plus" style={{ color: COLORS.black }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ width: '29%' }} className="mt-3">
                            <TouchableOpacity
                                onPress={handleUpdateStoreLevel}
                                disabled={selectedLevel === 1 || admin_status === 4}
                                style={{ opacity: loggedInUserId === user_id && admin_status === 4 ? 0.5 : 0.9, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5 }}
                                className="bg-green2 px-3 py-2 h-[40px] justify-center items-center w-full"
                            >
                                <Text className="text-white text-lg" style={{ fontFamily: 'maven-medium' }}>Update</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '29%' }} className="mt-3">
                            <TouchableOpacity
                                disabled={loggedInUserId === user_id ? true : false}
                                onPress={handleRemoveAdmin}
                                style={{ opacity: loggedInUserId === user_id ? 0.5 : 0.9, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5 }}
                                className="bg-red px-3 py-2 h-[40px] justify-center items-center w-full"
                            >
                                <Text className="text-white text-lg" style={{ fontFamily: 'maven-medium' }}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View className="h-[1px] w-full bg-grey_bg rounded-full my-2" />
            </View>
            {updateLoading || deleteLoading ? <LoadingIndicator loading_text="Processing..." /> : null}
            {isRedirecting && <Redirecting />}
            <Toast />
        </View>
    );
};

export default ViewAdminsCard;