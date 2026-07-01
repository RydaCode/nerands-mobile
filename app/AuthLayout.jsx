import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { COLORS } from "../constants/constants";

const AuthLayout = ({ children }) => {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: COLORS.white }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, backgroundColor: COLORS.white }}>
                    {children}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default AuthLayout;