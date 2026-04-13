import { Text, TextInput, View } from 'react-native'

const FormInputs = ({ title, value, handleChangeText, otherStyles, borderStyle, placeholder, desc, defaultValue, autoFocus, keyboardType, error, ...props }) => {
    return (
        <View className={`space-y-2 mb-5 ${otherStyles} w-full justify-center`}>
            <Text className='text-base mb-1' style={{fontFamily: 'roboto-bold'}}>{title}</Text>
            {!desc || desc === '' ? <></> :
                <Text className='text-sm mb-1 text-slate' style={{fontFamily: 'roboto-medium', textAlign: "justify"}}>{desc}</Text>
            }
            <View className={`w-full h-14 px-2 border ${borderStyle} rounded-md`}>
                <TextInput
                    style={{fontFamily: 'roboto'}}
                    className='flex-1 font-semibold text-lg text-slate'
                    editable
                    placeholder={placeholder}
                    onChangeText={handleChangeText}
                    defaultValue={defaultValue}
                    autoCorrect={false}
                    autoFocus={autoFocus}
                    keyboardType={keyboardType}
                />
            </View>
            <Text className='text-red text-sm my-2' style={{alignSelf: 'center', fontFamily: 'roboto-medium'}}>{error}</Text>
        </View>
    )
}

export default FormInputs