import { Module } from "../types";

export const module4: Module = {
  id: "performance-offline",
  title: "Performance Optimization & Offline-First",
  description: "FlatList performance, memo and useMemo patterns, image optimization, MMKV for fast local storage, WatermelonDB for offline-first data, and background sync",
  lessons: [
    {
      id: "performance-offline",
      slug: "performance-offline",
      title: "Performance & Offline-First Data",
      content: `# Performance & Offline-First in React Native

Users expect instant response and offline capability. A slow list or a "No connection" error screen loses users. Performance optimization and offline-first architecture are what professional mobile apps require.

---

\`\`\`concept
{
  "title": "Offline-First Philosophy",
  "variant": "mental-model",
  "content": "An online-first app shows an error when offline. An offline-first app works completely without internet, queues mutations, and syncs when reconnected — the user may not even notice the connection dropped. Think of it like Git: you work locally, commit locally, then push. The key insight: treat the local database as the source of truth for the UI, and the network as an eventually-consistent mirror. Every read comes from local data; writes go local first, then sync."
}
\`\`\`

---

## FlatList Performance

\`\`\`tsx
import { FlatList, memo } from 'react';

// The most important FlatList optimizations:

// 1. keyExtractor: stable keys prevent unnecessary re-renders
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
/>

// 2. memo the row component — only re-renders when props change
const ItemRow = memo(({ item, onPress }: { item: Item; onPress: (id: string) => void }) => {
  return (
    <Pressable onPress={() => onPress(item.id)}>
      <Text>{item.title}</Text>
    </Pressable>
  );
});

// 3. useCallback for renderItem — prevents new function on every render
const renderItem = useCallback(({ item }: { item: Item }) => (
  <ItemRow item={item} onPress={handlePress} />
), [handlePress]);

// 4. getItemLayout: skip dynamic measurement (only if rows are fixed height)
const ITEM_HEIGHT = 72;
<FlatList
  getItemLayout={(_, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>

// 5. windowSize + maxToRenderPerBatch: control render window
<FlatList
  windowSize={5}              // render 5 viewports worth of items
  maxToRenderPerBatch={10}    // render 10 items per batch
  initialNumToRender={10}     // render 10 items on mount
  removeClippedSubviews={true} // iOS: unmount off-screen items (use carefully)
/>

// 6. Image optimization in lists:
// Use FastImage instead of Image for better caching + priority loading:
import FastImage from 'react-native-fast-image';
<FastImage
  source={{ uri: item.imageUrl, priority: FastImage.priority.normal }}
  style={styles.thumbnail}
  resizeMode={FastImage.resizeMode.cover}
/>
\`\`\`

## MMKV: Fast Local Storage

\`\`\`tsx
import { MMKV } from 'react-native-mmkv';

// MMKV is 10x faster than AsyncStorage (C++ implementation, synchronous)
// Great for: settings, user preferences, cached responses, session tokens

const storage = new MMKV();

// Synchronous reads (no await needed):
storage.set('user-token', 'abc123');
const token = storage.getString('user-token'); // returns immediately

storage.set('is-onboarded', true);
const onboarded = storage.getBoolean('is-onboarded');

storage.set('user-age', 28);
const age = storage.getNumber('user-age');

// Delete:
storage.delete('user-token');
storage.clearAll(); // delete everything

// Namespaced instances (don't mix app data with cache):
const userStorage = new MMKV({ id: 'user-storage' });
const cacheStorage = new MMKV({ id: 'cache-storage' });

// Encrypted storage:
const secureStorage = new MMKV({
  id: 'secure',
  encryptionKey: 'my-encryption-key', // store this in Keychain in production
});

// Zustand persist with MMKV:
import { createJSONStorage, persist } from 'zustand/middleware';

const useStore = create(persist(
  (set) => ({ count: 0, increment: () => set((s) => ({ count: s.count + 1 })) }),
  {
    name: 'app-storage',
    storage: createJSONStorage(() => ({
      setItem: (key, value) => storage.set(key, value),
      getItem: (key) => storage.getString(key) ?? null,
      removeItem: (key) => storage.delete(key),
    })),
  }
));
\`\`\`

## WatermelonDB: Offline-First Database

\`\`\`tsx
// WatermelonDB: high-performance SQLite-backed database
// Observable records: UI automatically updates when DB changes
// Sync: built-in sync protocol to sync with your backend

// Schema definition:
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'posts',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'body', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'is_synced', type: 'boolean' },
      ],
    }),
  ],
});

// Model definition:
import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

class Post extends Model {
  static table = 'posts';

  @field('title') title!: string;
  @field('body') body!: string;
  @readonly @date('created_at') createdAt!: Date;
  @field('is_synced') isSynced!: boolean;
}

// CRUD operations:
const database = useDatabase();

// Create:
await database.write(async () => {
  await database.get<Post>('posts').create((post) => {
    post.title = 'Hello World';
    post.body = 'First post';
  });
});

// Observe all posts (auto-updates UI when DB changes):
const posts = await database.get<Post>('posts').query().observe();

// React hook:
const PostList = withObservables([], ({ database }) => ({
  posts: database.get<Post>('posts').query().observe(),
}))(PostListBase);

// Sync with server:
import { synchronize } from '@nozbe/watermelondb/sync';

async function syncDatabase() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      const { data } = await api.get('/sync/pull', { params: { lastPulledAt } });
      return data; // { changes: { posts: { created, updated, deleted } }, timestamp }
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      await api.post('/sync/push', { changes, lastPulledAt });
    },
  });
}
\`\`\`

## Image Caching & Performance

\`\`\`tsx
// react-native-fast-image: better caching than built-in Image
import FastImage from 'react-native-fast-image';

// Preload images before user gets to that screen:
FastImage.preload([
  { uri: 'https://example.com/avatar.jpg', priority: FastImage.priority.high },
  { uri: 'https://example.com/banner.jpg', priority: FastImage.priority.normal },
]);

// Priority queue:
FastImage.priority.low    // load last (background images)
FastImage.priority.normal // default
FastImage.priority.high   // load first (hero images, critical content)

// Clear cache programmatically:
await FastImage.clearMemoryCache();
await FastImage.clearDiskCache();

// expo-image (Expo's official image component — Expo SDK 48+):
import { Image } from 'expo-image';

<Image
  source="https://example.com/image.jpg"
  placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
  contentFit="cover"
  transition={300}
  style={{ width: 200, height: 200 }}
/>
\`\`\`

\`\`\`takeaways
["memo() + useCallback() is the React Native list performance combination — always apply to row components and renderItem.", "getItemLayout skips dynamic measurement for fixed-height rows — massive performance win for large lists.", "MMKV is synchronous and 10x faster than AsyncStorage — use it for settings, tokens, and cached data.", "Offline-first: write to local DB first, sync to server later — users never wait for network responses.", "WatermelonDB observable queries auto-update the UI when data changes — no manual state management needed.", "FastImage priority queuing ensures critical images (hero, avatar) load before background images."]
\`\`\`
`,
    },
  ],
};
