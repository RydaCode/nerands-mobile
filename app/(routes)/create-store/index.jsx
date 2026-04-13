import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MainHeader from "../../../components/MainHeader";
import CreateStore from "../../screens/create-store/CreateStore";

const index = () => {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-start">
            <View className="px-2">
                <MainHeader
                    fontFamily="ubuntu-medium"
                    textStyles="text-2xl"
                    header_name="Create Store"
                />
            </View>
            <View className="flex-row mb-1">
                <CreateStore router={router} />
            </View>
        </SafeAreaView>
    );
};

export default index;