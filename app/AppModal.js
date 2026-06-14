import { useEffect, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    View
} from "react-native";

const AppModal = ({ children }) => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });

        const hide = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
        });

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        style={{ flex: 1 }}
                    >

                        {/* THIS is the fix */}
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "flex-end",
                                paddingBottom: keyboardHeight,
                            }}
                        >

                            <View
                                style={{
                                    backgroundColor: "white",
                                    borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                    padding: 20,
                                }}
                            >
                                {children}
                            </View>

                        </View>

                    </KeyboardAvoidingView>

                </View>
            </TouchableWithoutFeedback>
    );
};

export default AppModal;