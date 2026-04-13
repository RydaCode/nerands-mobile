@echo off
setlocal

echo ================================
echo 📦 Installing Compatible Packages for Expo SDK 52
echo ================================

:: Install compatible dependencies for Expo SDK 52
npm install ^
@mapbox/polyline@^1.2.1 ^
@react-native-async-storage/async-storage@1.23.1 ^
@react-native-community/datetimepicker@8.0.1 ^
@react-native-community/netinfo@11.3.1 ^
@react-native-picker/picker@2.7.5 ^
@reduxjs/toolkit@^2.7.0 ^
axios@^1.8.4 ^
expo-image-picker@~15.1.0 ^
expo-location@~17.0.1 ^
expo-secure-store@~13.0.2 ^
haversine-distance@^1.2.3 ^
nativewind@^4.1.23 ^
react-native-animatable@^1.4.0 ^
react-native-axios@^0.17.1 ^
react-native-bouncy-checkbox@^4.1.2 ^
react-native-dotenv@^3.4.11 ^
react-native-google-places-autocomplete@^2.5.7 ^
react-native-image-crop-picker@^0.42.0 ^
react-native-maps@1.14.0 ^
react-native-maps-directions@^1.9.0 ^
react-native-modal-datetime-picker@^18.0.0 ^
react-native-phone-call@^1.2.0 ^
react-native-star-rating-widget@^1.9.2 ^
react-native-toast-message@^2.3.0 ^
react-redux@^9.2.0 ^
tailwindcss@^3.4.17 ^
react-native-reanimated@2.9.1 ^
--legacy-peer-deps

echo ✅ All packages installed!
endlocal