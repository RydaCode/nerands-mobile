import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { COLORS } from '../constants/constants';
import { Carticons } from '../constants/icons';
import { PRODUCTS_IMAGE_URI } from '../RequestMethods';

const { width } = Dimensions.get('window');

const FadeInImage = ({ uri, style }) => {
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withTiming(1, {
            duration: 500
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    return (
        <Animated.Image
            source={{ uri }}
            style={[style, animatedStyle]}
            resizeMode="cover"
        />
    );
};

const ProductImagesGallery = ({ mainImage, images }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);

    const flatListRef = useRef(null);
    const carouselRef = useRef(null);

    // console.log("PRO_IMAGESSSS", images)

    /*
     * Convert all supported image formats into one format:
     *
     * {
     *     uri: "https://..."
     * }
     *
     * Supported input formats:
     *
     * 1. { image_url: "products/..." }
     * 2. { product_images: "products/..." }
     * 3. "products/..."
     */
    const mappedImages = useMemo(() => {
        const imageList =
            Array.isArray(images) && images.length > 0
                ? images
                : mainImage
                    ? [mainImage]
                    : [];

        return imageList
            .map((img) => {
                let imageUrl = null;

                if (typeof img === 'string') {
                    imageUrl = img;
                } else if (img && typeof img === 'object') {
                    imageUrl =
                        img.image_url ||
                        img.product_images ||
                        null;
                }

                return {
                    uri: imageUrl
                        ? `${PRODUCTS_IMAGE_URI}${imageUrl}`
                        : Carticons.placeholder
                };
            })
            .filter(Boolean);
    }, [images, mainImage]);

    /*
     * Preload images
     */
    useEffect(() => {
        mappedImages.forEach((img) => {
            if (
                img.uri &&
                img.uri !== Carticons.placeholder
            ) {
                Image.prefetch(img.uri);
            }
        });
    }, [mappedImages]);

    /*
     * Reset active index when images change
     */
    useEffect(() => {
        setActiveIndex(0);
        setViewerIndex(0);
    }, [images, mainImage]);

    /*
     * Show loading state if there are no images.
     */
    if (mappedImages.length === 0) {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    size={35}
                    color={COLORS.primary}
                />
            </View>
        );
    }

    /*
     * Open fullscreen image viewer
     */
    const openImageViewer = (index) => {
        setViewerIndex(index);
        setIsImageViewerVisible(true);
    };

    /*
     * Thumbnail pressed
     */
    const onThumbnailPress = (index) => {
        setActiveIndex(index);

        carouselRef.current?.scrollTo({
            index,
            animated: true
        });
    };

    console.log('GALLERYYYYYYYYYYYYYYYYYYY images:', images);
console.log('GALLERY mainImage:', mainImage);
console.log('GALLERY PRODUCTS_IMAGE_URI:', PRODUCTS_IMAGE_URI);
console.log('GALLERY mappedImages:', mappedImages);

    return (
        <View style={styles.container}>

            {/* =========================
                Main Image Carousel
            ========================== */}
            <View style={styles.carouselWrapper}>
                <Carousel
                    ref={carouselRef}
                    width={width}
                    height={300}
                    data={mappedImages}
                    loop={false}
                    scrollAnimationDuration={800}
                    onSnapToItem={(index) => {
                        setActiveIndex(index);
                    }}
                    renderItem={({
                        item,
                        index,
                        animationValue
                    }) => {

                        const animatedStyle =
                            useAnimatedStyle(() => {
                                const scale = interpolate(
                                    animationValue.value,
                                    [-1, 0, 1],
                                    [0.85, 1, 0.85]
                                );

                                return {
                                    transform: [
                                        {
                                            scale
                                        }
                                    ]
                                };
                            });

                        return (
                            <Pressable
                                onPress={() =>
                                    openImageViewer(index)
                                }
                            >
                                <FadeInImage
                                    uri={item.uri}
                                    style={[
                                        styles.image,
                                        animatedStyle
                                    ]}
                                />

                                {item.caption ? (
                                    <View
                                        style={
                                            styles.captionContainer
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.captionText
                                            }
                                        >
                                            {item.caption}
                                        </Text>
                                    </View>
                                ) : null}
                            </Pressable>
                        );
                    }}
                />
            </View>

            {/* =========================
                Thumbnails
            ========================== */}
            {mappedImages.length > 1 && (
                <FlatList
                    ref={flatListRef}
                    data={mappedImages}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) =>
                        `${item.uri}-${index}`
                    }
                    style={{
                        marginTop: 5
                    }}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() =>
                                onThumbnailPress(index)
                            }
                        >
                            <Image
                                source={{
                                    uri: item.uri
                                }}
                                style={[
                                    styles.thumbnail,
                                    activeIndex === index &&
                                        styles.activeThumbnail
                                ]}
                            />
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* =========================
                Fullscreen Image Viewer
            ========================== */}
            <ImageViewing
                images={mappedImages.map((img) => ({
                    uri: img.uri
                }))}
                imageIndex={viewerIndex}
                visible={isImageViewerVisible}
                onRequestClose={() =>
                    setIsImageViewerVisible(false)
                }
                swipeToCloseEnabled
                doubleTapToZoomEnabled
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    carouselWrapper: {
        position: 'relative',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        overflow: 'hidden'
    },

    image: {
        width: width,
        height: 300,
        resizeMode: 'cover'
    },

    captionContainer: {
        position: 'absolute',
        bottom: 35,
        left: 15,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8
    },

    captionText: {
        color: '#fff',
        fontSize: 16
    },

    thumbnail: {
        width: 85,
        height: 70,
        marginHorizontal: 3,
        borderRadius: 4
    },

    activeThumbnail: {
        borderWidth: 2,
        borderColor: COLORS.primary
    }
});

export default ProductImagesGallery;