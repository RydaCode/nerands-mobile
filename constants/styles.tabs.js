import { StyleSheet } from "react-native";
import { COLORS, SHADOWS, SIZES } from "./constants";

const styles = StyleSheet.create({
  container: {
    paddingRight: 5,
  },

  btn: (name, activeTab) => ({
    backgroundColor: name === activeTab ? COLORS.primary : COLORS.grey_bg,
    borderRadius: SIZES.padding,
    // marginRight: 2,
    ...SHADOWS.main,
    shadowColor: COLORS.white,
  }),

  btnText: (name, activeTab) => ({
    fontFamily: "roboto",
    fontSize: SIZES.medium,
    color: name === activeTab ? COLORS.white : COLORS.slate,
  }),
});

export default styles;