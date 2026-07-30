import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Headers from '../../../components/Headers'
import { COLORS } from '../../../constants/constants'
import useApi from '../../../hook/useApi'
import { toast } from '../../../utils/toast'

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

const Index = () => {
    const params = useLocalSearchParams();
    const router = useRouter();

    const {
        data,
        isLoading,
        error,
        get: getStoreHours,
    } = useApi()

    const {
        data: updateData,
        isLoading: updateLoading,
        error: updateError,
        patch: updateStoreHours
    } = useApi('/stores/store-hours/update')

    const [is24Hours, setIs24Hours] = useState(false)
    const [hours, setHours] = useState([])

    const [picker, setPicker] = useState({
        show:false, day:null, type:null
    })

    useEffect(()=>{
        if(params.store_id){
            getStoreHours(
                `/stores/store-hours/${params.business_id}/${params.store_id}`
            )
        }
    },[params.store_id])

    useEffect(()=>{
        if(data){
            setHours(
                (data.data || []).sort(
                    (a,b)=>
                    a.day_of_week - b.day_of_week
                )
            )

            // if backend returns this later
            setIs24Hours(
                data.is_24_hours || false
            )
        }
    },[data])

    const toggleClosed = (day)=>{
        setHours(prev=>
            prev.map(item=>{
                if(item.day_of_week === day){
                    const closed = !item.is_closed
                    return {
                        ...item,
                        is_closed: closed,
                        open_time: closed ? null : item.open_time,
                        close_time: closed ? null : item.close_time
                    }

                }

                return item
            })
        )
    }

    const toggle24Hours = (value)=>{
        setIs24Hours(value)

        if(value){
            setHours(prev=>
                prev.map(item=>({
                    ...item,
                    is_closed:false
                }))
            )
        }
    }

    const updateTime = (event, selectedDate)=>{
        setPicker({
            show:false, day:null, type:null
        })

        if(!selectedDate) return;

        const time = selectedDate.toTimeString().slice(0,5)

        setHours(prev=>
            prev.map(item=>{
                if(item.day_of_week === picker.day){
                    return {
                        ...item,
                        [picker.type]:time
                    }
                }

                return item
            })
        )
    }

    const saveHours = async()=>{
        try {
            for (const hour of hours) {
                // Ignore validation when 24 hours
                if (is24Hours) continue

                // Closed days must have no times
                if(hour.is_closed){
                    if(hour.open_time || hour.close_time){
                        Alert.alert(
                            "Invalid hours",
                            `${days[hour.day_of_week]} is closed but has opening hours`
                        )
                        return
                    }
                }

                // Open days must have both times
                else {
                    if(!hour.open_time || !hour.close_time){
                        Alert.alert(
                            "Missing time",
                            `${days[hour.day_of_week]} needs opening and closing time`
                        )
                        return
                    }
                }
            }
            const res = await updateStoreHours({
                is_24_hours: is24Hours,
                hours,
                business_id: params.business_id,
                store_id: params.store_id
            })

            if (!res.success) {
                toast.error(res?.data?.message || 'Failed to update hours.');
                return;
            }

            toast.success(res?.data?.message || 'Store hours updated successfully');
            router.back();
            return;
        } catch(error) {
            console.log(
                "Update hours error:",
                error
            )

            toast.error('Failed updating store hours');
            return;
        }
    }

    const formatTime=(time)=>{
        if (!time) return "--"
        return time.slice(0,5)
    }

    return (
        <SafeAreaView className="flex-1 bg-white px-4">
            <Headers
                header_name="Working Hours"
                fontFamily="ubuntu-medium"
                textStyles="text-2xl"
                icon={
                    <FontAwesome5
                        name="store-alt"
                    />
                }
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    flexGrow: 1
                }}
                showsVerticalScrollIndicator={false}
            >
                <View className='h-full w-full justify-center items-center'>
                {isLoading ? (
                    <View className='h-full justify-center items-center'>
                        <ActivityIndicator color={COLORS.primary} size={35}/>
                        <Text className="mt-5"
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            Loading hours...
                        </Text>
                    </View>
                ) : (
                    <>
                        <View className="mt-4 flex-row justify-between items-center w-full">
                            <Text
                                className="text-xl"
                                style={{
                                    fontFamily:"roboto-medium"
                                }}
                            >
                                Open 24 Hours
                            </Text>
                            <Switch
                                value={is24Hours}
                                onValueChange={toggle24Hours}
                            />
                        </View>
                            {hours.map(item => (
                                <View
                                    key={item.day_of_week}
                                    className="border-b border-gray-200 py-4 w-full"
                                >
                                    <View className="flex-row justify-between items-center">
                                        <Text
                                            className="text-lg"
                                            style={{
                                                fontFamily:"roboto-medium"
                                            }}
                                        >
                                            {days[item.day_of_week]}
                                        </Text>
                                        <View className="flex-row items-center">
                                            <Text className="mr-2">
                                                Closed
                                            </Text>
                                            <Switch
                                                value={item.is_closed}
                                                disabled={is24Hours}
                                                onValueChange={()=>
                                                    toggleClosed(
                                                        item.day_of_week
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>

                                    {!item.is_closed && !is24Hours && (
                                        <View className="mt-3">
                                            <TouchableOpacity
                                                className="bg-gray-100 p-3 rounded mb-2 flex-row justify-between items-center"
                                                onPress={()=>setPicker({
                                                    show:true,
                                                    day:item.day_of_week,
                                                    type:"open_time"
                                                })}
                                            >
                                                <Text>
                                                    Open: {formatTime(item.open_time)}
                                                </Text>
                                                <MaterialIcons name="edit" size={19} color={COLORS.green1} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                className="bg-gray-100 p-3 rounded flex-row justify-between items-center"
                                                onPress={()=>setPicker({
                                                    show:true,
                                                    day:item.day_of_week,
                                                    type:"close_time"
                                                })}
                                            >
                                                <Text>
                                                    Close: {formatTime(item.close_time)}
                                                </Text>
                                                <MaterialIcons name="edit" size={19} color={COLORS.green1} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            ))
                        }
                    </>
                )}
                </View>
            </ScrollView>
            <TouchableOpacity
                onPress={saveHours}
                className="bg-primary rounded-lg py-3 mb-4 elevation-sm"
                disabled={updateLoading}
            >
                {updateLoading ? (
                    <ActivityIndicator color={COLORS.white} size={28}/>
                ) : (
                    <Text
                        style={{fontFamily: 'outfit-medium'}}
                        className="text-white text-center text-2xl"
                    >
                        Save Changes
                    </Text>
                )}
            </TouchableOpacity>

            {picker.show && (
                <DateTimePicker
                    mode="time"
                    value={new Date()}
                    onChange={updateTime}
                />
            )}
        </SafeAreaView>
    )
}

export default Index