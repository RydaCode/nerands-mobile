import { Picker } from '@react-native-picker/picker';
import { Text, View } from 'react-native';

const PickerInput = ({ label, selectedValue, onValueChange, options }) => {
    return (
        <View className="my-5">
            <Text className="text-gray-700 text-lg mb-1" style={{ fontFamily: 'roboto-medium' }}>
                {label}
            </Text>
            <View className="rounded-md" style={{ borderWidth: 1, borderColor: 'lavender' }}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                    style={{ height: 50 }}
                >
                    <Picker.Item label={`Select ${label}`} value="" />
                    {options.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                    ))}
                </Picker>
            </View>
        </View>
    );
};

export default PickerInput;