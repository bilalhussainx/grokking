import { Module } from "../types";

export const module2: Module = {
  id: "navigation-state",
  title: "Navigation, State Management & Native APIs",
  description: "React Navigation v6, Expo Router, Zustand for state, AsyncStorage, camera, push notifications, and deploying to App Store",
  lessons: [
    {
      id: "navigation-deployment",
      slug: "navigation-deployment",
      title: "Navigation, State & Deploying to Stores",
      content: `# Navigation, State & Deployment

React Native apps need navigation between screens, persistent state, native device APIs, and eventually App Store submission. This module covers the full journey.

---

## React Navigation v6

\`\`\`typescript
// Install:
// npm install @react-navigation/native @react-navigation/native-stack
// npm install react-native-screens react-native-safe-area-context

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Define your route params (TypeScript):
type RootStackParamList = {
  Home: undefined;
  UserDetail: { userId: string; name: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator();

// Bottom tab navigator (inner):
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0ea5e9',
        tabBarStyle: { borderTopWidth: 0, elevation: 0 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Root navigator:
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserDetail"
          component={UserDetailScreen}
          options={({ route }) => ({ title: route.params.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Navigate between screens:
// In a component:
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

function HomeScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Pressable onPress={() => nav.navigate('UserDetail', { userId: '1', name: 'Alice' })}>
      <Text>Go to Alice</Text>
    </Pressable>
  );
}

function UserDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'UserDetail'>>();
  const { userId, name } = route.params;  // Fully typed!
  return <Text>User: {name} (ID: {userId})</Text>;
}
\`\`\`

## State Management with Zustand

\`\`\`typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login:  (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { user, token } = await api.login(email, password);
          set({ user, token, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: async (key) => {
          const value = await AsyncStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) => AsyncStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => AsyncStorage.removeItem(key),
      },
    }
  )
);

// Usage in any component (no Provider needed!):
function ProfileScreen() {
  const { user, logout } = useAuthStore();
  return (
    <View>
      <Text>{user?.name}</Text>
      <Pressable onPress={logout}><Text>Sign Out</Text></Pressable>
    </View>
  );
}
\`\`\`

## Native APIs with Expo

\`\`\`typescript
// Expo provides cross-platform native APIs:
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';

// Camera:
const [permission, requestPermission] = Camera.useCameraPermissions();

function CameraScreen() {
  if (!permission?.granted) {
    return <Pressable onPress={requestPermission}><Text>Grant Camera Access</Text></Pressable>;
  }
  return (
    <Camera.CameraView style={{ flex: 1 }}>
      {/* overlay UI */}
    </Camera.CameraView>
  );
}

// Image Picker:
async function pickImage() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });
  if (!result.canceled) {
    console.log(result.assets[0].uri);
  }
}

// Secure Storage (encrypted, for tokens):
await SecureStore.setItemAsync('auth_token', token);
const token = await SecureStore.getItemAsync('auth_token');
// Better than AsyncStorage for sensitive data
\`\`\`

## Deployment to App Store & Play Store

\`\`\`bash
# Using EAS (Expo Application Services) — recommended:
npm install -g eas-cli
eas login

# Configure:
eas build:configure

# Build for iOS (App Store):
eas build --platform ios --profile production
# Generates .ipa file — upload to App Store Connect

# Build for Android (Play Store):
eas build --platform android --profile production
# Generates .aab file — upload to Google Play Console

# OTA Updates (no App Store review for JS-only changes):
eas update --branch production --message "Fix login bug"
# Users get the update automatically on next app launch

# Build profiles in eas.json:
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "staging":     { "distribution": "internal", "env": { "API_URL": "https://staging.api.com" } },
    "production":  { "distribution": "store",    "env": { "API_URL": "https://api.com" } }
  }
}
\`\`\`

\`\`\`takeaways
["Type your route params with TypeScript — useNavigation() and useRoute() will infer correct param shapes", "Zustand with persist middleware + AsyncStorage = automatic state persistence across app restarts", "SecureStore > AsyncStorage for sensitive data (tokens) — SecureStore is encrypted by the OS", "Expo Camera, ImagePicker, Location: always request permissions before accessing — check status first", "EAS Build: cloud-based iOS/Android builds without needing a Mac (for iOS) or Android Studio", "OTA Updates via eas update: deploy JS-only fixes instantly, bypass App Store review (except native code changes)"]
\`\`\`
`,
    },
  ],
};
