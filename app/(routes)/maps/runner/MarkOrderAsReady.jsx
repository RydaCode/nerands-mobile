import { Text, TouchableOpacity, View } from 'react-native';
import useApi from '../../../../hook/useApi';
import { toast } from '../../../../utils/toast';

const MarkOrderAsReady = ({onClose, custom_order_id}) => {
    const { patch: parcelReady } = useApi(`/customorders/update`);

    const markOrderAsReady = async () => {
        try {
            const response = await parcelReady({ custom_order_id: custom_order_id, order_status: 'Ready' });
            if (response?.status) toast.success("Order Ready", "Marked as ready");
        } catch (err) {
            toast.error("Error", err.message);
        }
    };
    return (
        <View className='bg-white rounded-md p-4'>
            <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Is the order ready?</Text>
            <View className='flex-row justify-between mt-4 mb-1'>
                <TouchableOpacity className='bg-red py-4 items-center rounded-md w-[48%]' onPress={onClose}>
                    <Text className='text-lg' style={{ color: 'white', fontFamily: 'roboto-medium' }}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={markOrderAsReady}  className='bg-green2 py-4 items-center rounded-md w-[48%]' >
                    <Text className='text-lg' style={{ color: 'white', fontFamily: 'roboto-medium' }}>Yes</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default MarkOrderAsReady