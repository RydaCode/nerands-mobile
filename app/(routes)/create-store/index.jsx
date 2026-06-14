import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Headers from "../../../components/Headers";
import CreateStore from "./CreateStore";

const Index = () => {

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-start">
            <View className="px-2">
                <Headers
                    fontFamily="ubuntu-medium"
                    textStyles="text-2xl"
                    header_name="Create Store"
                />
            </View>
            <View className="flex-row mb-1">
                <CreateStore />
            </View>
        </SafeAreaView>
    );
};

export default Index;