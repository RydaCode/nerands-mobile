import * as Linking from "expo-linking";
import * as StoreReview from "expo-store-review";

export const requestAppReview = async () => {
  try {
    console.log("Checking availability...");

    const isAvailable = await StoreReview.isAvailableAsync();

    console.log("Available:", isAvailable);

    if (isAvailable) {
      console.log("Requesting review...");
      await StoreReview.requestReview();
      console.log("Review request finished");
    } else {
      console.log("Opening Play Store...");
      await Linking.openURL(
        "market://details?id=com.nerands.marketplace"
      );
    }
  } catch (e) {
    console.log("Error:", e);
  }
};