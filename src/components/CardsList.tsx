import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  clamp,
  SharedValue,
  useSharedValue,
  withClamp,
  withDecay,
} from 'react-native-reanimated';
import Card from './Card';

export type WalletItem = {
  id: string;
  kind: 'card' | 'pass';
  source: any;
  height: number;
};

const CARD_PEEK = 58;

type Props = {
  items: WalletItem[];
  activeCardIndex: SharedValue<number | null>;
  onActiveChange?: (nextIndex: number | null) => void;
};

export default function CardsList({ items, activeCardIndex, onActiveChange }: Props) {
  const { height: screenHeight } = useWindowDimensions();

  // keep scroll stable even with mixed heights
  const maxItemHeight = Math.max(...items.map((i) => i.height), 240);
  const contentHeight = maxItemHeight + (items.length - 1) * CARD_PEEK;

  const scrollY = useSharedValue(0);
  const maxScrollY = Math.max(0, contentHeight - screenHeight + 140);

  const pan = Gesture.Pan()
    .onBegin(() => cancelAnimation(scrollY))
    .onChange((event) => {
      scrollY.value = clamp(scrollY.value - event.changeY, 0, maxScrollY);
    })
    .onEnd((event) => {
      scrollY.value = withClamp(
        { min: 0, max: maxScrollY },
        withDecay({ velocity: -event.velocityY })
      );
    });

  return (
    <GestureDetector gesture={pan}>
      <View style={{ height: contentHeight, position: 'relative' }}>
        {items.map((item, index) => (
          <Card
            key={item.id}
            card={item.source}
            index={index}
            scrollY={scrollY}
            activeCardIndex={activeCardIndex}
            cardHeight={item.height}
            cardPeek={CARD_PEEK}
            onActiveChange={onActiveChange}
          />
        ))}
      </View>
    </GestureDetector>
  );
}