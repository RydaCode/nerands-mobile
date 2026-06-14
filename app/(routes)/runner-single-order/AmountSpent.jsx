import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';

const AmountSpent = ({params, data}) => {
    if (data.amount_spent) return null;
    const [amountSpent, setAmountSpent] = useState("");
    const {data: spend, isLoading, error, patch} = useApi('/customorders/update');

    const handleUpdateSpentAmount = async () => {
        if (!data) {
            toast.error('An error ocured, please try again');
            return;
        }

        if (!amountSpent) {
            toast.error('Enter amount spent');
            return;
        }

        if (data?.amount_spent) {
            toast.error('Amount already updated. You can only update it once.');
            return;
        }

        if (isLoading) return;

        try {
            await patch({
                custom_order_id: data?.custom_order_id,
                amount_spent: amountSpent
            });

            if (spend?.success === false) {
                toast.success(spend?.message || "Can't update amount");
                return;
            }

            if (spend?.success === true) {
                toast.success(spend.message);
                return;
            }

        } catch (err) {
            toast.error(
                'Network Error',
                err?.message || 'Unable to reach server'
            );
        }
    }
    
    return (
        <View
            className='elevation-sm w-full border border-lavender rounded mb-8 p-2 pt-6 bg-white relative'
        >
            <View className='absolute px-1 bg-white' style={{top: -13, left: 4}}>
                <Text className='text-xl font-semibold' style={{fontFamily: 'roboto-medium'}}>Amount Spent</Text>
            </View>

            <Text className='text-slate text-base mb-1' style={{fontFamily: 'roboto-medium'}}>Please enter the amount spent on this order.</Text>
            <Text className='text-red text-base mb-1' style={{fontFamily: 'roboto'}}>Kindly note that the amount spent can only be updated once.</Text>

            <TextInput
                placeholder="Enter amount"
                keyboardType="numeric"
                onChangeText={(text) => setAmountSpent(text)}
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    marginTop: 8,
                    borderRadius: 5,
                }}
            />

            <TouchableOpacity
                className='justify-center items-center bg-primary my-4 rounded py-2'
                onPress={handleUpdateSpentAmount}
            >
                {isLoading ? 'Updating...' :
                    <Text className='text-white text-2xl' style={{fontFamily: 'maven-medium'}}>Update</Text>
                }
            </TouchableOpacity>
        </View>
    )
}

export default AmountSpent