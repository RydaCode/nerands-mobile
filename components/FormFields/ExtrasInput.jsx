import { Text, TextInput, View } from 'react-native'

const ExtrasInput = ({ title,
    value,
    handleChangeText,
    handleChangeExrasPrice,
    otherStyles,
    borderStyle,
    placeholder,
    desc,
    defaultValueTitle,
    defaultValuePrice,
    autoFocus,
    titleText,
    priceText,
    ...props }) => {
    return (
        <View className={`space-y-2 mb-5 ${otherStyles}`}>
            <Text className='text-gray-700 text-lg mb-1' style={{fontFamily: 'maven-bold'}}>{title}</Text>
            {!desc || desc === '' ? <></> :
                <Text className='text-sm mb-2 text-slate' style={{fontFamily: 'roboto-medium', textAlign: "justify"}}>{desc}</Text>
            }
            <View className='w-full flex-row justify-between items-center'>
                <View className='w-[78%]'>
                    <Text className='text-base mb-1' style={{fontFamily: 'maven-bold'}}>{titleText}</Text>
                    <View className={`w-full h-14 px-2 border ${borderStyle} rounded-md`}>
                        <TextInput
                            style={{fontFamily: 'maven-medium'}}
                            className='flex-1 font-semibold text-lg text-slate'
                            editable
                            placeholder={placeholder}
                            onChangeText={handleChangeText}
                            defaultValue={defaultValueTitle}
                            autoCorrect={false}
                            autoFocus={autoFocus}
                        />
                    </View>
                </View>
                <View className='w-[21%] justify-center items-center'>
                    <Text className='text-base mb-1' style={{fontFamily: 'maven-bold'}}>{priceText} (K)</Text>
                    <View className={`w-full h-14 px-2 border ${borderStyle} rounded-md`}>
                        <TextInput
                            style={{fontFamily: 'maven-bold'}}
                            className='flex-1 font-semibold text-lg text-slate'
                            editable
                            placeholder={placeholder}
                            onChangeText={handleChangeExrasPrice}
                            defaultValue={defaultValuePrice}
                            autoCorrect={false}
                            autoFocus={autoFocus}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ExtrasInput