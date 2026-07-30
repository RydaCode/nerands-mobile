import { FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';
import { USER_IMAGE_URI } from '../../../RequestMethods';
import { COLORS } from '../../../constants/constants';

const RunnerHeaderss = ({ runner, setSettings }) => {

    return (
        <View style={{width: '100%',}} className="flex-row my-6 justify-between items-center bg-white px-2 py-2 rounded-lg elevation-sm border border-lavender">
            <View className="rounded-full justify-center items-center border-2 border-lavender" style={{ height: 70, width: 70 }}>
                {!runner?.profile_image ? <FontAwesome name='user' size={40} color={COLORS.slate}/> :
                    <Image className="h-full w-full rounded-full" source={{ uri: `${USER_IMAGE_URI}${runner?.profile_image}` }} />
                }
            </View>
            <View className='' style={{width: '67%'}}>
                <Text className='text-lg' numberOfLines={1} style={{fontFamily: 'roboto-medium'}}>{runner?.first_name} {runner?.last_name}</Text>
                <Text className='text-sm text-slate' numberOfLines={1}>{runner?.email_add}</Text>
            </View>
            <View>
                {runner?.status && (
                    <SimpleLineIcons name="badge" size={20} color={'#93c5fd'} />
                )}
            </View>
        </View>
    )
}

export default RunnerHeaderss