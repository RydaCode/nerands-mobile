import { Dimensions } from "react-native";
import Carticons from "./icons";
const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#E52F20",
  // primary: 'red',
  // primary: '#54C571',
  // primary: "#E0115F",
  white: "#fff",
  red: "red",
  coral: "coral",
  black: "#000",
  green2: "#32CD32",
  grey_bg: "#F3F4F8",
  // green: '#32CD32',
  green1: "rgba(5, 173, 117, 0.884)",
  navBtnBg: "#F6E7E6",
  // navBtnBg: '#DFF6E6',
  navBtnBgHome: "#DFF6E6",
  grey: "grey",
  lite: "lightgrey",
  grey_bg: "#F3F4F8",
  slate: "lightslategrey",
  transparent: "transparent",
  lavender: "lavender",
  transparentBlack: "rgba(0,0,0,0.5)",
  purple: "#7e22ce",
  extra_blue: "#2563EB",
};

const SIZES = {
  radius: 3,
  border: 5,
  h1: "500",
  h2: "600",
  h3: "700",
  h4: "800",
  h5: "900",
  round: 50,
  padding: 6,
  base: 10,
  large: 25,
  main: 16,
  medium: 14,
  small: 12,
  largeTitle: 40,
  mainTitles: 18,
  navBtn: 35,
  navBtnIcon: 17,

  // app dimensions
  width,
  height,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },

  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
};

export { Carticons, COLORS, height, SHADOWS, SIZES, width };

