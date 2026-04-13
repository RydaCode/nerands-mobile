import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const CompleteAccountSetupModal = ({ transporter }) => {
    const router = useRouter();

    let isIncomplete = false;

    if (transporter?.courier_type === "Biker" || transporter?.courier_type === "Motor-Car") {
        isIncomplete =
            !transporter?.drivers_license ||
            !transporter?.transporter_car_bike_name ||
            !transporter?.transporter_car_model ||
            !transporter?.transporter_car_year ||
            !transporter?.transporter_car_bike_reg_number ||
            !transporter?.transporter_car_bike_color ||
            !transporter?.transporter_residential_address;
    } else {
        isIncomplete = !transporter?.transporter_residential_address;
    }

    if (!isIncomplete) return null;

    return (
        <View className="absolute w-full h-full z-40 bg-transparentBlack justify-center items-center px-4">
            <View className="bg-white p-6 rounded-md w-full">
                <Text className="text-xl font-bold mb-4 text-center">
                    ⚠️ Complete Your Account Setup
                </Text>
                <Text className="text-center mb-4">
                    You must complete your profile before proceeding.
                </Text>
                <TouchableOpacity
                    className="bg-green2 p-3 rounded-md mt-4"
                    onPress={() =>
                        router.push({
                            pathname: "../complete-transporter-ac",
                            params: {
                                courier_type: transporter?.courier_type,
                                transporter_id: transporter?.transporter_id
                            },
                        })
                    }
                >
                    <Text className="text-white text-center">Complete Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CompleteAccountSetupModal;