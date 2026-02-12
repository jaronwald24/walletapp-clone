import React, { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  clamp,
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type CardProps = {
  card: any;
  index: number;
  scrollY: SharedValue<number>;
  activeCardIndex: SharedValue<number | null>;
  cardHeight: number;
  cardWidth?: number;
  cardPeek: number;
  onActiveChange?: (nextIndex: number | null) => void;
  isPass?: boolean;
};

const Card = ({
  card,
  index,
  scrollY,
  activeCardIndex,
  cardHeight,
  cardWidth,
  cardPeek,
  onActiveChange,
}: CardProps) => {
  const { height: screenHeight } = useWindowDimensions();

  const baseStackOffsetY = index * cardPeek;
  const translateY = useSharedValue(baseStackOffsetY);

  useAnimatedReaction(
    () => scrollY.value,
    (current) => {
      translateY.value = clamp(
        baseStackOffsetY - current,
        -index * cardHeight,
        baseStackOffsetY,
      );
    },
  );

  useAnimatedReaction(
    () => activeCardIndex.value,
    (current, previous) => {
      if (current === previous) return;

      if (current == null) {
        translateY.value = withTiming(
          clamp(
            baseStackOffsetY - scrollY.value,
            -index * cardHeight,
            baseStackOffsetY,
          ),
          { duration: 450, easing: Easing.out(Easing.quad) },
        );
        return;
      }

      if (current === index) {
        translateY.value = withTiming(-20, {
          duration: 500,
          easing: Easing.out(Easing.quad),
        });
        return;
      }

      translateY.value = withTiming(screenHeight * 0.75 + index * 12, {
        duration: 500,
        easing: Easing.out(Easing.quad),
      });
    },
  );

  useEffect(() => {
    translateY.value = baseStackOffsetY;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardHeight, cardPeek]);

  const tap = Gesture.Tap().onEnd(() => {
    const next = activeCardIndex.value == null ? index : null;
    activeCardIndex.value = next;
    if (onActiveChange) runOnJS(onActiveChange)(next);
  });

  const resolvedWidth = cardWidth ?? "100%";

  return (
    <GestureDetector gesture={tap}>
      {/* Full-width absolute layer so centering is reliable */}
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: cardHeight,
          transform: [{ translateY }],
          alignItems: "center",
        }}
      >
        {/* Fixed-width centered frame */}
        <Animated.View
          style={{
            width: resolvedWidth,
            height: cardHeight,
            overflow: "hidden",
            shadowColor: "#fff",
            shadowOpacity: 0.15,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 3 },
          }}
        >
          <Animated.Image
            source={card}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default Card;
