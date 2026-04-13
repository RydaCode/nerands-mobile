import { Text, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { COLORS } from '../../../constants/constants';

const ExtraCheckbox = ({ label, price, checked, onToggle }) => (
    <View className="w-full flex-row items-center justify-between mb-3">
        <View className="w-[80%]">
            <BouncyCheckbox
                isChecked={checked}
                onPress={onToggle}
                text={label}
                textStyle={{
                    fontFamily: 'roboto-medium',
                    textDecorationLine: "none",
                    color: checked ? COLORS.primary : COLORS.slate,
                    marginLeft: -10,
                    fontSize: 13
                }}
                size={20}
                fillColor={checked ? COLORS.primary : COLORS.primary}
                iconStyle={{ borderColor: checked ? COLORS.primary : COLORS.slate, borderRadius: 2.5, borderWidth: 1.3 }}
                innerIconStyle={{ borderRadius: 2.5, borderWidth: 1.3 }}
            />
        </View>
        <Text
            className="text-base"
            style={{
                fontFamily: 'roboto-medium',
                color: checked ? COLORS.primary : COLORS.slate
            }}
        >K{price}
        </Text>
    </View>
);

export default ExtraCheckbox;