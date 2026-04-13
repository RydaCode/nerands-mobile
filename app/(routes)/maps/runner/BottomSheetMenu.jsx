// BottomSheetMenu.js
import { FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES, USER_IMAGE_URI } from '../../../../constants/constants';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const BottomSheetMenu = ({
  openCloseMenu,
  setOpenCloseMenu,
  setOpenOrders,
  setOpenOrderNotes,
  setOpenOrdersActions,
  runner,
}) => {

  const [contentHeight, setContentHeight] = useState(0);
  
      const maxHeight = SCREEN_HEIGHT * 0.7;       // Max modal height
      const finalHeight = Math.min(contentHeight, maxHeight); // Actual animated height

  return (
    <>
      {/* Overlay background */}
      {openCloseMenu && (
        <Pressable
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpenCloseMenu(false)}
        />
      )}

      {/* Bottom sheet content */}
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: openCloseMenu ? 1 : 0, translateY: openCloseMenu ? 0 : 50 }}
        transition={{ duration: 700 }}
        style={styles.sheetContainer}
      >

        <TouchableOpacity className='bg-red mb-4 py-1 w-full justify-center items-center'
          onPress={() => setOpenCloseMenu(false)}
        >
          <View className='h-1 bg-lavender rounded-full ' style={{width: '30%'}}/>
        </TouchableOpacity>
        <View className='flex-row items-center px-2 mb-4' style={styles.runnerRow}>
          <Image
            source={{ uri: `${USER_IMAGE_URI}${runner.profile_image}` }}
            style={styles.runnerImage}
          />
          <View style={{ flex: 1, paddingLeft: 8 }}>
            <Text>{runner.first_name} {runner.last_name}</Text>
            <Text style={{ color: COLORS.slate }}>0973123456</Text>
          </View>
          <TouchableOpacity style={styles.phoneButton}>
            <FontAwesome5 name="phone" size={15} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        {openCloseMenu &&
          <>
            <TouchableOpacity className='bg-grey_bg w-[95%] mb-2 mx-3 py-5 justify-center items-center rounded-md elevation-sm' onPress={() => { setOpenOrdersActions(true); setOpenCloseMenu(false); }}>
              <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Order Actions</Text>
            </TouchableOpacity>
            <TouchableOpacity className='bg-grey_bg w-[95%] mb-2 mx-3 py-5 justify-center items-center rounded-md elevation-sm' onPress={() => { setOpenOrders(true); setOpenCloseMenu(false); }}>
              <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Check Order</Text>
            </TouchableOpacity>
            <TouchableOpacity className='bg-grey_bg w-[95%] mb-2 mx-3 py-5 justify-center items-center rounded-md elevation-sm' onPress={() => { setOpenOrderNotes(true); setOpenCloseMenu(false); }}>
              <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Check Order Details</Text>
            </TouchableOpacity>
          </>
        }
      </MotiView>
    </>
  );
};

const styles = {
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.95,
    backgroundColor: "white",
    borderRadius: SIZES.border,
    marginBottom: 10,
    alignSelf: 'center',
    overflow: "hidden",
  },
  runnerImage: {
    width: 45,
    height: 45,
    borderRadius: 22,
  },
  phoneButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: COLORS.green2,
    justifyContent: 'center',
    alignItems: 'center',
  }
};

export default BottomSheetMenu;
