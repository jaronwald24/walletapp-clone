import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ScrollView,
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

type Transaction = {
  id: string;
  merchant: string;
  method: string;
  date: string;
  amount: string;
  icon: any;
};

const HARD_CODED_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    merchant: "FanDuel",
    method: "Apple Pay",
    date: "2/8/26",
    amount: "$20.00",
    icon: require("../../assets/txn/fanduel.png"),
  },
  {
    id: "tx-2",
    merchant: "FanDuel",
    method: "Apple Pay",
    date: "2/8/26",
    amount: "$400.00",
    icon: require("../../assets/txn/fanduel.png"),
  },
  {
    id: "tx-3",
    merchant: "FanDuel",
    method: "Apple Pay",
    date: "2/8/26",
    amount: "$20.00",
    icon: require("../../assets/txn/fanduel.png"),
  },
  {
    id: "tx-4",
    merchant: "DraftKings",
    method: "financial.draftkings.com",
    date: "1/19/26",
    amount: "$50.00",
    icon: require("../../assets/txn/draftkings.png"),
  },
  {
    id: "tx-5",
    merchant: "DraftKings",
    method: "financial.draftkings.com",
    date: "1/10/26",
    amount: "$30.00",
    icon: require("../../assets/txn/draftkings.png"),
  },
  {
    id: "tx-6",
    merchant: "DraftKings",
    method: "financial.draftkings.com",
    date: "12/30/25",
    amount: "$255.00",
    icon: require("../../assets/txn/draftkings.png"),
  },
];

function TransactionRow({ tx }: { tx: Transaction }) {
  return (
    <View style={styles.txRow}>
      <Image source={tx.icon} style={styles.txIcon} resizeMode="cover" />

      <View style={styles.txTextCol}>
        <Text style={styles.txMerchant}>{tx.merchant}</Text>
        <Text style={styles.txSub}>{tx.method}</Text>
        <Text style={styles.txSub}>{tx.date}</Text>
      </View>

      <View style={styles.txRight}>
        <Text style={styles.txAmount}>{tx.amount}</Text>
        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.35)" />
      </View>
    </View>
  );
}

function CardDetailTopBar({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.detailTopBar}>
      <Pressable
        onPress={onClose}
        hitSlop={12}
        style={({ pressed }) => [
          styles.detailCircleBtn,
          pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
        ]}
      >
        <Ionicons name="close" size={26} color="#fff" />
      </Pressable>

      <View style={styles.detailActions}>
        <Pressable
          hitSlop={10}
          style={({ pressed }) => [
            styles.detailCircleBtn,
            pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
          ]}
        >
          <View style={styles.cardBadgeWrap}>
            <Ionicons name="card-outline" size={27} color="#fff" />
          </View>
        </Pressable>

        <View style={styles.detailRightPill}>
          <Pressable
            hitSlop={10}
            style={({ pressed }) => [
              styles.detailPillBtn,
              pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Ionicons name="search" size={27} color="#fff" />
          </Pressable>
          <Pressable
            hitSlop={10}
            style={({ pressed }) => [
              styles.detailPillBtn,
              pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Ionicons name="ellipsis-horizontal" size={27} color="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
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

  const closeActive = () => {
    activeCardIndex.value = null;
    setActiveIndexJS(null);
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Top UI */}
      {activeItem?.kind === "card" ? (
        <CardDetailTopBar onClose={closeActive} />
      ) : (
        !isPassActive && (
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
        )
      )}

      {/* Card stack always mounted so the slide-up animation remains */}
      <View style={styles.stackWrap}>
        <CardsList
          items={items}
          activeCardIndex={activeCardIndex}
          onActiveChange={onActiveChange}
        />

        {/* Pass NFC overlay */}
        {isPassActive && (
          <Animated.View style={[styles.nfcArea, { opacity: nfcOpacity }]}>
            <Image
              source={require("../../assets/HoldNearReader-2.png")}
              style={styles.nfcGif}
              resizeMode="contain"
            />
          </Animated.View>
        )}

        {/* Card detail overlay (transactions) - sits BELOW the active card */}
        {activeItem?.kind === "card" && (
          <ScrollView
            style={styles.detailOverlay}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.detailOverlayContent}
          >
            <Text style={styles.detailSectionTitle}>Latest Transactions</Text>

            <View style={styles.txListCard}>
              {HARD_CODED_TRANSACTIONS.map((tx, idx) => (
                <View key={tx.id} style={idx === HARD_CODED_TRANSACTIONS.length - 1 ? styles.txRowLast : undefined}>
                  <TransactionRow tx={tx} />
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },

  header: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 50,
    flexDirection: "row",
    alignItems: "center",
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
    marginTop: 20,
    position: "relative",
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
// --- Card Detail Screen ---

  detailTopBar: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  detailActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  detailCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1c1c1e",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  detailRightPill: {
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

  detailPillBtn: {
    width: 52,
    height: 44,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  cardBadgeWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  cardBadge: {
    position: "absolute",
    right: 4,
    bottom: 6,
    paddingHorizontal: 6,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },

  cardBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  detailOverlay: {
    position: "absolute",
    top: 260, // card height (240) + a little breathing room; card itself animates up
    bottom: 0,

    // Match the same horizontal width as the card/header area
    width: "100%",
    alignSelf: "center",
  },

  detailOverlayContent: {
    width: "100%",
    paddingBottom: 24,
  },

  detailSectionTitle: {
    width: "100%",
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.4,
    marginTop: 18,
    marginBottom: 14,
  },

  txListCard: {
    width: "100%",
    flex: 1,
    borderRadius: 26,
    backgroundColor: "#1c1c1e",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    marginBottom: 10,
  },

  txRowLast: {
    // removes the divider on the last row
    borderBottomWidth: 0,
  },

  txRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  txIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  txTextCol: {
    flex: 1,
    gap: 2,
  },

  txMerchant: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  txSub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    fontWeight: "500",
  },

  txRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  txAmount: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
