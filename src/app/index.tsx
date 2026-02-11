import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import CardsList, { WalletItem } from '../components/CardsList';

const CARD_HEIGHT = 240;
const PASS_HEIGHT = CARD_HEIGHT * 2;

const cardSources = [
  require('../../assets/cards/BiltCard.png'),
  require('../../assets/cards/SapphireCard.png'),
  require('../../assets/cards/FreedomCard.png'),
  require('../../assets/cards/DebitCard.png'),
  require('../../assets/cards/UnitedCard.png'),
  require('../../assets/cards/AAACard.png'),
];

const passSources = [
  require('../../assets/passes/pass.png'),
];

export default function Index() {
  const items = useMemo<WalletItem[]>(() => {
    const cards: WalletItem[] = cardSources.map((source, i) => ({
      id: `card-${i}`,
      kind: 'card',
      source,
      height: CARD_HEIGHT,
    }));

    const passes: WalletItem[] = passSources.map((source, i) => ({
      id: `pass-${i}`,
      kind: 'pass',
      source,
      height: PASS_HEIGHT,
    }));

    return [...cards, ...passes];
  }, []);

  const activeCardIndex = useSharedValue<number | null>(null);
  const [activeIndexJS, setActiveIndexJS] = useState<number | null>(null);

  const activeItem = activeIndexJS == null ? null : items[activeIndexJS];
  const isPassActive = activeItem?.kind === 'pass';

  const nfcOpacity = useSharedValue(0);
  React.useEffect(() => {
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
            <Pressable style={styles.circleBtn}>
              <Ionicons name="add" size={22} color="#fff" />
            </Pressable>
            <Pressable style={styles.circleBtn}>
              <Ionicons name="search" size={20} color="#fff" />
            </Pressable>
            <Pressable style={styles.circleBtn}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
            </Pressable>
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
              source={require('../../assets/HoldNearReader-2.png')}
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
  screen: { flex: 1, backgroundColor: '#000' },

  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  title: { color: '#fff', fontSize: 44, fontWeight: '800', letterSpacing: -0.5 },
  actions: { flexDirection: 'row', gap: 12, paddingBottom: 6 },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },

  stackWrap: {
    flex: 1,
    paddingHorizontal: 18,
  },

  nfcArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 400, // adjust based on final pass size
    alignItems: 'center',
    justifyContent: 'center',
  },
  nfcGif: {
    width: 260,
    height: 260,
    marginBottom: 10,
  },
  nfcText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 28,
    fontWeight: '500',
  },
});