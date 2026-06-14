import { View } from 'react-native';

const OverLay = () => {
    return (
        <View style={{zIndex: 1000}} className="absolute top-0 left-0 right-0 bottom-0 flex-1 justify-center items-center w-full h-full"/>
    );
};

export default OverLay;