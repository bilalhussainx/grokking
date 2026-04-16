import { Module } from "../types";

export const module1: Module = {
  id: "rn-fundamentals",
  title: "React Native Fundamentals",
  description: "React Native architecture, core components, StyleSheet API, flexbox layout, and how RN bridges to native iOS/Android",
  lessons: [
    {
      id: "rn-architecture",
      slug: "rn-architecture",
      title: "React Native: How It Works & Core Components",
      content: `# React Native: One Codebase, Two Platforms

React Native lets you write JavaScript that renders real native UI components — not a WebView, not a hybrid. The same component tree produces UIView on iOS and View on Android.

---

\`\`\`concept
{
  "title": "The New Architecture (Fabric + JSI)",
  "variant": "mental-model",
  "content": "Old RN: JavaScript → JSON bridge (serialization bottleneck) → Native. Slow for high-frequency updates. New Architecture (RN 0.73+): JSI (JavaScript Interface) allows JS to hold direct references to native objects. No serialization. Fabric renderer: concurrent mode, synchronous layout. TurboModules: lazy native module loading. Result: 60fps animations that weren't possible before."
}
\`\`\`

---

## Core Components (vs Web)

\`\`\`typescript
import React, { useState } from 'react';
import {
  View,          // div (layout container)
  Text,          // p/h1/span (ALL text must be in Text)
  TextInput,     // input[type=text]
  Image,         // img
  ScrollView,    // div with overflow:scroll
  FlatList,      // Virtualized list (use instead of ScrollView for long lists)
  TouchableOpacity, // button with press feedback
  Pressable,     // More flexible press handler (RN 0.63+)
  SafeAreaView,  // Respects notch/status bar
  StyleSheet,
  Platform,
} from 'react-native';

const HomeScreen: React.FC = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>React Native App</Text>

        {/* Image from URL */}
        <Image
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Image from local asset */}
        <Image source={require('./assets/logo.png')} style={styles.logo} />

        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}       // No event.target.value!
          placeholder="Type something..."
          placeholderTextColor="#999"
          returnKeyType="done"          // iOS keyboard return key
          keyboardType="email-address"  // 'numeric', 'phone-pad', etc.
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Pressable
          onPress={() => setCount(c => c + 1)}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,  // Visual feedback
          ]}
        >
          <Text style={styles.buttonText}>Count: {count}</Text>
        </Pressable>

        {/* Platform-specific rendering */}
        <Text>
          Running on: {Platform.OS === 'ios' ? 'iPhone' : 'Android'}
          {Platform.Version}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};
\`\`\`

## StyleSheet API & Flexbox

\`\`\`typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,                    // Fill available space
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 20,
    alignItems: 'center',       // Cross-axis (horizontal in column direction)
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginVertical: 20,         // Shorthand for marginTop + marginBottom
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// KEY DIFFERENCES from CSS:
// - No cascading styles (no inheritance)
// - No CSS units — all dimensions in density-independent pixels (dp)
// - flexDirection defaults to 'column' (not 'row' like web)
// - All Views are flexbox by default
// - No 'display: block/inline' — everything is flex
// - No shorthand 'margin: 8 16' — use marginVertical/marginHorizontal
\`\`\`

## FlatList: Virtualized Lists

\`\`\`typescript
import { FlatList, View, Text } from 'react-native';

type User = { id: string; name: string; email: string };

const UserList: React.FC<{ users: User[] }> = ({ users }) => (
  <FlatList
    data={users}
    keyExtractor={item => item.id}              // Required — key for reconciliation
    renderItem={({ item, index }) => (
      <View style={styles.userCard}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    )}
    ItemSeparatorComponent={() => (
      <View style={{ height: 1, backgroundColor: '#eee' }} />
    )}
    ListHeaderComponent={<Text style={styles.header}>All Users</Text>}
    ListEmptyComponent={<Text>No users found.</Text>}
    onEndReached={() => loadMoreUsers()}       // Infinite scroll
    onEndReachedThreshold={0.5}               // Trigger when 50% from bottom
    initialNumToRender={10}                   // Render only 10 initially
    maxToRenderPerBatch={10}
    windowSize={5}                            // Render 5 screens worth
  />
);

// FlatList is virtualized — only renders visible items.
// ScrollView renders ALL items immediately — don't use for > 20 items.
// SectionList: like FlatList but with section headers (use for grouped data)
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Why should you use FlatList instead of ScrollView for a list of 100+ items?",
      "options": [
        "FlatList has better styling options",
        "ScrollView renders all 100+ items simultaneously (memory/performance impact). FlatList is virtualized — only renders items currently visible on screen, recycling components as you scroll.",
        "ScrollView doesn't support onPress",
        "FlatList works on iOS only"
      ],
      "answer": 1,
      "explanation": "FlatList's virtualization is critical for performance. A ScrollView with 500 items renders 500 View components in memory immediately — causing slow initial render and high memory usage. FlatList renders only ~10-20 visible items at any time, recycling the components as the user scrolls. Rule of thumb: if your list could have more than 20 items, use FlatList or SectionList."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
