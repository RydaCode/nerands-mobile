import { Text, TextInput, View } from 'react-native';

const DescriptionInput = ({ title, value, handleChangeText, otherStyles, borderStyle, textStyles, placeholder, desc, lines, defaultValue, ...props }) => {
    return (
        <View className={`space-y-2 mb-5 ${otherStyles}`}>
            <Text className='text-black text-base mb-1' style={{fontFamily: 'roboto-bold'}}>{title}</Text>
            <View>
                {!desc || desc === '' ? <></> :
                    <Text className='text-sm mb-1 text-slate' style={{fontFamily: 'roboto-medium', textAlign: "justify"}}>{desc}</Text>
                }
            </View>
            <View className={`w-full h-28 px-2 ${borderStyle} border border-lavender rounded-md`}>
                <TextInput
                    style={{fontFamily: 'roboto-medium', textAlignVertical: 'top', height: 100}}
                    className='flex-1 font-semibold text-base text-slate'
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    onChangeText={handleChangeText}
                    multiline
                    editable
                    numberOfLines={lines}
                />
            </View>
        </View>
    )
}

export default DescriptionInput