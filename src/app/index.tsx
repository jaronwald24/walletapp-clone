import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import CardsList, { WalletItem } from "../components/CardsList";

type HeaderButtonVariant = "circle" | "pillIcon";

type HeaderButtonProps = {
  icon: "add" | "search" | "ellipsis-horizontal";
  size: number;
  onPress?: () => void;
  variant?: HeaderButtonVariant;
};

function HeaderButton({ icon, size, onPress, variant = "circle" }: HeaderButtonProps) {
  const isCircle = variant === "circle";

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [
        isCircle ? styles.headerCircleBtn : styles.headerPillIconBtn,
        pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
      ]}
    >
      <Ionicons name={icon} size={size} color="#fff" />
    </Pressable>
  );
}

type HeaderPillProps = {
  children: React.ReactNode;
};

function HeaderPill({ children }: HeaderPillProps) {
  return <View style={styles.headerPill}>{children}</View>;
}

const PASS_RATIO = 1.45;

const CARD_HEIGHT = 240;
const H_PADDING = 18 * 2;

const cardSources = [
  require("../../assets/cards/BiltCard.png"),
  require("../../assets/cards/SapphireCard.png"),
  require("../../assets/cards/FreedomCard.png"),
  require("../../assets/cards/DebitCard.png"),
  require("../../assets/cards/UnitedCard.png"),
];

const passSources = [
  require("../../assets/passes/ID5.png"),
];

export default function Index() {
  const { width: screenWidth } = useWindowDimensions();

  const ITEM_WIDTH = screenWidth - H_PADDING;

  const items = useMemo<WalletItem[]>(() => {
    const passHeight = ITEM_WIDTH * PASS_RATIO;

    const cards: WalletItem[] = cardSources.map((source, i) => ({
      id: `card-${i}`,
      kind: "card",
      source,
      height: CARD_HEIGHT,
      width: ITEM_WIDTH,
    }));

    const passes: WalletItem[] = passSources.map((source, i) => ({
      id: `pass-${i}`,
      kind: "pass",
      source,
      height: passHeight,
      width: ITEM_WIDTH,
    }));

    return [...cards, ...passes];
  }, [ITEM_WIDTH]);

  const activeCardIndex = useSharedValue<number | null>(null);
  const [activeIndexJS, setActiveIndexJS] = useState<number | null>(null);

  const activeItem = activeIndexJS == null ? null : items[activeIndexJS];
  const isPassActive = activeItem?.kind === "pass";

  const nfcOpacity = useSharedValue(0);
  useEffect(() => {
    nfcOpacity.value = withTiming(isPassActive ? 1 : 0, { duration: 250 });
  }, [isPassActive]);

  const onActiveChange = (next: number | null) => {
    setActiveIndexJS(next);
  };

  return (
    <SafeAreaView style={styles.screen}>
      {!isPassActive && (
        <View style={styles.header}>
          <Text style={styles.title}>Wallet</Text>

          <View style={styles.actions}>
            <HeaderButton icon="add" size={30} />

            <HeaderPill>
              <HeaderButton icon="search" size={27} variant="pillIcon" />
              <HeaderButton icon="ellipsis-horizontal" size={27} variant="pillIcon" />
            </HeaderPill>
          </View>
        </View>
      )}

      <View style={styles.stackWrap}>
        <CardsList
          items={items}
          activeCardIndex={activeCardIndex}
          onActiveChange={onActiveChange}
        />
        {isPassActive && (
          <Animated.View style={[styles.nfcArea, { opacity: nfcOpacity }]}>
            <Image
              source={require("../../assets/HoldNearReader-2.png")}
              style={styles.nfcGif}
              resizeMode="contain"
            />
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },

  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 6,
  },

  stackWrap: {
    flex: 1,
    paddingHorizontal: 18,
  },

  nfcArea: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 430, // adjust based on final pass size
    alignItems: "center",
    justifyContent: "center",
  },
  nfcGif: {
    width: 260,
    height: 260,
    marginBottom: 10,
  },
  nfcText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 28,
    fontWeight: "500",
  },

  // --- Wallet-style header controls (match iOS look) ---
  headerCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",

    // iOS Wallet-like dark control
    backgroundColor: "#1c1c1e",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",

    // subtle highlight ring
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  headerPill: {
    height: 44,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "#1c1c1e",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",

    minWidth: 110,

    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  headerPillIconBtn: {
    width: 52,
    height: 44,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
