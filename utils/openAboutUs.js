import { Linking } from "react-native";
import { NERANDS_URI } from "../RequestMethods";

// Open about us
export const openAboutUs = (key) => {
    Linking.openURL(`${NERANDS_URI}/${key}`);
};