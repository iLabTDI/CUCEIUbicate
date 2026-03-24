import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const SCREEN_DIMENSIONS = {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    ICON_SIZE: SCREEN_WIDTH * 0.15,
    isTablet: SCREEN_WIDTH >= 768,
};

export const { SCREEN_WIDTH: SW, SCREEN_HEIGHT: SH } = SCREEN_DIMENSIONS;
export const { isTablet } = SCREEN_DIMENSIONS;