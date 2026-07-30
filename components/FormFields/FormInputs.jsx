import { Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FormInputs = ({ title, value, handleChangeText, otherStyles, borderStyle, placeholder, desc, defaultValue, autoFocus, keyboardType, error, icon, textColor='slate', descFontFamily='roboto-medium', ...props }) => {
    return (
        <View className={`mb-3 ${otherStyles} w-full justify-center`}>
            <Text className='text-base mb-1' style={{fontFamily: 'roboto-medium'}}>{title}</Text>
            {!desc || desc === '' ? <></> :
                <Text className='text-sm mb-1 text-slate' style={{fontFamily: descFontFamily, textAlign: "justify"}}>{desc}</Text>
            }
            <View className={`w-full h-14 px-3 border-2 rounded-xl ${borderStyle} flex-row items-center`}>
                {/* Icon */}
                    {icon && (
                        <Icon
                        name={icon}
                        size={18}
                        color="#666"
                        style={{ marginRight: 8 }}
                        />
                    )}
                <TextInput
                    style={{fontFamily: 'roboto'}}
                    className={`flex-1 font-semibold text-lg text-${textColor}`}
                    editable
                    placeholder={placeholder}
                    onChangeText={handleChangeText}
                    defaultValue={defaultValue}
                    autoCorrect={false}
                    autoFocus={autoFocus}
                    keyboardType={keyboardType}
                />
            </View>
            {error && (
                <Text className='text-red text-sm my-2' style={{fontFamily: 'roboto'}}>
                    {error}
                </Text>
            )}
        </View>
    )
}

export default FormInputs