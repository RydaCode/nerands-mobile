import { MotiView } from 'moti';
import { ReactNode } from 'react';
import {
    DimensionValue,
    Modal,
    Pressable,
} from 'react-native';

interface AppModalProps {
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
    maxHeight?: DimensionValue;
}

const AppModal = ({
    visible,
    onClose,
    children,
    maxHeight = '93%',
}: AppModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            {/* Overlay */}
            <Pressable
                onPress={onClose}
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.45)',
                }}
            />

            {/* Modal container */}
            <MotiView
                from={{
                    opacity: 0,
                    translateY: 80,
                }}
                animate={{
                    opacity: 1,
                    translateY: 0,
                }}
                transition={{
                    type: 'timing',
                    duration: 300,
                }}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    maxHeight: maxHeight,
                    backgroundColor: 'white',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    overflow: 'hidden',
                }}
            >
                {children}
            </MotiView>
        </Modal>
    );
};

export default AppModal;