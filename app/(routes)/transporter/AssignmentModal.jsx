import { Text, TouchableOpacity, View } from "react-native";
import { toast } from "../../../utils/toast";

const AssignmentModal = ({ visible, onClose }) => {
    if (!visible) return null;

    const handleAccept = () => {
        toast.success("Assignment Accepted ✅");
        onClose();
    };

    const handleDecline = () => {
        toast.error("Assignment Declined");
        onClose();
    };

    return (
        <View className="absolute w-full h-full z-40 bg-transparentBlack justify-center items-center px-4">
            <View className="bg-white p-6 rounded-md w-full">
                <Text className="text-2xl mb-4" style={{fontFamily: 'ubuntu-medium'}}>🚚 New Assignment</Text>
                <Text className="mb-4">Would you like to accept this assignment?</Text>

                <View className="flex-row justify-between">
                    <TouchableOpacity
                        className="bg-green2 p-3 rounded-md flex-1 mr-2"
                        onPress={handleAccept}
                    >
                        <Text className="text-white text-center text-lg" style={{fontFamily: 'roboto-medium'}}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-red p-3 rounded-md flex-1 ml-2"
                        onPress={handleDecline}
                    >
                        <Text className="text-white text-center text-lg" style={{fontFamily: 'roboto-medium'}}>Decline</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default AssignmentModal;