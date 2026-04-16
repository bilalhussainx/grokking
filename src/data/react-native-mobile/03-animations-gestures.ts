import { Module } from "../types";

export const module3: Module = {
  id: "animations-gestures",
  title: "Animations & Gestures with Reanimated",
  description: "Smooth 60fps animations with React Native Reanimated, gesture handling with RNGH, shared element transitions, and Lottie animations",
  lessons: [
    {
      id: "animations-gestures",
      slug: "animations-gestures",
      title: "Animations & Gesture Handling",
      content: `# Animations & Gestures in React Native

60fps animations are what separate native-feeling apps from janky web wrappers. React Native Reanimated runs animations on the UI thread — no JavaScript bridge bottleneck.

---

\`\`\`concept
{
  "title": "The JavaScript Bridge Problem",
  "variant": "mental-model",
  "content": "React Native's original Animated API runs on the JavaScript thread. Every frame, it sends position/opacity/scale values across the bridge to the native thread. At 60fps that's 60 messages per second — and if JS is busy (parsing, network), frames get dropped. Reanimated 2+ moves animation logic to the UI thread using worklets (JS functions that run natively). The bridge is never touched during animation. This is why Reanimated animations feel buttery smooth even on older phones."
}
\`\`\`

---

## Reanimated Basics

\`\`\`tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  Easing,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

// useSharedValue: like useState, but lives on UI thread
const opacity = useSharedValue(0);
const translateY = useSharedValue(50);

// useAnimatedStyle: derives animated style from shared values
const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
  transform: [{ translateY: translateY.value }],
}));

// Trigger animations:
function fadeIn() {
  opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) });
  translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
}

// Apply to Animated.View:
<Animated.View style={[styles.box, animatedStyle]}>
  <Text>Hello!</Text>
</Animated.View>

// withSpring: physics-based spring (natural feel)
// withTiming: duration + easing curve (predictable)
// withRepeat: loop animations
const rotation = useSharedValue(0);
rotation.value = withRepeat(
  withTiming(360, { duration: 1000, easing: Easing.linear }),
  -1,  // -1 = infinite
  false // false = don't reverse
);

const spinStyle = useAnimatedStyle(() => ({
  transform: [{ rotate: \`\${rotation.value}deg\` }],
}));
\`\`\`

## Gesture Handling with RNGH

\`\`\`tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

// Draggable card:
function DraggableCard() {
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    })
    .onEnd(() => {
      // Spring back to center:
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]} />
    </GestureDetector>
  );
}

// Pinch to zoom:
function ZoomableImage({ uri }: { uri: string }) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={pinchGesture}>
      <Animated.Image source={{ uri }} style={[styles.image, animatedStyle]} />
    </GestureDetector>
  );
}

// Compose gestures (simultaneous pan + pinch):
const composed = Gesture.Simultaneous(panGesture, pinchGesture);
\`\`\`

## interpolate: Value Mapping

\`\`\`tsx
// interpolate maps one range to another — perfect for parallax and scroll effects
import { interpolate, Extrapolation } from 'react-native-reanimated';

// Animated header that shrinks on scroll:
function AnimatedHeader({ scrollY }: { scrollY: Animated.SharedValue<number> }) {
  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 100],         // input range
      [200, 80],        // output range
      Extrapolation.CLAMP  // don't go below 80 or above 200
    );
    const opacity = interpolate(scrollY.value, [0, 50], [1, 0], Extrapolation.CLAMP);

    return { height, opacity };
  });

  return <Animated.View style={[styles.header, headerStyle]} />;
}

// Connect to ScrollView:
const scrollY = useSharedValue(0);
const scrollHandler = useAnimatedScrollHandler({
  onScroll: (event) => {
    scrollY.value = event.contentOffset.y;
  },
});

<Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
  <AnimatedHeader scrollY={scrollY} />
  {/* content */}
</Animated.ScrollView>
\`\`\`

## Lottie Animations

\`\`\`tsx
import LottieView from 'lottie-react-native';
import { useRef } from 'react';

// Lottie plays JSON animations exported from After Effects
// Free animations: lottiefiles.com

function LoadingAnimation() {
  return (
    <LottieView
      source={require('./assets/loading.json')}
      autoPlay
      loop
      style={{ width: 200, height: 200 }}
    />
  );
}

// Controlled playback:
function SuccessAnimation({ onComplete }: { onComplete: () => void }) {
  const animRef = useRef<LottieView>(null);

  return (
    <LottieView
      ref={animRef}
      source={require('./assets/success-checkmark.json')}
      autoPlay={false}
      loop={false}
      onAnimationFinish={onComplete}
      style={{ width: 150, height: 150 }}
    />
  );
}

// Trigger: animRef.current?.play();
\`\`\`

\`\`\`takeaways
["Reanimated worklets run on the UI thread — animation never touches the JS bridge, so it's always 60fps.", "useSharedValue is like useState but lives on the UI thread — use it for anything animated.", "withSpring for natural, physics-based feel; withTiming for precise, predictable animations.", "GestureDetector + Gesture.Pan() + useAnimatedStyle is the pattern for all gesture-driven animations.", "interpolate maps one value range to another — essential for scroll-driven animations like shrinking headers.", "Lottie plays After Effects JSON exports — use lottiefiles.com for free production-quality animations."]
\`\`\`
`,
    },
  ],
};
