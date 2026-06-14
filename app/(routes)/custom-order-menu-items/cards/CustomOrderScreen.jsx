import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity, View
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useDispatch, useSelector } from "react-redux";
import DeliveryOptions from "../../../../components/DeliveryOptions";
import DescriptionInput from "../../../../components/FormFields/DescriptionInput";
import FormInputs from "../../../../components/FormFields/FormInputs";
import { COLORS, SIZES } from "../../../../constants/constants";
import useApi from "../../../../hook/useApi";
import { clearProducts, clearStores } from "../../../../redux/store/slices/CustomOrdersCartSlice";
import { NERANDS_URI } from "../../../../RequestMethods";
import { toast } from "../../../../utils/toast";
import LoadingIndicator from "../../../LoadingIndicator";
import AddProductModal from "./AddProductModal";
import AddStoreModal from "./AddStoreModal";
import GetAvailableRunners from "./GetAvailableRunners";
import ViewCartModal from "./ViewCartModal";

const CustomOrderScreen = () => {
    const {
        user_id,
        user_type,
        email_add,
        first_name,
        last_name,
        phone_num,
        gender,
        date_of_birth,
        country,
        province,
        profile_image,
        is_transporter,
        is_runner,
    } = useSelector((state) => state.auth);

    const { width, height } = Dimensions.get("window");
    const buttonWidth = width * 0.4;
    const {
        latitude, longitude, displayCurrentLocation, locationServicesEnabled,
    } = useSelector((state) => state.location) || {}
    const router = useRouter();
    const [agreement, setAgreement] = useState(true);
    const [address, setAddress] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [handlingFee, setHandlingFee] = useState([]);
    const [openAddProduct, setOpenAddProduct] = useState(false);
    const [openAddStoreModal, setOpenAddStoreModal] = useState(false);
    const [viewCart, setViewCart] = useState(false);
    const products = useSelector((state) => state.customcart.products);
    const stores = useSelector((state) => state.customcart.custom_stores);
    const runnerdetails = useSelector(state => state.customcart.runner_details);
    const [availablerunners, setAvailableRunners] = useState(false);
    const [openAvailableRunnersModal, setOpenAvailableRunnersModal] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const dispatch = useDispatch();

    console.log("Runner details:", runnerdetails);

    useEffect(() => {
        if (errorMessage) {
            fadeAnim.setValue(1);

            const timer = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start(() => {
                    setErrorMessage("");
                });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const [delivery, setSelected] = useState(null);
    const charges = useSelector(state => state.delivery.charges);

    const [formData, setFormData] = useState({
        user_id: user_id,
        first_name: first_name,
        last_name: last_name,
        estimated_spend_amount: "",
        order_notes: "",
        recipients_full_names: "",
        receipients_phone_number: "",
        delivery_address_status: address,
        custom_order_latitude: latitude || 0,
        custom_order_longitude: longitude || 0,
        delivery_mode: delivery || null,
    });

    // API hook
    const runnerUrl = useMemo(() => {
        return `/runner/search?latitude=${latitude}&longitude=${longitude}`;
    }, [latitude, longitude]);

    const { 
        data: searchrunner,
        error: searchRunnerError,
        isLoading: searchLoading,
        get: getRunner,
     } = useApi(runnerUrl);

     useEffect(() => {
        getRunner();
    }, []);
    
    const {
        data: send,
        isLoading: makeOrderLoading,
        error: makeOrderError,
        post: makeOrderPost,
    } = useApi(`/customorders/make_order/`);
    
    const origin = useMemo(() => {
        if (latitude == null || longitude == null) return null;

        return {
            latitude: Number(latitude),
            longitude: Number(longitude)
        };
    }, [latitude, longitude]);

    const destination = useMemo(() => {
        if (!Array.isArray(searchrunner)) return null;

        return {
            latitude: Number(searchrunner[0]?.location_latitude),
            longitude: Number(searchrunner[0]?.location_longitude)
        };
    }, [searchrunner]);

    useEffect(() => {
        if (!locationServicesEnabled) {
            Alert.alert(
                "Location Services Disabled",
                "Please enable location services to proceed.",
            );
        }
    }, [locationServicesEnabled]);

    useEffect(() => {
        if (!searchrunner || searchrunner?.length === 0) return;
        if (searchrunner?.length) {
            setFormData((prev) => ({
                ...prev,
                runner_location: searchrunner[0]?.location ?? prev.location,
                delivery_mode: delivery,
                runner_id: searchrunner[0]?.runner_id || prev.runner_id
            }));
        }
    }, [
        latitude,
        longitude,
        searchrunner,
        delivery
    ]);

    const calculateServiceFee = (amount) => {
        let percent = charges?.charge_percent ?? 15;

        if (amount > 500) percent -= 4;
        else if (amount > 300) percent -= 3;
        else if (amount > 100) percent -= 2;

        const fee = +(amount * (percent / 100)).toFixed(2);

        // Cap the service fee at 150
        return Math.min(fee, 150);
    };

    const handleChangeText = useCallback((key, value) => {
        setFormData((prev) => {
            if (key === "estimated_spend_amount") {
                const spendAmount = parseFloat(value.toString().trim()) || 0;
                return {
                    ...prev,
                    estimated_spend_amount: Math.round(spendAmount),
                    service_fee: Math.round(calculateServiceFee(spendAmount)),
                };
            }
            return {
                ...prev,
                [key]: typeof value === "string" ? value.trimStart() : value,
            };
        });
    }, []);

    const normalizePhone = (raw) => {
        if (!raw) return "";

        // Remove all non-digit characters (spaces, +, -, etc.)
        const digits = raw.toString().replace(/\D/g, "");

        // Handle Zambian numbers with or without international prefix
        if (digits.startsWith("260")) {
            // "26097xxxxxxx" → "097xxxxxxx"
            return "0" + digits.slice(3, 12);
        }

        if (digits.startsWith("00260")) {
            // "0026097xxxxxxx" → "097xxxxxxx"
            return "0" + digits.slice(5, 14);
        }

        // Already valid local format
        if (digits.startsWith("0") && digits.length === 10) {
            return digits;
        }

        // Missing leading zero
        if (digits.length === 9) {
            return "0" + digits;
        }

        // Fallback
        return digits;
    };

    const validPrefixes = new Set([
        "0970", "0971", "0972", "0973", "0974", "0975", "0976", "0977", "0978", "0979", //Airtel
        "0770", "0771", "0772", "0773", "0774", "0775", "0776", "0777", "0778", "0779", //Airtel
        "0960", "0961", "0962", "0963", "0964", "0965", "0966", "0967", "0968", "0969", //MTN
        "0760", "0761", "0762", "0763", "0764", "0765", "0766", "0767", "0768", "0769", //MTN
        "0950", "0951", "0952", "0953", "0954", "0955", "0956", "0957", "0958", "0959", //Zamtel
        "0750", "0751", "0752", "0753", "0754", "0755", "0756", "0757", "0758", "0759", //Zamtel
        '0980', '0981', '0982', '0983', '0984', '0985', '0986', '0987', '0988', '0989' //Zedmobile
    ]);

    const grandTotal = useMemo(() => {
        const spend = Number(formData.estimated_spend_amount || 0);
        const serviceFee = Number(formData.service_fee || 0);
        const deliveryFee = Number(delivery?.fee || 0); // ✅ SAFE

        return spend + serviceFee + deliveryFee;
    }, [formData.estimated_spend_amount, formData.service_fee, delivery]);

    const openTerms = () => {
        Linking.openURL(`${NERANDS_URI}/terms`);
    };

    // Delivery Modes and Fees
    const DeliveryOptionList = useMemo(() => {
        if (searchLoading) {
            return (
                <View className='justify-center items-center bg-grey_bg rounded-md p-4'>
                    <ActivityIndicator size={30} color={COLORS.primary} />
                    <Text
                        className='text-base text-green2'
                        style={{fontFamily: 'roboto-medium'}}
                    >Fetching delivery data, please wait...</Text>
                </View>
            );
        } else if (!searchrunner || !Array.isArray(searchrunner)) {
            return (
                <View className='justify-center items-center bg-grey_bg rounded-md p-4 elevation-sm border border-lavender'>
                    <Text
                        className='text-sm text-red'
                        style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}
                    >⚠️ No runners are currently available. A runner will be assigned, and the delivery fee will be calculated by the third-party courier company.</Text>

                    <TouchableOpacity
                        className='bg-green1 flex-row justify-center items-center mt-4 rounded elevation-sm py-3 px-8'
                        onPress={getRunner}
                        disabled={searchLoading}
                    >
                        <MaterialCommunityIcons name="reload" size={22} color="white" />
                        <Text className='text-white text-base' style={{fontFamily: 'roboto-medium'}}>Refresh</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <>
                <View className='flex-row justify-center items-center mb-6'>
                    <Text className='text-base text-green1' style={{fontFamily: 'roboto-medium'}}>
                        <Text className='text-black'>Est. Budget:{" "}</Text>K{Number(formData.estimated_spend_amount || 0).toLocaleString()}
                    </Text>
                    <Text className='mx-3 text-slate text-xl'>|</Text>
                    <Text className='text-base text-primary' style={{fontFamily: 'roboto-medium'}}>
                        <Text className='text-black'>Delivery Fee:{" "}</Text>K{delivery?.fee ?? 0}
                    </Text>
                </View>
                <View className="flex-row items-center justify-between mb-5">
                    <Text
                        className="text-2xl"
                        style={{ fontFamily: "maven-medium" }}
                    >
                        Est. Grand Total:
                    </Text>
                    <View className="bg-red items-center justify-center"
                        style={{
                            padding: 4,
                            borderRadius: SIZES.radius,
                            width: buttonWidth,
                            height: height * 0.06,
                        }}
                    >
                        <Text style={{ fontFamily: "ubuntu-medium" }} className="text-xl text-white">
                            K{grandTotal.toLocaleString()}
                        </Text>
                    </View>
                </View>

                <View className="w-full my-6">
                    <Text className="text-black text-lg" style={{ fontFamily: 'roboto-bold' }}>
                        Delivery Options
                    </Text>

                    {(!delivery || searchLoading) && (
                        <Text className="text-slate text-sm my-2" style={{ fontFamily: 'roboto-medium' }}>
                            Fetching delivery options…
                        </Text>
                    )}

                    <DeliveryOptions
                        origin={origin}
                        destination={destination}
                        onSelectMode={setSelected}
                    />

                    {delivery && (
                        <Text>
                            Selected: {delivery?.mode} - K{delivery?.fee ?? 0}
                        </Text>
                    )}
                </View>
            </>
        );
    }, [searchrunner, origin, destination, delivery, grandTotal, searchLoading]);

    const handleMakeCustomOrder = async () => {
        // If sending to a different address, require recipient name
        if (address) {
            const recipient = (formData.recipients_full_names || "")
                .toString()
                .trim();
            if (!recipient) {
                setErrorMessage("Please enter recipient's name!");
                toast.error("Please enter recipient's name!");
                return;
            }
        }

        // estimated_spend_amount should be numeric
        const spend = Number(formData.estimated_spend_amount || 0);
        if (!spend) {
            toast.error("Please expected to be spent!");
            setErrorMessage("Please expected to be spent!");
            return;
        }

        // Package size
        if (handlingFee?.length === 0) {
            toast.error("Select package size!");
            setErrorMessage("Select package size!");
            return;
        }

        if (spend < 50) {
            toast.error("Orders less than K50 are not taken!");
            setErrorMessage("Orders less than K50 are not taken!");
            return;
        }

        // custom_products must exist and have at least one non-empty string
        if (products.length === 0) {
            toast.error("Please enter at least one product.");
            setErrorMessage("Please enter at least one product.");
            return;
        }

        // If address specified, validate phone
        if (address) {
            const rawPhone = formData.receipients_phone_number;

            if (rawPhone === null || rawPhone === '') {
                toast.error("Please enter recipient's phone number!");
                setErrorMessage("Please enter recipient's phone number!");
                return;
            }

            const phone = normalizePhone(rawPhone).trim();

            const prefix = phone.substring(0, 4);
            if (!validPrefixes.has(prefix)) {
                toast.error("Phone number must start with a valid prefix (e.g: 0971)!");
                setErrorMessage("Phone number must start with a valid prefix (e.g: 0971)!");
                return;
            }

            if (!/^\d{10}$/.test(phone)) {
                toast.error("Enter a valid 10-digit phone number (e.g. 097XXXXXXXX).");
                setErrorMessage("Enter a valid 10-digit phone number (e.g. 097XXXXXXXX).");
                return;
            }
        }

        // final payload ensure correct types
        const payload = {
            ...formData,
            custom_products: products,
            custom_stores: stores,
            estimated_spend_amount: spend,
            handling_fee_data: handlingFee,
            runner_location:
                Array.isArray(searchrunner) && searchrunner.length > 0
                    ? searchrunner[0]?.location
                    : runnerdetails?.runner_location,

            runner_id:
                Array.isArray(searchrunner) && searchrunner.length > 0
                    ? searchrunner[0]?.runner_id
                    : runnerdetails?.runner_id,
        };

        try {
            await makeOrderPost(payload);

            // Optionally you can set a local loading state if your hook doesn't expose it.
        } catch (err) {
            console.error("Order creation failed:", err);
            toast.error("An error occurred while creating the order. Please try again.");
            setErrorMessage("An error occurred while creating the order. Please try again.");
        }
    };

    useEffect(() => {
        if (send?.success) {
            toast.success(send.message);
            setErrorMessage(send.message);
            dispatch(clearProducts());
            dispatch(clearStores());
            setTimeout(() => {
                router.back();
                setRedirect(true);
            }, 4500);
        } else if (send && send.message && !send.success) {
            toast.error(send.message);
            setErrorMessage(send.message);
        }

        if (makeOrderError) {
            toast.error("An error occurred. Please try again.");
            setErrorMessage("An error occurred. Please try again.");
        }

        // ✅ reset to prevent retrigger
        return () => {
            setErrorMessage("");
        };
    }, [send, makeOrderError]);

    useEffect(() => {
        setFormData((prev) => ({ ...prev, delivery_address_status: address }));
    }, [address]);

    useEffect(() => {
        if (searchLoading) return;

        const noRunners =
            !Array.isArray(searchrunner) ||
            searchrunner.length === 0;

        setOpenAvailableRunnersModal(noRunners);
    }, [searchrunner, searchLoading]);

    if (redirect) {
        return <Redirect />;
    }

    // Display shimmer effect while loading
    //   if (runnerloading) {
    //     return (
    //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //         {/* Add shimmer effect to relevant UI elements */}
    //         <ShimmerPlaceholder style={{ height: 200, width: '100%', marginBottom: 10 }} />
    //         <ShimmerPlaceholder style={{ height: 50, width: '80%', marginBottom: 10 }} />
    //         <ShimmerPlaceholder style={{ height: 50, width: '80%' }} />
    //       </View>
    //     );
    //   }

    const amount = Number(formData.estimated_spend_amount || 0);

    return (
        <View className="relative">
            {/* Start available runners modal */}
            <GetAvailableRunners
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                openAvailableRunnersModal={openAvailableRunnersModal}
                setOpenAvailableRunnersModal={setOpenAvailableRunnersModal}
                user_phone_num={phone_num}
            />
            {/* End available runners modal */}

            {/* Start add products Modal */}
            <AddProductModal
                setOpenAddProduct={setOpenAddProduct}
                openAddProduct={openAddProduct}
                setViewCart={setViewCart}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
            />
            {/* End of add products modal */}

            {/* Start shopping list modal */}
            <ViewCartModal
                viewCart={viewCart}
                setViewCart={setViewCart}
                setOpenAddProduct={setOpenAddProduct}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                estimatedBudget={Number(formData.estimated_spend_amount || 0)}
                serviceCharge={charges?.serviceCharge}
                serviceFee={formData.service_fee}
                delivery={delivery}
                handlingFee={handlingFee}
                setHandlingFee={setHandlingFee}
                handleMakeOrder={handleMakeCustomOrder}
                makeOrderLoading={makeOrderLoading}
                makeOrderError={makeOrderError}
                setOpenAddStoreModal={setOpenAddStoreModal}
            />
            {/* End of shopping list modal */}

            {/* Start add store modal */}
            <AddStoreModal
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                openAddStoreModal={openAddStoreModal}
                setOpenAddStoreModal={setOpenAddStoreModal}
            />
            {/* End of add store modal */}

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" >
                <View className="">
                    <View className="my-6">
                        <Text className="text-sm text-slate" style={{fontFamily: 'roboto-medium', textAlign: "justify"}}>
                            Create custom orders by sharing your specific needs with us. We’ll
                            source the items for you and deliver them straight to your doorstep.
                        </Text>
                    </View>
                    <View className="w-full mb-8 mt-4">
                        <Text className="text-sm mb-2 text-slate" style={{fontFamily: 'roboto-medium', textAlign: "justify"}}>
                            Please let us know which stores we can source your items from (The more stores you add the higher the handling fee). Example: Shoprite, Pick n Pay.
                        </Text>
                        <TouchableOpacity
                            className="py-2 elevation-sm rounded w-full flex-row justify-center items-center"
                            onPress={() => setOpenAddStoreModal(true)}
                            style={{ backgroundColor: COLORS.extra_blue }}
                        >
                            <Entypo name="plus" size={24} color="white" />
                            <Text className='text-2xl text-white ml-1'
                                style={{fontFamily: 'roboto-medium'}}
                            >Add Stores</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View className="my-5">
                        <BouncyCheckbox
                            isChecked={address}
                            onPress={(text) => {
                                setAddress(text);
                            }}
                            text="Are you sending to a different address?"
                            textStyle={{
                                textDecorationLine: "none",
                                color: COLORS.black,
                                fontWeight: 'bold',
                                marginLeft: -10,
                                fontSize: 13,
                            }}
                            size={22}
                            fillColor={COLORS.primary}
                            iconStyle={{ borderColor: COLORS.primary, borderRadius: 2, borderWidth: 2 }}
                            innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                        />
                    </View>
                    {address && (
                        <>
                            <FormInputs
                                title="Recipient's names"
                                placeholder=""
                                handleChangeText={(value) => 
                                    handleChangeText("recipients_full_names", value)
                                }
                                borderStyle="border border-[#E2E8F0]"
                                lines={2}
                                desc="Please ensure that you provide the correct recipient name."
                            />
                            <FormInputs
                                title="Recipient's Number"
                                placeholder=""
                                handleChangeText={(value) => 
                                    handleChangeText("receipients_phone_number", value)
                                }
                                keyboardType='numeric'
                                borderStyle="border border-[#E2E8F0]"
                                lines={1}
                                desc="Please ensure that you provide the correct number."
                            />
                        </>
                    )}
                    <FormInputs
                        title="Estimated. Budget"
                        placeholder=""
                        handleChangeText={(value) => 
                            handleChangeText("estimated_spend_amount", value)
                        }
                        keyboardType='numeric'
                        borderStyle="border border-[#E2E8F0]"
                        lines={4}
                        desc="Please provide an estimate of how much you expect to spend on this order."
                    />

                    <View className='justify-center items-center'>
                        {amount > 0 && amount < 50 && (
                            <Text className='text-red text-sm mb-4' style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}>
                                Minimum order is K50. Please add items worth K{(50 - amount).toFixed(0)} or more to ensure that this order is accepted.
                            </Text>
                        )}
                    </View>

                    <View className="w-full">
                        <TouchableOpacity
                            onPress={() => setOpenAddProduct(true)}
                            className="flex-row bg-green1 elevation-lg w-full justify-center items-center p-2 mb-4 rounded"
                        >
                            <Entypo name="plus" size={24} color={COLORS.white}/>
                            <Text
                                className="text-white text-2xl"
                                style={{ fontFamily: "roboto-medium" }}
                            >
                                Add Products
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <DescriptionInput
                        title="Order Notes (Optional)"
                        handleChangeText={(value) => 
                            handleChangeText("order_notes", value)
                        }
                        desc="Any special instructions? (e.g. brand preference, substitutions)"
                        otherStyles="text-base"
                        borderStyle="border border-[#E2E8F0] rounded-md"
                        lines={4}
                    />

                    <View className="w-full">
                        <View className="mb-3">
                            <View>
                                <Text className="text-primary font-bold">NOTE</Text>
                                <Text style={{ fontFamily: "roboto-medium" }} className="text-sm">
                                    A service charge of{" "}
                                <Text className="text-red" style={{textAlign: "justify"}}>{charges?.serviceCharge}%</Text> will be applied.
                                    The delivery fee will be charged separately.
                                </Text>

                                <Text style={{ fontFamily: "roboto-medium", textAlign: "justify" }} className="text-sm mt-2">
                                    The service charge shown is based on your estimated order amount. The final charge
                                    will be adjusted according to the actual amount spent.
                                </Text>

                                <Text className="text-sm mt-2" style={{ fontFamily: "roboto-medium", textAlign: "justify" }}>
                                    For more details, please refer to{" "}
                                    <Text className="text-primary underline">Terms and Conditions</Text>.
                                </Text>
                            </View>
                            <View className='w-full justify-center items-center'>
                                <Text
                                    className="text-red mt-6 text-base"
                                    style={{ fontFamily: "roboto-medium" }}
                                >
                                    <Text className='text-black'>Service Charge ({charges?.serviceCharge}%):{" "}</Text>
                                    K{formData.service_fee}
                                </Text>
                            </View>
                        </View>

                        <View className="w-full">
                            {/* Delivery Options goes here */}
                            {DeliveryOptionList}
                        </View>
                        <View className="my-3">
                            <Text className="text-sm" style={{ fontFamily: "roboto-medium", textAlign: "justify" }}>
                                Please ensure that all the information provided above is accurate to avoid
                                any delays in processing and delivering your order.
                            </Text>
                        </View>
                        <View className="mb-3">
                            <Text
                                style={{ fontFamily: "roboto-bold", textAlign: "justify" }}
                                className="text-slate"
                            >
                                Orders with incomplete or unclear information may be cancelled.
                            </Text>
                        </View>
                        
                        <Text
                            className="text-slate text-sm"
                            style={{ fontFamily: "roboto-medium", textAlign: "justify" }}
                        >
                            By pressing the order button, you agree to the terms and
                            conditions of the Nerands.
                        </Text>
                        <View className="my-5 flex-row items-center">
                            <BouncyCheckbox
                                isChecked={true}
                                onPress={(text) => { setAgreement(text) }}
                                // text="I agree"
                                disableText
                                textStyle={{
                                    textDecorationLine: "none",
                                    color: COLORS.slate,
                                    marginLeft: -10,
                                    fontSize: 13,
                                }}
                                size={20}
                                fillColor={COLORS.primary}
                                iconStyle={{ borderColor: COLORS.primary, borderRadius: 2 }}
                                innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                            />

                            <TouchableOpacity
                                className='ml-2'
                                onPress={openTerms}
                            >
                                <Text
                                    className='text-slate'
                                    style={{fontFamily: 'roboto-medium'}}
                                >Open terms</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <View className='pb-20' /> */}
                    <View className="w-full justify-center items-center my-4">
                        <View className="w-full justify-center items-center my-4">
                            {errorMessage ? (
                                <Animated.Text
                                    style={{
                                        opacity: fadeAnim,
                                        fontFamily: "roboto-medium",
                                    }}
                                    className={`text-sm ${
                                        errorMessage === "Success"
                                            ? "text-green2"
                                            : "text-red"
                                    }`}
                                >
                                    {errorMessage === "Success"
                                        ? "Please wait..."
                                        : errorMessage}
                                </Animated.Text>
                            ) : null}
                        </View>
                    </View>
                </View>
            </ScrollView>
            
            <View className="">
                {/* <TouchableOpacity
                    className={`py-3 w-full justify-center items-center bg-primary rounded elevation-sm border-white ${
                        makeOrderLoading || !agreement || (amount > 0 && amount < 50)
                        ? "opacity-50"
                        : "opacity-100"
                    }`}
                    onPress={handleMakeCustomOrder}
                    disabled={makeOrderLoading || !agreement || (amount > 0 && amount < 50)}
                >
                    <Text
                        className='text-2xl text-white'
                        style={{fontFamily: 'ubuntu-medium'}}
                    >
                        {makeOrderLoading ? "Placing order..." : "Order Now"}
                    </Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    className='flex-row w-full elevation-lg bg-red justify-between px-2 items-center rounded py-3'
                    style={{}}
                    onPress={() => setViewCart(true)}
                >
                    <View
                        className='bg-white ml-2 rounded-full justify-center items-center'
                        style={{width: 30, height: 30}}
                    >
                        <Text className='text-primary'>{products?.length}</Text>
                    </View>
                    <View className='flex-row items-center'>
                        <Ionicons name="basket" size={27} color="white" />
                        <Text
                            className='text-2xl text-white'
                            style={{fontFamily: 'ubuntu-medium'}}
                        >View Cart</Text>
                    </View>
                    <View
                        className='bg-white ml-2 rounded justify-center items-center px-3'
                        style={{height: 30}}
                    >
                        <Text className='text-primary'>K{products?.length}</Text>
                    </View>
                </TouchableOpacity>

                {/* <CustomButton
                    title={makeOrderLoading ? "Placing order..." : "Order Now"}
                    handlePress={handleMakeCustomOrder}
                    disabled={makeOrderLoading || !agreement || (amount > 0 && amount < 50)}
                    otherStyles={`bg-primary p-4 ${
                        makeOrderLoading || !agreement || (amount > 0 && amount < 50)
                        ? "opacity-50"
                        : "opacity-100"
                    }`}
                    textStyles="text-2xl"
                /> */}
            </View>
            {makeOrderLoading && (
                <LoadingIndicator loading_text="Placing custom order..." />
            )}
            
            {/* {searchLoading && (
                <LoadingIndicator loading_text="Fetching runner data..." />
            )} */}
            
            <View className="w-full justify-center items-center my-4">
                {errorMessage ? (
                    <Animated.Text
                        style={{
                            opacity: fadeAnim,
                            fontFamily: "roboto-medium",
                        }}
                        className={`text-sm ${
                            errorMessage === "Success"
                                ? "text-green2"
                                : "text-red"
                        }`}
                    >
                        {errorMessage === "Success"
                            ? "Please wait..."
                            : errorMessage}
                    </Animated.Text>
                ) : null}
            </View>
            <View className="pb-12" />
        </View>
    );
};

export default CustomOrderScreen;