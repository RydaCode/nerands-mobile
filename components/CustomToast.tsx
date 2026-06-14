import { Feather, Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { ToastConfigParams } from 'react-native-toast-message';
import { COLORS, SIZES } from '../constants/constants';

type CustomToastProps = ToastConfigParams<any> & {
  type?: 'success' | 'error' | 'info';
  style?: StyleProp<ViewStyle>;
};

export const CustomToast = (
    { type = 'info', text1, text2, style, ...props }: CustomToastProps
) => {
    let backgroundColor = '#fff';
    let borderColor = '#7F57FF';
    let text1Color = '#fff';
    let text2Color = '#c2c2c2';
    let icon = <Ionicons name="alert-circle-outline" size={24} color="#fff" />;

    switch (type) {
        case 'success':
            backgroundColor = '#E6FFFA';
            borderColor = '#38A169';
            text1Color = '#2F855A';
            text2Color = '#276749';
            icon = <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.green1} />;
            break;
        case 'error':
            backgroundColor = '#FFF5F5';
            borderColor = '#E53E3E';
            text1Color = '#C53030';
            text2Color = '#9B2C2C';
            icon = <Ionicons name="close-circle-outline" size={24} color="#C53030" />;
            break;
        case 'info':
        default:
            backgroundColor = '#EBF8FF';
            borderColor = '#3182CE';
            text1Color = '#2B6CB0';
            text2Color = '#2C5282';
            icon = <Feather name="info" size={24} color="#2B6CB0" />;
        break;
    }

    return (
        <MotiView
            from={{ translateY: -50, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: -50, opacity: 0 }}
            transition={{ type: 'timing', duration: 300 }}
            style={[
                {
                    width: '95%',
                    alignSelf: 'center',
                    position: 'absolute',
                    top: 30,
                    zIndex: 99999,
                },
                style,
            ]}
            {...props}
        >
            <View
                style={{
                    borderRadius: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 5,
                    backgroundColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderLeftWidth: 3,
                    borderLeftColor: borderColor,
                }}
            >
                <View style={{ marginRight: 4 }}>{icon}</View>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: text1Color, fontFamily: 'roboto-medium', fontSize: 14 }}>
                        {text1}
                    </Text>
                    {text2 ? (
                        <Text style={{ color: text2Color, fontFamily: 'roboto', fontSize: SIZES.small, marginTop: 2 }}>
                            {text2}
                        </Text>
                    ) : null}
                </View>
            </View>
        </MotiView>
    );
};