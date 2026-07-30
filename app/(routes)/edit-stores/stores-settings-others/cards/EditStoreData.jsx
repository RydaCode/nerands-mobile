import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../../constants/constants';

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
        { label: 'Store Description', key: 'store_description', numberOfLines: 5 },
    ];

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <View style={{ flex: 1 }}>
                
                {/* HEADER (fixed) */}
                <View
                    style={{
                        alignItems: 'center'
                    }}
                >
                    <View className="w-full justify-between flex-row items-center">
                        <View className=" flex-row items-center">
                            <MaterialIcons name="edit" size={22} />
                            <Text
                                className="text-xl ml-1"
                                style={{ fontFamily: 'roboto-medium' }}
                            >
                                Edit Store Details
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{width: 30, height: 30}}
                            className='bg-grey_bg justify-center items-center rounded-full'
                            onPress={() => setEditStoreListModalVisible(false)}
                        >
                            <FontAwesome name='times' color={'red'} size={15} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="h-[1px] mb-4 mt-1 w-full bg-lavender" />

                {/* SCROLL AREA */}
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: 50,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {fieldsToRender.map(({ label, key, numberOfLines = 0 }) => (
                        <TouchableOpacity
                            key={key}
                            onPress={() =>
                                router.push({
                                    pathname:
                                        '../edit-stores/edit-stores-others/UpdateStoreDataOneByOne/',
                                    params: {
                                        field_key: key,
                                        field_value: edit_data[key] || '',
                                        store_id: edit_data.store_id,
                                        business_id: edit_data.business_id,
                                    },
                                })
                            }
                            style={{ marginBottom: 16 }}
                        >
                            <Text
                                style={{ fontFamily: 'roboto-bold' }}
                                className="text-sm"
                            >
                                {label}
                            </Text>

                            <View className="flex-row">
                                <Text
                                    numberOfLines={numberOfLines}
                                    className="mr-2 text-sm text-slate"
                                >
                                    {edit_data[key] ?? '--'}
                                </Text>
                                <MaterialIcons name="edit" size={16} color={COLORS.green2} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

export default EditStoreData;