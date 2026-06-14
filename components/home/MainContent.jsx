import { COLORS, SIZES } from "@/constants/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { STORES_IMAGE_URI } from "../../RequestMethods";
import { calculateDistance } from "../../utils/getDistance";
import { isStoreOpen } from "../../utils/isStoreOpen";

const MainContent = ({
  store_id,
  store_profileimage,
  store_coverimage,
  store_name,
  store_category,
  store_description,
  store_phone_num,
  open_close,
  latitude,
  longitude,
  store_location,
  average_rating,
  total_ratings,
  favorited,
  open_time,
  closing_time
}) => {
  // Get screen width and height using useWindowDimensions
  const { width, height } = Dimensions.get("window");
  const { latitude: user_latitude, longitude: user_longitude } = useSelector(
      (state) => state.location,
    );

  if (!store_id,
  !store_profileimage,
  !store_coverimage,
  !store_name,
  !store_category,
  !store_description,
  !store_phone_num,
  !open_close,
  !latitude,
  !longitude,
  !store_location) return <Text>Loading...</Text>;

  // Dynamically calculate image sizes based on screen width and height
  const imageWidth = width * 1; // 45% of screen width
  const imageHeight = height * 0.2; // 19% of screen height

  const isLandscape = width > height; // Determine orientation
  const isTablet = width >= 768; // Define a breakpoint for tablets

  const textDimension = isLandscape
    ? { fontSize: 25, fontFamily: "roboto-medium" } // Larger dimensions for landscape
    : { fontSize: SIZES.main, fontFamily: "roboto-medium" }; // Requested dimensions for portrait

  // Set image dimensions based on orientation and device type
  const imageDimensions = isLandscape
    ? { width: "100%", height: 170, marginRight: 10 } // Larger dimensions for landscape
    : { width: "100%", height: imageHeight }; // Requested dimensions for portrait

  const router = useRouter();

  const pointA = { latitude: user_latitude, longitude: user_longitude }; // User
  const pointB = { latitude: latitude, longitude: longitude }; //Store

  // -------- 1️⃣ Average rating stars (half stars allowed) --------
  const renderAverageStars = (avgRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(avgRating)) {
        stars.push(<Ionicons key={`avg-${i}`} name="star" size={14} color={COLORS.primary} />);
      } else if (i - 0.5 <= avgRating) {
        stars.push(<Ionicons key={`avg-${i}`} name="star-half" size={14} color={COLORS.primary} />);
      } else {
        stars.push(<Ionicons key={`avg-${i}`} name="star-outline" size={14} color={COLORS.primary} />);
      }
    }
    return stars;
  };

  // -------- 2️⃣ Popularity stars (progressive based on total reviews) --------
  const renderPopularityStars = (totalRatings) => {
    const stars = [];
    const reviewsPerStar = 1; // 1 solid star per 5 reviews
    let solidStars = Math.floor(totalRatings / reviewsPerStar);
    if (solidStars > 5) solidStars = 5;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={`pop-${i}`}
          name={i <= solidStars ? "star" : "star-outline"}
          size={18}
          color="#00BFFF" // Different color for popularity stars
        />
      );
    }
    return stars;
  };

  const isManuallyClosed = open_close === false;
  const isTimeClosed = !isStoreOpen(open_time, closing_time);
  const isClosed = isManuallyClosed || isTimeClosed;

  return (
    <MotiView
        from={{ opacity: 0, translateY: 50 }}   // start hidden + lower
        animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
        transition={{ duration: 1000 }}
        className='justify-end'
    >
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "../(routes)/home-single-store/",
          params: {
            store_id: store_id,
            store_profileimage: store_profileimage,
            store_coverimage: store_coverimage,
            store_name: store_name,
            store_description: store_description,
            store_phone_num: store_phone_num,
            open_close: open_close,
            store_latitude: latitude,
            store_longitude: longitude,
            store_location: store_location,
            store_category: store_category,
            average_rating: average_rating,
            total_ratings: total_ratings,
            favorited: favorited,
            open_time: open_time,
            closing_time: closing_time
          },
        })
      }
      style={{
        elevation: 0.5,
        borderWidth: 1,
        borderColor: COLORS.grey_bg,
        backgroundColor: "#fff",
        borderRadius: 5,
      }}
      activeOpacity={0.7}
      className="relative mt-6 pb-1"
    >
      <View className="w-full">
        <View className="w-full relative" style={[imageDimensions]}>
          <Image
            style={{ borderRadius: 5 }}
            className="w-full h-full"
            source={{ uri: `${STORES_IMAGE_URI}${store_coverimage}` }}
          />
          {isClosed &&
            <View className="absolute w-full h-full bg-black opacity-70 rounded-[3px] flex-row justify-center items-center z-50">
              <MaterialCommunityIcons
                name="lock"
                size={16}
                style={{ color: COLORS.primary }}
              />
              <Text
                style={{ fontFamily: "roboto-medium" }}
                className="text-sm text-white"
              >
                Closed
              </Text>
            </View>
          }

          <View className="left-2 absolute bg-white px-1 py-1 top-2 rounded-sm elevation-lg">
            <Text
              numberOfLines={2}
              className="text-primary text-sm"
              style={{
                fontFamily: "roboto-medium"
              }}
            >
              {store_category}
            </Text>
          </View>

          <TouchableOpacity className="absolute top-2 right-2 justify-center items-center h-[28px] bg-white w-[28px] rounded-full">
            <MaterialCommunityIcons
                name={!favorited ? "cards-heart-outline" : "cards-heart"}
                size={20}
                color={COLORS.primary}
            />
          </TouchableOpacity>
          <View
            className="absolute -bottom-4 left-2 rounded-full"
            style={{ height: 90, width: 90 }}
          >
            <Image
              style={{ }}
              className="w-full h-full rounded-full p-2 z-50 elevation-xl border-2 border-white"
              source={{ uri: `${STORES_IMAGE_URI}${store_profileimage}` }}
            />
          </View>
        </View>
        <View
          style={{ position: "absolute", right: 10, bottom: 45, zIndex: 500, borderWidth: 2, height: 28, borderColor: '#fff' }}
          className="flex-row bg-white elevation-md justify-center items-center px-2 py-1 rounded-2xl"
        >
          <Ionicons
            name={"star"}
            size={12}
            color={COLORS.primary}
          />
          <Text className="text-sm ml-1 text-green1" style={{ fontFamily: "roboto-medium" }}>
            {average_rating.toFixed(1)} ({total_ratings})
          </Text>
        </View>
        <View className="w-full mt-4">
          <View className="ml-2 flex-row items-center">
            {/* <FontAwesome5 name="store-alt" color={COLORS.green1} /> */}
            <Text
              numberOfLines={1}
              className="text-lg text-black ml-0.5"
              style={[textDimension]}
            >
              {store_name}
            </Text>
          </View>
          <View className="flex-row ml-2 items-center mt-1">
            <Ionicons
              name="location-outline"
              color={COLORS.primary}
              size={14}
            />
            <Text
              className="text-sm text-slate"
              style={{ fontFamily: "roboto" }}
            >
              {store_location}
            </Text>
            <View className="h-[5px] w-[5px] bg-slate rounded-full self-center justify-center mx-[13px]" />
            <View className="flex-row items-center justify-center self-center mr-1">
              <Text
                className="text-slate text-sm"
                style={{ fontFamily: "roboto" }}
              >
                {calculateDistance(pointA, pointB)}
              </Text>
            </View>
            <View className="h-[5px] w-[5px] bg-slate rounded-full self-center justify-center mx-[13px]" />
            <View className="flex-row items-center">
                <View className='mr-1'>
                  <MaterialCommunityIcons name="timer-settings" size={13} color={COLORS.slate} />
                </View>
                <View className='flex-row justify-between'>
                  <Text className='text-sm text-slate' style={{fontFamily: 'roboto'}}>30 - 45 min</Text>
                </View>
              </View>
          </View>
        </View>
      </View>
      {/* <View className="w-full my-4 rounded-full h-[1px] bg-slate opacity-10" /> */}
    </TouchableOpacity>
    </MotiView>
  );
};

export default MainContent;
