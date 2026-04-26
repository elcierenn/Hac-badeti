import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const DEFAULT_TINT = '#E8C96A';
const CHEV_W = 12;
const CHEV_H = 20;
const STAGGER = -8;

type Direction = 'forward' | 'back';

type Axis = 'horizontal' | 'vertical';

type Props = {
  /** Sona doğru (sağa) / öncekine (sola) — yatayda; aşağı / yukarı — dikeyde */
  direction?: Direction;
  /** Yatay (varsayılan) veya dikey kaydırma ipucu */
  axis?: Axis;
  /** Ok rengi */
  tintColor?: string;
};

/**
 * Yatay veya dikey kaydırma yönü ipucu (yalnızca şekil, metin yok).
 */
export function SwipeScrollHint({ direction = 'forward', axis = 'horizontal', tintColor = DEFAULT_TINT }: Props) {
  const nudge = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const move = direction === 'forward' ? 10 : -10;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(nudge, {
          toValue: move,
          duration: 650,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }),
        Animated.timing(nudge, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }),
      ])
    );
    anim.start();
    return () => {
      nudge.stopAnimation();
      anim.stop();
    };
  }, [direction, nudge, axis]);

  const transform =
    axis === 'vertical'
      ? ([
          { rotate: direction === 'forward' ? '90deg' : '-90deg' } as const,
          { translateY: nudge },
        ] as const)
      : ([{ translateX: nudge }] as const);

  return (
    <View
      style={styles.frame}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View style={[styles.chevronRow, { transform: [...transform] }]}>
        {direction === 'forward' ? (
          <>
            <ForwardChevron color={tintColor} index={0} />
            <ForwardChevron color={tintColor} index={1} />
            <ForwardChevron color={tintColor} index={2} />
          </>
        ) : (
          <>
            <BackChevron color={tintColor} index={0} />
            <BackChevron color={tintColor} index={1} />
            <BackChevron color={tintColor} index={2} />
          </>
        )}
      </Animated.View>
    </View>
  );
}

function ForwardChevron({ color, index }: { color: string; index: number }) {
  return (
    <View
      style={[
        styles.chevRight,
        { borderLeftColor: color, marginLeft: index > 0 ? STAGGER : 0, opacity: 1 - index * 0.1 },
      ]}
    />
  );
}

function BackChevron({ color, index }: { color: string; index: number }) {
  return (
    <View
      style={[
        styles.chevLeft,
        { borderRightColor: color, marginLeft: index > 0 ? STAGGER : 0, opacity: 1 - index * 0.1 },
      ]}
    />
  );
}

const FRAME = 56;

const styles = StyleSheet.create({
  frame: {
    width: FRAME,
    height: FRAME,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 2.5,
    borderColor: 'rgba(255, 224, 150, 0.95)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 12,
  },
  chevronRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevRight: {
    width: 0,
    height: 0,
    borderTopWidth: CHEV_H / 2,
    borderBottomWidth: CHEV_H / 2,
    borderLeftWidth: CHEV_W,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  chevLeft: {
    width: 0,
    height: 0,
    borderTopWidth: CHEV_H / 2,
    borderBottomWidth: CHEV_H / 2,
    borderRightWidth: CHEV_W,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
});
