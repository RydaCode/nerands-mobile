import { Fontisto } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS, SIZES } from "../../constants/constants";

const LogingBtn = ({handlePress}) => {
    return (
        <>
            <View
                className="flex-1 items-center justify-center flex-row absolute bottom-3"
                style={{ zIndex: 999 }}
            >
                <View className="flex-row justify-center w-[100%]">
                    <TouchableOpacity
                        onPress={handlePress}
                        activeOpacity={0.5}
                        className="mt-10 flex-row w-full bg-primary justify-center items-center relative py-3"
                        style={{
                            borderRadius: SIZES.radius,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.5,
                            shadowRadius: 5,
                            elevation: 5,
                        }}
                    >
                        <Fontisto name="locked" size={18} color={COLORS.white} />
                        <Text
                            className=" text-white text-2xl ml-2"
                            style={{ fontFamily: "ubuntu-medium", fontWeight: SIZES.h1 }}
                        >
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default LogingBtn;