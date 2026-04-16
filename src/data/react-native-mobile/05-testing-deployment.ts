import { Module } from "../types";

export const module5: Module = {
  id: "testing-deployment",
  title: "Testing, App Store Deployment & Monetization",
  description: "Jest and React Native Testing Library, Detox end-to-end tests, EAS Build for iOS/Android, App Store and Play Store submission, and in-app purchases with RevenueCat",
  lessons: [
    {
      id: "testing-deployment",
      slug: "testing-deployment",
      title: "Testing, Deployment & Monetization",
      content: `# Testing, Deployment & Monetization

Shipping to the App Store and Play Store is a gauntlet of certificates, review guidelines, and build configuration. And building without tests means every release is a gamble. This module covers the full path from code to paying users.

---

## Testing React Native Apps

\`\`\`tsx
// --- Unit tests with Jest ---
// jest.config.js is pre-configured by React Native

// Test a utility function:
// utils/formatCurrency.ts
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

// utils/formatCurrency.test.ts
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56)).toBe('\$1,234.56');
  });
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('\$0.00');
  });
  it('formats other currencies', () => {
    expect(formatCurrency(100, 'EUR')).toBe('€100.00');
  });
});

// --- React Native Testing Library ---
import { render, screen, fireEvent } from '@testing-library/react-native';

// Test a component:
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <View>
      <Text testID="count">{count}</Text>
      <Pressable testID="increment" onPress={() => setCount(c => c + 1)}>
        <Text>+</Text>
      </Pressable>
    </View>
  );
}

test('Counter increments on press', () => {
  render(<Counter />);
  expect(screen.getByTestId('count')).toHaveTextContent('0');
  fireEvent.press(screen.getByTestId('increment'));
  expect(screen.getByTestId('count')).toHaveTextContent('1');
});

// Mock native modules:
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn().mockReturnValue(null),
  })),
}));
\`\`\`

## Detox: End-to-End Testing

\`\`\`
// Detox runs real tests on simulator/emulator using the built app
// Install: npx detox init (after adding detox to package.json)

// e2e/loginFlow.test.ts:
import { device, element, by, expect as detoxExpect } from 'detox';

describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should log in with valid credentials', async () => {
    await element(by.id('email-input')).typeText('user@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    await detoxExpect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should show error for invalid credentials', async () => {
    await element(by.id('email-input')).typeText('wrong@email.com');
    await element(by.id('password-input')).typeText('wrongpass');
    await element(by.id('login-button')).tap();

    await detoxExpect(element(by.text('Invalid credentials'))).toBeVisible();
  });
});

// Run: npx detox test --configuration ios.sim.debug
// Build first: npx detox build --configuration ios.sim.debug
\`\`\`

## EAS Build & Deployment

\`\`\`bash
# Expo Application Services (EAS) handles cloud builds
# No Xcode or Android Studio needed on CI

# Install EAS CLI:
npm install -g eas-cli

# Configure project:
eas build:configure

# eas.json:
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": false },
      "android": { "buildType": "apk" }
    },
    "production": {
      "ios": { "buildType": "release" },
      "android": { "buildType": "app-bundle" }
    }
  }
}

# Build for iOS (App Store):
eas build --platform ios --profile production

# Build for Android (Play Store):
eas build --platform android --profile production

# Submit directly from EAS:
eas submit --platform ios
eas submit --platform android

# OTA updates (no App Store review):
eas update --branch production --message "Fix crash on login"
\`\`\`

## App Store & Play Store Submission

\`\`\`
--- iOS App Store Checklist ---
[ ] Apple Developer Account (\$99/year)
[ ] App ID created in Apple Developer Portal
[ ] Provisioning profiles and signing certificates in EAS
[ ] Screenshots: iPhone 6.7" + iPad (required)
[ ] App description, keywords (100 chars), subtitle (30 chars)
[ ] Privacy policy URL
[ ] Age rating completed
[ ] In-app purchase products configured (if applicable)

Review tips:
• Test on a real device before submitting
• Ensure all API calls succeed (reviewers get random internet conditions)
• No references to competitors ("better than the iPhone" gets rejected)
• User data deletion: provide way for users to delete account (App Store guideline 5.1.1)

--- Play Store Checklist ---
[ ] Google Play Developer account (\$25 one-time)
[ ] AAB (Android App Bundle) — required since Aug 2021
[ ] Screenshots: phone + 7" tablet
[ ] Feature graphic: 1024x500px
[ ] Privacy policy URL
[ ] Data safety form (what data you collect and why)
[ ] Target SDK 34+ (required as of Aug 2024)
\`\`\`

## Monetization with RevenueCat

\`\`\`tsx
import Purchases, { PurchasesPackage } from 'react-native-purchases';

// Initialize:
Purchases.configure({ apiKey: 'YOUR_REVENUECAT_API_KEY' });

// Fetch available products:
const offerings = await Purchases.getOfferings();
const packages = offerings.current?.availablePackages ?? [];

// packages includes: monthly, annual, lifetime

// Purchase a package:
async function purchasePremium(pkg: PurchasesPackage) {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    if (customerInfo.entitlements.active['premium']) {
      // User now has premium access
      unlockPremiumFeatures();
    }
  } catch (error: any) {
    if (!error.userCancelled) {
      Alert.alert('Purchase Failed', error.message);
    }
  }
}

// Restore purchases (required for App Store):
async function restorePurchases() {
  const customerInfo = await Purchases.restorePurchases();
  if (customerInfo.entitlements.active['premium']) {
    unlockPremiumFeatures();
  }
}

// Check entitlement on app start:
const customerInfo = await Purchases.getCustomerInfo();
const isPremium = !!customerInfo.entitlements.active['premium'];

// RevenueCat handles:
// - Receipt validation (server-side)
// - Subscription status webhooks
// - Analytics (MRR, churn, LTV)
// - A/B testing paywall prices
\`\`\`

\`\`\`takeaways
["React Native Testing Library tests what users see (accessible text, testID) — not implementation details.", "Mock native modules in Jest setup — MMKV, AsyncStorage, camera all need mocks.", "EAS Build handles code signing and certificates in the cloud — you don't need Xcode for CI builds.", "App Store requires account deletion mechanism — implement a 'Delete Account' flow before submitting.", "OTA updates (eas update) bypass App Store review for JS-only changes — ship bug fixes in minutes.", "RevenueCat abstracts iOS and Android IAP — one API for both platforms plus analytics and webhook support."]
\`\`\`
`,
    },
  ],
};
