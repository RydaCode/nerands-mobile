import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { COLORS } from "../../../../constants/constants";
import useApi from "../../../../hook/useApi";
import { usePermissions } from "../../../../hook/usePermissions";
import { USER_IMAGE_URI } from "../../../../RequestMethods";
import { formatDate } from "../../../../utils/formatDateTime";
import { toast } from "../../../../utils/toast";

const ViewAdminsCard = ({
    store_id,
    user_id,
    first_name,
    last_name,
    profile_image,
    phone_num,
    email_add,
    updated_at,
    gender,
    role_name,
    role_description,
    role_id,
    reload,
    deletingUserId,
    setDeletingUserId,
    params
}) => {
    const { can } = usePermissions();
    const { user_id: loggedInUserId } = useSelector((state) => state.auth);

    // For updating admin status
    const {
        data: updateData,
        isLoading: updateLoading,
        error: updateError,
        patch: updatePatch,
    } = useApi(`/stores/update-admin-status`);

    // For removing admin
    const { data: deleteData, isLoading: deleteLoading, error: deleteError, del: removeAdmin } = useApi(
        `/stores/members/remove`
    );

    console.log("STORE", store_id)

    const handleRemoveAdmin = async () => {
        setDeletingUserId(user_id);

        const payload = {
            business_id: params.business_id,
            store_id,
            member_id: user_id,
        };

        try {
            const res = await removeAdmin(payload);

            if (!res?.success) {
                toast.error(res?.message || "Failed to remove member.");
                return;
            }

            toast.success(res?.message || "Member removed successfully.");
            reload();
        } catch (error) {
            toast.error(error?.message || "An error occurred, try again.");
        } finally {
            setDeletingUserId(null);
        }
    };

    return (
        <View className='w-full'>
            <View className='flex-row w-full justify-between items-center'>
                <View
                    className='bg-grey_bg relative rounded-full border-2 border-lavender justify-center items-center'
                    style={{width: 63, height: 63}}
                >
                    <View
                        style={{height: 25, width: 25, top: -3, right: -3, zIndex: 5}}
                        className='absolute bg-green1 border-2 border-white justify-center items-center rounded-full'
                    >
                        {gender === 'male' ? (
                            <Text className='text-sm text-white'
                                style={{fontFamily: 'roboto-medium'}}
                            >M</Text>
                        ) : (
                            <Text className='text-sm text-white'
                                style={{fontFamily: 'roboto-medium'}}
                            >F</Text>
                        )}
                        
                    </View>
                    {profile_image === null ?
                        <FontAwesome name="user" size={24} color={COLORS.slate} />
                        : <Image
                            source={{ uri: `${USER_IMAGE_URI}${profile_image}` }}
                            style={{ height: '100%', width: '100%' }}
                            className='rounded-full border-2 border-white'
                        />
                    }
                </View>
                <View
                    style={{width: '68%'}}
                    className=''
                >
                    <Text
                        numberOfLines={1}
                        className='text-base'
                        style={{fontFamily: 'roboto-medium'}}
                    >
                        {first_name} {last_name}
                    </Text>
                    <Text
                        className='text-sm text-slate'
                        style={{fontFamily: 'roboto'}}
                    >{role_name} | Added: {formatDate(updated_at)}</Text>
                </View>

                <TouchableOpacity
                    className='flex-row justify-center items-center rounded-full p-2 bg-grey_bg'
                    style={{width: 30, height: 30}}
                    onPress={() =>  {
                        if (!can('remove_store_member')) {
                            toast.error('You you no permissions to remove member');
                            return;
                        }
                        handleRemoveAdmin();
                    }}
                    disabled={deletingUserId === user_id}
                >
                    {deletingUserId === user_id ? (
                        <ActivityIndicator color={COLORS.primary} />
                    ) : (
                        <FontAwesome6
                            name="trash"
                            size={14}
                            color={COLORS.red}
                        />
                    )}
                </TouchableOpacity>
            </View>
            <View className='bg-grey_bg w-full my-6' style={{height: 1}}/>
        </View>
    );
};

export default ViewAdminsCard;