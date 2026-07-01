import { FontAwesome } from '@expo/vector-icons'
import { MotiView } from 'moti'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import FormInputs from '../../../components/FormFields/FormInputs'
import { COLORS } from '../../../constants/constants'
import useApi from '../../../hook/useApi'
import { toast } from '../../../utils/toast'

const EditBusinessModal = ({
    openEditBusinessModal,
    setOpenEditBusinessModal,
    roles,
    user_id,
    business_id,
    business,
    reload
}) => {
    const [errors, setErrors] = useState({});
     const {data, isLoading, error, patch} = useApi(
        `/businesses/update`
    );
    const [formData, setFormData] = useState({
        user_id: user_id,
        business_id: business_id,
        id: business_id
    });

    const businessType = [
        { label: 'Sole trader', value: 'sole_trader' },
        { label: 'Limited Company', value: 'limited_company' }
    ];

    useEffect(() => {
        if (business) {
            setFormData(prev => ({
                ...prev,
                name: business.name || '',
                type: business.type || ''
            }));
        }
    }, [business]);

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

    const updateBusinessDetails = async () => {
        let newErrors = {};
        
        if (!formData.user_id) {
            newErrors.user_id = "User ID is required.";
        }

        if (!formData.id) {
            newErrors.id = "Business ID is required.";
        }
        
        if (!formData.name) {
            newErrors.name = "Business name is required.";
        }

        if (!formData.type) {
            newErrors.type = "Please select business type.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fix the highlighted fields");
            return;
        }

        try {
            const res = await patch(formData);
            if (res?.success) {
                toast.success(res?.message || "Business details updated");
                setOpenEditBusinessModal(false);
                reload();
                return;
            }
            else if (!res?.success) {
                toast.error(res?.message || "Business details was not updatad");
                return;
            }
            else if (error) {
                toast.error(error.message || "Business details was not updatad, try again later");
                return;
            }
        } catch (err) {
            toast.error(err.message || "Failed to update Business details");
            return;
        }
    }

    return (
        <Modal
            visible={openEditBusinessModal}
            transparent
            animationType="none"
            onRequestClose={() => setOpenEditBusinessModal(false)}
        >
            {/* Overlay */}
            <Pressable
                className="flex-1 bg-transparentBlack justify-end"
                onPress={() => setOpenEditBusinessModal(false)}
            >
                <MotiView
                    from={{ opacity: 0, translateY: 80 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: "timing", duration: 300 }}
                    style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 80, height: '90%'}}
                    className="bg-white px-4 pt-3 mb-0"
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center">
                        <Text
                            className="text-2xl"
                            style={{ fontFamily: "outfit-medium" }}
                        >
                            Edit Business Details
                        </Text>
                        <TouchableOpacity
                            className='bg-grey_bg rounded-full justify-center items-center'
                            style={{width: 30, height: 30}}
                            onPress={() => setOpenEditBusinessModal(false)}
                        >
                            <FontAwesome name='times' size={15} color={'red'}/>
                        </TouchableOpacity>
                    </View>

                    <View className='w-full bg-lavender my-3' style={{height: 1}} />
                    {/* Content */}
                    <ScrollView className='w-full'>
                        <FormInputs
                            title="Business Name"
                            handleChangeText={(value) =>
                                handleChangeText("name", value)
                            }
                            defaultValue={business?.name}
                            borderStyle={`border ${errors.name ? "border-red" : "border-[#E2E8F0]"}`}
                            autoFocus={true}
                            error={errors.name}
                        />

                        <View className='mt-6'>
                            <Text className="text-base mb-1" style={{ fontFamily: "roboto-bold" }}>Business Type</Text>
                            <Text
                                className="text-sm mb-1 text-slate"
                                style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}
                            >
                                Please select the business type.
                            </Text>
                            <Dropdown
                                data={businessType}
                                labelField="label"
                                valueField="value"
                                placeholder={business?.type}
                                value={formData.type}
                                onChange={(item) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        type: item.value
                                    }));
                                }}

                                style={{
                                    borderWidth: 2,
                                    borderColor: errors.type ? "red" : "#E2E8F0",
                                    borderRadius: 12,
                                    paddingHorizontal: 12,
                                    height: 50,
                                }}
                            />
                            {errors.type && (
                                <Text className='text-red text-sm my-2' style={{fontFamily: 'roboto'}}>
                                    {errors.type} *
                                </Text>
                            )}
                        </View>

                        <TouchableOpacity
                            className='bg-red py-3 rounded-2xl justify-center items-center mt-8'
                            onPress={() => updateBusinessDetails()}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size={27} color={COLORS.white}/>
                            ) : (
                                <Text
                                    style={{fontFamily: 'outfit-medium'}}
                                    className='text-white text-2xl'
                                >Update</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </MotiView>
            </Pressable>
        </Modal>
    )
}

export default EditBusinessModal