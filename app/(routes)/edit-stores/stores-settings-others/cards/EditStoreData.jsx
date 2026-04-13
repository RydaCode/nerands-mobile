import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const EditStoreData = ({ router, params, setEditStoreListModalVisible }) => {
    const edit_data = { ...params };

    const fieldsToRender = [
        { label: 'Store Name', key: 'store_name' },
        { label: 'Store Category', key: 'store_category' },
        { label: 'Store Email', key: 'store_email' },
        { label: 'Store Phone Number', key: 'store_phone_num' },
        { label: 'Store Province', key: 'store_province' },
        { label: 'Store City', key: 'city_town' },
        { label: 'Store Opening Time', key: 'open_time' },
        { label: 'Store Closing Time', key: 'closing_time' },
        { label: 'Store Country', key: 'store_country' },
        { label: 'Store Description', key: 'store_description', numberOfLines: 1 },
    ];

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <View
                style={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
                className="w-full bg-white p-2" animation="slideInUp" duration={500} easing="ease-in-out">
                <ScrollView className="w-full p-2">
                    <View className="p-2 justify-between items-center">
                    <View className="w-full flex-row items-center">
                        <MaterialIcons name="edit" size={22} />
                        <Text className="text-xl ml-1" style={{ fontFamily: 'roboto-medium' }}>
                            Edit Store Details
                        </Text>
                    </View>
                </View>

                <View className="h-[1px] mb-8 mt-1 w-full bg-lavender" />

                    <View className="w-full p-2">
                        {fieldsToRender.map(({ label, key, numberOfLines = 0 }) => (
                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                    pathname: '../edit-stores/edit-stores-others/UpdateStoreDataOneByOne/',
                                        params: {
                                            field_key: key,
                                            field_value: edit_data[key] || '',
                                            store_id: edit_data.store_id,
                                        },
                                    })
                                }
                                key={key}
                                className="mb-4"
                            >
                            <Text className="text-sm" style={{ fontFamily: 'roboto-bold' }}>
                                {label}
                            </Text>
                            <View className="flex-row">
                                <Text numberOfLines={numberOfLines} className="mr-2 text-sm text-slate">
                                {edit_data[key] ?? '--'}
                                </Text>
                                <MaterialIcons name="edit" size={16} />
                            </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

export default EditStoreData;