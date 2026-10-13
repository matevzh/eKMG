# Graph Report - mobile  (2026-10-07)

## Corpus Check
- 39 files · ~63,896 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 340 nodes · 737 edges · 19 communities (17 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `add131b4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ui.tsx
- calendar.tsx
- api.ts
- dependencies
- expo
- new.tsx
- package.json
- useAuth
- legal.ts
- notifications.ts
- app/_layout.tsx
- tsconfig.json
- scripts
- Welcome to your Expo app 👋
- eslint.config.js
- devDependencies
- app.config.ts
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 21 edges
2. `AnimalDetailScreen()` - 19 edges
3. `C` - 18 edges
4. `react-native` - 17 edges
5. `CalendarScreen()` - 17 edges
6. `react` - 16 edges
7. `Card()` - 16 edges
8. `HomeScreen()` - 15 edges
9. `F` - 15 edges
10. `expo` - 14 edges

## Surprising Connections (you probably didn't know these)
- `AnimalsScreen()` --calls--> `loadAnimals()`  [EXTRACTED]
  src/app/(tabs)/animals.tsx → src/lib/animals-store.ts
- `AnimalsScreen()` --calls--> `useAnimals()`  [EXTRACTED]
  src/app/(tabs)/animals.tsx → src/lib/animals-store.ts
- `AnimalsScreen()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/(tabs)/animals.tsx → src/lib/auth-context.tsx
- `CalendarScreen()` --calls--> `Screen()`  [EXTRACTED]
  src/app/(tabs)/calendar.tsx → src/components/screen.tsx
- `CalendarScreen()` --calls--> `Card()`  [EXTRACTED]
  src/app/(tabs)/calendar.tsx → src/components/ui.tsx

## Import Cycles
- None detected.

## Communities (19 total, 2 thin omitted)

### Community 0 - "ui.tsx"
Cohesion: 0.13
Nodes (34): expo-router, lucide-react-native, react, react-native, react-native-safe-area-context, DetailTab, MESECI, styles (+26 more)

### Community 1 - "calendar.tsx"
Cohesion: 0.11
Nodes (33): CalendarScreen(), DNEVI, EVENT_TITLES, fmtKey(), MESECI, monthMatrix(), pad(), parseKey() (+25 more)

### Community 2 - "api.ts"
Cohesion: 0.07
Nodes (38): expo-secure-store, API_URL, ApiAnimal, ApiEvent, AuthFarm, AuthResult, AuthUser, createAnimal() (+30 more)

### Community 3 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, expo, expo-constants, expo-device, expo-font, expo-glass-effect, @expo-google-fonts/jetbrains-mono, @expo-google-fonts/libre-franklin (+24 more)

### Community 4 - "expo"
Cohesion: 0.07
Nodes (28): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, projectId, reactCompiler (+20 more)

### Community 5 - "new.tsx"
Cohesion: 0.07
Nodes (40): AnimalDetailScreen(), confirmDelete(), onChangeStatus(), onDelete(), fmtDate(), BREED_OPTIONS, GENDER_TABS, onSubmit() (+32 more)

### Community 6 - "package.json"
Cohesion: 0.09
Nodes (22): main, name, private, version, expo-glass-effect, expo-image, expo-linking, expo-symbols (+14 more)

### Community 7 - "useAuth"
Cohesion: 0.19
Nodes (11): NewAnimalScreen(), FarmSetupScreen(), styles, LoginScreen(), RegisterScreen(), DateField(), onAndroidChange(), PrimaryButton() (+3 more)

### Community 8 - "legal.ts"
Cohesion: 0.27
Nodes (8): PrivacyScreen(), TermsScreen(), LegalScreen(), LegalDocument, LegalSection, POLICY_VERSION, PRIVACY_POLICY, TERMS_OF_SERVICE

### Community 9 - "notifications.ts"
Cohesion: 0.33
Nodes (9): expo-constants, expo-device, expo-notifications, addEventPushListener(), ensureNotificationPermission(), getApi(), registerForPushNotificationsAsync(), remindersSupported() (+1 more)

### Community 10 - "app/_layout.tsx"
Cohesion: 0.24
Nodes (8): expo-font, @expo-google-fonts/jetbrains-mono, @expo-google-fonts/libre-franklin, expo-splash-screen, expo-status-bar, AppShell(), RootLayout(), AuthProvider()

### Community 11 - "tsconfig.json"
Cohesion: 0.25
Nodes (7): expo/tsconfig.base, compilerOptions, paths, strict, extends, include, @/assets/*

### Community 12 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, android, ios, lint, reset-project, start, web

### Community 13 - "Welcome to your Expo app 👋"
Cohesion: 0.29
Nodes (6): Get a fresh project, Get started, Join the community, Learn more, Other setup steps, Welcome to your Expo app 👋

### Community 14 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): { defineConfig }, expoConfig, eslint, eslint-config-expo

### Community 15 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, eslint, eslint-config-expo, @types/react, typescript

### Community 16 - "app.config.ts"
Cohesion: 0.50
Nodes (3): Variant, variants, expo

## Knowledge Gaps
- **144 isolated node(s):** `Variant`, `variants`, `name`, `slug`, `version` (+139 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 158 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Why does `react` connect `ui.tsx` to `calendar.tsx`, `api.ts`, `new.tsx`, `package.json`, `useAuth`, `app/_layout.tsx`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `react-native` connect `ui.tsx` to `calendar.tsx`, `new.tsx`, `package.json`, `useAuth`, `notifications.ts`, `app/_layout.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `Variant`, `variants`, `name` to the rest of the system?**
  _144 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13180272108843538 - nodes in this community are weakly interconnected._
- **Should `calendar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07439024390243902 - nodes in this community are weakly interconnected._