import { Entypo, FontAwesome, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import agoTimeStamp from '../../../components/agoTimeStamp';
import { COLORS } from '../../../constants/constants';

const OrderDetails = ({params, data}) => {
    const charges = useSelector(state => state.delivery.charges);
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return '#F97316'; // orange
            case 'Processing':
                return '#3B82F6'; // blue
            case 'Accepted':
                return '#22C55E'; // green
            case 'In_Transit':
                return '#8B5CF6'; // purple
            case 'Delivered':
                return '#10B981'; // emerald
            default:
                return '#6B7280'; // gray
        }
    };

    const calculateServiceFee = (amount) => {
        let percent = charges?.charge_percent ?? 15;

        if (amount > 500) percent -= 4;
        else if (amount > 300) percent -= 3;
        else if (amount > 100) percent -= 2;

        const fee = +(amount * (percent / 100)).toFixed(2);

        // Cap the service fee at 150
        return Math.min(fee, 150);
    };

    return (
        <View
            className='elevation-sm w-full border border-lavender rounded my-8 p-2 pt-4 bg-white relative'
        >
            <View className='absolute px-1 bg-white' style={{top: -13, left: 4}}>
                <Text className='text-xl font-semibold' style={{fontFamily: 'roboto-medium'}}>Order Details</Text>
            </View>
            <View className='items-center'>
                <View className='w-full flex-row justify-start items-center mb-4'>
                    <Entypo name='box' size={20} color={COLORS.primary}/>
                    <Text className='ml-2 text-xl text-black' style={{fontFamily: 'roboto-medium'}}>
                        {params.order_number}
                    </Text>
                </View>
                <View className='mb-2 w-full'>
                    <View className='flex-row items-center' style={{width: '55%'}}>
                        <FontAwesome5 name="store-alt" size={13} color={COLORS.primary}/>
                        <Text className='text-black ml-2' style={{fontFamily: 'roboto-medium'}}>Custom stores:</Text>
                    </View>
                    {data?.custom_stores === null ? (
                        <Text className='text-primary text-lg mb-4 mt-1' style={{fontFamily: 'roboto-medium'}}>Any</Text>
                    ) : (
                        <View className='flex-row flex-wrap mb-4 mt-1'>
                            {data?.custom_stores?.map((store) => (
                                <View
                                    key={store.id}
                                    className='bg-grey_bg rounded-full py-1 px-3 mr-2 mb-2'
                                >
                                    <Text
                                        className='text-slate text-sm'
                                        style={{ fontFamily: 'roboto-medium' }}
                                    >
                                        {store.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
                <View className='w-full flex-row justify-start items-center mb-2'>
                    <View className='flex-row items-center' style={{width: '55%'}}>
                        <MaterialIcons name="money" size={16} color={COLORS.primary}/>
                        <Text className='text-black ml-2' style={{fontFamily: 'roboto-medium'}}>Budget:</Text>
                    </View>
                    <View className='ml-2' style={{width: '33%'}}>
                        <Text className='text-primary' style={{fontFamily: 'roboto-medium'}}>
                            K{Number(data?.estimated_spend_amount || 0).toLocaleString()}
                        </Text>
                    </View>
                </View>
                <View className='w-full flex-row justify-start items-center mb-2'>
                    <View className='flex-row items-center' style={{width: '55%'}}>
                        <MaterialIcons name="money" size={16} color={COLORS.primary}/>
                        <Text className='text-black ml-2' style={{fontFamily: 'roboto-medium'}}>Amount spent:</Text>
                    </View>
                    <View className='ml-2' style={{width: '33%'}}>
                        <Text className='text-primary' style={{fontFamily: 'roboto-medium'}}>
                            K{data?.amount_spent === null ? 0 : Number(data?.amount_spent).toLocaleString()}
                        </Text>
                    </View>
                </View>
                <View className='w-full flex-row justify-start items-center mb-2'>
                    <View className='flex-row items-center' style={{width: '55%'}}>
                        <MaterialCommunityIcons name="truck-delivery" size={16} color={COLORS.primary}/>
                        <Text className='text-black ml-2' style={{fontFamily: 'roboto-medium'}}>Delivery mode:</Text>
                    </View>
                    <View className='ml-2' style={{width: '33%'}}>
                        <Text className='text-primary' style={{fontFamily: 'roboto-medium'}}>
                            {data?.delivery_mode?.[0] === 'custom'
                                ? 'Any'
                                : data?.delivery_mode?.[0] || 'N/A'}
                        </Text>
                    </View>
                </View>
                <View className='w-full flex-row justify-start items-center mb-2'>
                    <View className='flex-row items-center' style={{width: '55%'}}>
                        <MaterialIcons name="money" size={16} color={COLORS.primary}/>
                        <Text className='text-black ml-2' style={{fontFamily: 'roboto-medium'}}>Delivery fee:</Text>
                    </View>
                    <View className='ml-2' style={{width: '33%'}}>
                        <Text className='text-primary' style={{fontFamily: 'roboto-medium'}}>
                            K{data?.delivery_mode?.[0] === 'custom' ? 0 : Number(data?.delivery_mode?.[0]?.fee || 0).toLocaleString()}
                        </Text>
                    </View>
                </View>
                <View className='w-full flex-row justify-start items-center mb-2'>
                    <View className='flex-row items-center' style={{width: '55%'}}>
                        <MaterialIcons name="money" size={16} color={COLORS.primary}/>
                        <Text className='text-black ml-2' style={{fontFamily: 'roboto-medium'}}>
                            {data.amount_spent === null || 
                            data.amount_spent === 0 ? 'Est. ' : ''}Service fee:</Text>
                    </View>
                    <View className='ml-2' style={{width: '33%'}}>
                        <Text
                            className='text-primary'
                            style={{ fontFamily: 'roboto-medium' }}
                        >
                            K{
                                Number(
                                    data?.amount_spent
                                        ? calculateServiceFee(data.amount_spent)
                                        : data?.service_fee || 0
                                ).toLocaleString()
                            }
                        </Text>
                    </View>
                </View>
                {data?.order_notes !== null &&
                    <View className='w-full flex-row justify-between items-center mt-2 pt-2'
                        style={{borderTopWidth: 1, borderTopColor: COLORS.lavender }}
                    >
                        <View className='justify-start'>
                            <View className='flex-row py-1'>
                                <MaterialIcons name="notes" size={16} color={COLORS.primary}/>
                                <Text className='text-base ml-2 text-black' style={{fontFamily: 'roboto-medium'}}>
                                    Order Notes
                                </Text>
                            </View>
                            <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>
                                {data?.order_notes}
                            </Text>
                        </View>
                    </View>
                }
                <View className='w-full flex-row justify-between items-center mt-2 pt-2'
                    style={{borderTopWidth: 1, borderTopColor: COLORS.lavender }}
                >
                    <View className='flex-row justify-start items-center'>
                        <FontAwesome name='clock-o' size={16} color={COLORS.primary}/>
                        <Text className='text-base ml-2 text-slate' style={{fontFamily: 'roboto-medium'}}>
                            Order time
                        </Text>
                        <View className='bg-grey_bg ml-3 px-2 py-1 rounded-full'>
                            <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>
                                {agoTimeStamp(data?.order_date_time)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View className='flex-row mt-4 justify-between items-center'>
                <View className='w-[48.5%] py-2 justify-center items-center bg-navBtnBgHome rounded'>
                    <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>
                        TYPE: <Text className='ml-1 text-green2 text-base' style={{fontFamily: 'roboto-medium'}}>CUSTOM</Text>
                    </Text>
                </View>
                <View className='w-[48.5%] py-2 justify-center items-center bg-red rounded'
                    style={{backgroundColor: getStatusColor(params.order_status)}}
                >
                    <Text className='ml-1 text-white text-base' style={{fontFamily: 'roboto-medium'}}>{params.order_status}</Text>
                </View>
            </View>
        </View>
    )
}

export default OrderDetails;