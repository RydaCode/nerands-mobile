import { FontAwesome5 } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../constants/constants';

const AssignmentsCard = ({ activeOrder, customOrder, runner, router, text }) => {
    const hasAssignment = activeOrder || (customOrder?.data);

    console.log("NAVIGATE", customOrder)

    const handleNavigate = () => {
        const order = customOrder?.data;
        
        if (!order) return;
        router.push({
            pathname: '../(routes)/maps/runner/AssignementMapCustomOrder/',
            params: {
                runner_id: runner?.runner_id,
                custom_order_id: order.custom_order_id,
                custom_order_num: order.custom_order_num,
                runner_latitude: order.runner_location.coordinates[0],
                runner_longitude: order.runner_location.coordinates[1],
                custom_order_latitude: order.custom_order_location.coordinates[0],
                custom_order_longitude: order.custom_order_location.coordinates[1],
                first_name: runner.first_name,
                last_name: runner.last_name,
                profile_image: order.profile_image,
                phone_num: order.phone_num,
                order_notes: order.order_notes,
                delivery_mode: order.delivery_mode,
                estimated_spend_amount: order.estimated_spend_amount,
            },
        });
    };

    return hasAssignment && (
        <TouchableOpacity
            className="bg-indigo-600 rounded-md justify-center mx-4 elevation-lg items-center mt-4"
            style={{ height: 90 }}
            onPress={handleNavigate}
        >
            <FontAwesome5 name="arrow-right" color={COLORS.white} size={25} />
            <Text className="text-xl text-white" style={{ fontFamily: 'roboto-medium' }}>
                {text}
            </Text>
        </TouchableOpacity>
    )
};

export default AssignmentsCard;