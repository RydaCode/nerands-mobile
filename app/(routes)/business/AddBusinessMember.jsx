import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormInputs from '../../../components/FormFields/FormInputs'
import Headers from '../../../components/Headers'
import { COLORS } from '../../../constants/constants'
import useApi from '../../../hook/useApi'
import { toast } from '../../../utils/toast'
import AuthLayout from '../../AuthLayout'
import AddUserModal from './AddUserModal'

const AddBusinessMember = () => {
    const params = useLocalSearchParams();
    const [errors, setErrors] = useState({});
    const [openAddMember, setOpenAddMember] = useState(false);
    const {data, isLoading, error, get} = useApi();

    const [formData, setFormData] = useState({
        search_id: ''
    });

    const handleChangeText = useCallback((key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: value,
        }));

        setErrors(prev => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
        });
    }, []);

    const searchUser = async () => {
        let newErrors = {};
        let searchValue = formData.search_id?.trim();

        if (!searchValue) {
            toast.error('Please enter email / phone number');
            newErrors.search_id = 'Please enter email / phone number';
            setErrors(newErrors);
            return;
        }

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchValue);
        const isPhone = /^[0-9+]+$/.test(searchValue);

        if (!isEmail && !isPhone) {
            toast.error('Invalid email or phone number');
            newErrors.search_id = 'Invalid format';
            setErrors(newErrors);
            return;
        }

        if (!isEmail) {
            searchValue = searchValue.replace(/\s+/g, '');

            if (searchValue.startsWith('0')) {
                searchValue = `+260${searchValue.slice(1)}`;
            } 
            else if (searchValue.startsWith('260')) {
                searchValue = `+${searchValue}`;
            }
            else if (searchValue.startsWith('00')) {
                searchValue = `+${searchValue.slice(2)}`;
            }
        }

        try {
            const res = await get(
                `/users/search/${encodeURIComponent(searchValue)}`
            );

            const result = res?.data;

            if (!result?.success) {
                toast.error(result?.message || 'User not found');
                newErrors.search_id = result?.message || 'User not found';
                setErrors(newErrors);
                return;
            }

            toast.success('User found');
            setOpenAddMember(true);

        } catch (err) {
            console.error(err);
            toast.error('Network error');
            newErrors.search_id = 'Network error';
            setErrors(newErrors);
        }
    };
    
    return (
        <AuthLayout>
            <SafeAreaView className='flex-1 px-4 bg-white justify-between'>
                <Headers header_name='Business Hub' fontFamily='outfit-medium' textStyles='text-2xl' icon={<Ionicons name='business-sharp' size={15} color={COLORS.slate}/>}/>
                    <View className='flex-1 justify-center items-center relative'>
                        <FormInputs
                            title="Email / Phone Number"
                            handleChangeText={(value) =>
                                handleChangeText("search_id", value)
                            }
                            borderStyle={`border ${errors.search_id ? "border-red" : "border-[#E2E8F0]"}`}
                            autoFocus={true}
                            error={errors.search_id}
                        />

                        <TouchableOpacity
                            className='bg-red py-3 rounded-xl justify-center items-center w-full mt-4'
                            onPress={() => searchUser()}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size={27} color={COLORS.white}/>
                            ) : (
                                <Text
                                    style={{fontFamily: 'outfit-medium'}}
                                    className='text-white text-2xl'
                                >Search</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <AddUserModal
                        business_id={params.business_id}
                        user={data?.data}
                        openAddMember={openAddMember}
                        setOpenAddMember={setOpenAddMember}
                        user_id={params.user_id}
                    />
            </SafeAreaView>
        </AuthLayout>
    )
}

export default AddBusinessMember