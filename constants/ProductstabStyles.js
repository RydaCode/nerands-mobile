import { StyleSheet } from "react-native";
import { COLORS, SHADOWS, SIZES } from "./constants";

const ProductstabStyles = StyleSheet.create({

    container: {
        paddingRight: 5,
    },

    btn: (isActive) => ({
        backgroundColor: isActive
            ? COLORS.primary
            : COLORS.grey_bg,

        borderRadius: SIZES.medium,

        ...SHADOWS.main,

        shadowColor: COLORS.white,
    }),

    btnText: (isActive) => ({
        fontFamily: "roboto",
        fontSize: SIZES.medium,

        color: isActive
            ? COLORS.white
            : COLORS.slate,
    }),

});

export default ProductstabStyles;