import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Pressable,
    StyleSheet, Text, View
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { COLORS } from '../../constants/constants';
import { Carticons } from '../../constants/icons';
import useApi from '../../hook/useApi';
import { STORES_IMAGE_URI } from '../../RequestMethods';

const { width } = Dimensions.get('window');

const HomeCourasel = (refreshKey) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);

    const { data, isLoading, error, get, del } = useApi(`/stores/courasel?&limit=6`);
    
    useEffect(() => {
        get(refreshKey);
    }, []);

    const openImageViewer = (index) => {
        setViewerIndex(index);
        setIsImageViewerVisible(true);
    };

    const images = data?.map((store) => ({
        uri: store.store_profileimage
            ? `${STORES_IMAGE_URI}${store.store_profileimage}`
            : Carticons.placeholder,
        caption: store.store_name,
    })) || [];

    if (isLoading) {
        return (
            <View style={styles.container} className='rounded-md'>
                <View style={styles.carouselWrapper}>
                    <ActivityIndicator size={35} color={COLORS.primary}/>
                </View>
            </View>
        )
        
    }

    if (!data) {
        return (
            <View style={styles.container} className='rounded-md'>
                <View style={styles.carouselWrapper}>
                    <Image
                        className='w-full h-full'
                        source={Carticons.placeholder}
                    />
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container} className='rounded-md'>
            <View style={styles.carouselWrapper}>
                <Carousel
                    width={width}
                    height={200}
                    data={images}
                    loop
                    autoPlay
                    scrollAnimationDuration={1000}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    // mode="parallax"
                    // modeConfig={{
                    //     parallaxScrollingScale: 0.9,
                    //     parallaxScrollingOffset: 60,
                    // }}
                    renderItem={({ item, index, animationValue }) => {
                        const animatedStyle = useAnimatedStyle(() => {
                            const scale = interpolate(
                                animationValue.value,
                                [-1, 0, 1],
                                [0.85, 1, 0.85]
                            );
                            return {
                                transform: [{ scale }],
                            };
                        });

                        return (
                            <Pressable onPress={() => openImageViewer(index)}>
                                <Animated.Image
                                    source={{ uri: item.uri }}
                                    style={[styles.image, animatedStyle]}
                                />
                                <View style={styles.captionContainer}>
                                    <Text style={styles.captionText}>{item.caption}</Text>
                                </View>
                            </Pressable>
                        );
                    }}
                />

                {/* Dots overlayed on image */}
                <View style={styles.paginationOverlay}>
                    {images.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                i === activeIndex ? styles.activeDot : null,
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* Full-Screen Image Viewer */}
            <ImageViewing
                images={images.map((img) => ({ uri: img.uri }))}
                imageIndex={viewerIndex}
                visible={isImageViewerVisible}
                onRequestClose={() => setIsImageViewerVisible(false)}
                swipeToCloseEnabled
                doubleTapToZoomEnabled
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    carouselWrapper: {
        position: 'relative',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        overflow: 'hidden'
    },

    image: {
        width: width,
        height: '100%',
        resizeMode: 'cover'
    },

    captionContainer: {
        position: 'absolute',
        bottom: 35,
        left: 15,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },

    captionText: {
        color: '#fff',
        fontSize: 16,
    },

    paginationOverlay: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#888',
        marginHorizontal: 4,
    },

    activeDot: {
        backgroundColor: '#fff',
        width: 10,
        height: 10,
    },
});

export default HomeCourasel