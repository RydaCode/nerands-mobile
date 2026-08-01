import { useWindowDimensions } from "react-native";

export const useResponsive = () => {
    const { width, height } = useWindowDimensions();

    const isLandscape = width > height;
    const isPortrait = !isLandscape;

    const isTablet = Math.min(width, height) >= 600;

    const smallScreen = width < 360;
    const mediumScreen = width >= 360 && width < 768;
    const largeScreen = width >= 768;

    // Width percentage
    const wp = (percent: number): number => {
        return (width * percent) / 100;
    };

    // Height based on width ratio
    const aspectHeight = (
        widthPercent: number,
        aspectRatio: number
    ): number => {
        return wp(widthPercent) * aspectRatio;
    };

    // Common responsive sizes
    const avatarSize: number = isTablet ? 80 : 64;

    const cardImageHeight: number = isLandscape
        ? aspectHeight(70, 0.45)
        : aspectHeight(70, 0.55);

    const listCardHeight: number = isTablet ? 110 : 84;

    const categoryImageSize: { width: number; height: number } = isLandscape
        ? { width: 80, height: 60 }
        : { width: 65, height: 50 };

    const clamp = (
        value: number,
        min: number,
        max: number
    ): number => {
        return Math.min(Math.max(value, min), max);
    };

    const responsiveSize = (
        percent: number,
        min: number,
        max: number
    ): number => {
        return clamp(wp(percent), min, max);
    };

    return {
        width,
        height,

        wp,
        aspectHeight,

        responsiveSize,
        isLandscape,
        isPortrait,
        isTablet,

        smallScreen,
        mediumScreen,
        largeScreen,

        avatarSize,
        cardImageHeight,
        listCardHeight,
        categoryImageSize
    };
};