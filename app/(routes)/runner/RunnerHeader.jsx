import { FontAwesome } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { USER_IMAGE_URI } from '../../../RequestMethods';

const RunnerHeader = ({ runner, setSettings }) => {
    return (
        <View className='w-full p-4 justify-center items-center'>
            <View style={{width: '97%',}} className="bg-white px-4 py-2 rounded-lg elevation-sm border border-lavender flex-row justify-between items-center">
                <View className="rounded-full border-2 border-lavender" style={{ height: 70, width: 70 }}>
                    <Image className="h-full w-full rounded-full" source={{ uri: `${USER_IMAGE_URI}${runner?.profile_image}` }} />
                </View>

                <View className="mx-2" style={{ width: '60%' }}>
                    <Text className="text-lg" style={{ fontFamily: 'roboto-bold' }}>
                        {runner?.first_name} {runner?.last_name}
                    </Text>
                    <Text className="text-base text-slate" style={{ fontFamily: 'roboto-medium' }}>
                        {runner?.phone_num}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => setSettings(true)}
                    className="border-2 border-lavender rounded-full justify-center items-center"
                    style={{ height: 47, width: 47 }}
                >
                    <View className="w-full h-full bg-grey_bg rounded-full border-2 border-white items-center justify-center">
                        <FontAwesome name="gear" size={22} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
};

export default RunnerHeader;