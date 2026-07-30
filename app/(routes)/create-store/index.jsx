import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Headers from "../../../components/Headers";
import { COLORS } from "../../../constants/constants";
import CreateStore from "./CreateStore";

const Index = () => {
    const params = useLocalSearchParams();
    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-start">
            <View className="px-2">
                <Headers
                    header_name='Create Branch'
                    fontFamily='outfit-medium'
                    textStyles='text-2xl'
                    icon={<Ionicons name='business-sharp'
                    size={15}
                    color={COLORS.slate}/>}
                />
            </View>
            <View className="flex-row mb-1">
                <CreateStore
                    business_id={params.business_id}
                    business_name={params.business_name}
                    display_name={params.display_name}
                    business_category={params.business_category}
                    email={params.email}
                    country={params.country}
                    logo_url={params.logo_url}
                    phone={params.phone}
                    province={params.province}
                    registration_number={params.registration_number}
                    status={params.status}
                    t_pin={params.t_pin}
                    tax_number={params.tax_number}
                    city={params.city}
                />
            </View>
        </SafeAreaView>
    );
};

export default Index;