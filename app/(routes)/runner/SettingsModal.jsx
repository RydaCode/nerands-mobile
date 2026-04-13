import { Text, TouchableOpacity, View } from "react-native";

const SettingsModal = ({ visible, onClose }) => {
    if (!visible) return null;

    return (
        <View className="absolute w-full h-full z-40 bg-transparentBlack justify-center items-center px-4">
            <View className="bg-white p-6 rounded-md w-full">
                <Text className="text-xl font-bold mb-4">⚙️ Settings</Text>

                {/* Example Settings Options */}
                <TouchableOpacity className="p-3 bg-grey_bg rounded-md mb-2">
                    <Text>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity className="p-3 bg-grey_bg rounded-md mb-2">
                    <Text>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity className="p-3 bg-grey_bg rounded-md mb-2">
                    <Text>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-red p-3 rounded-md mt-4"
                    onPress={onClose}
                >
                    <Text className="text-white text-center">Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SettingsModal;