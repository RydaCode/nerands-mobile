import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    View,
} from "react-native";

const AuthLayout = ({ children }) => {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    {children}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default AuthLayout;