# Graph Report - eKMG  (2026-10-26)

## Corpus Check
- 212 files · ~117,977 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 8, .css 4)

## Summary
- 1586 nodes · 3182 edges · 91 communities (72 shown, 19 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a98b55f0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- routes.tsx
- cn
- sidebar.tsx
- auth-context.tsx
- api.ts
- api/package.json
- Animal
- engine.ts
- utils.ts
- app.module.ts
- ui.tsx
- dependencies
- expo
- alert-dialog.tsx
- devDependencies
- menubar.tsx
- mobile/eslint.config.js
- What You Must Do When Invoked
- mobile/package.json
- web/package.json
- new.tsx
- pdfExports.ts
- command.tsx
- compilerOptions
- FarmService
- form.tsx
- compilerOptions
- legal-screen.tsx
- scripts
- compilerOptions
- index.tsx
- toggle-group.tsx
- dependencies
- context-menu.tsx
- main.ts
- @nestjs/common
- carousel.tsx
- PushToken
- CalendarEvent
- .register
- dependencies
- UsersController
- devDependencies
- AppService
- chart.tsx
- drawer.tsx
- select.tsx
- navigation-menu.tsx
- api/README.md
- app/_layout.tsx
- jest
- deploy
- notifications.ts
- graphify reference: extra exports and benchmark
- web/eslint.config.js
- Farm
- mobile/tsconfig.json
- ref_react
- engines
- scripts
- Welcome to your Expo app 👋
- nest-cli.json
- (tabs)/calendar.tsx
- graphify reference: query, path, explain
- devDependencies
- scripts
- theme.ts
- RequireFarmForUsers1792422000000
- tsconfig.build.json
- app.config.ts
- React + TypeScript + Vite
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- web/tsconfig.json
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- AGENTS.md
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- event-title.ts
- Krave
- animals.tsx
- animal.service.ts
- InitialSchema1790869824212
- AddClientIdForOfflineSync1792500000000

## God Nodes (most connected - your core abstractions)
1. `cn()` - 223 edges
2. `lucide-react` - 35 edges
3. `getDb()` - 33 edges
4. `@nestjs/common` - 30 edges
5. `Farm` - 28 edges
6. `Animal` - 25 edges
7. `useAuth()` - 25 edges
8. `typeorm` - 22 edges
9. `User` - 21 edges
10. `react-native` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Small API change (needed so retries do not duplicate events)` --references--> `CreateEventDto`  [INFERRED]
  offlineSync.md → apps/api/src/events/entities/create-event.dto.ts
- `Write path (optimistic, always)` --references--> `loadAnimals()`  [INFERRED]
  offlineSync.md → apps/mobile/src/lib/animals-store.ts
- `Write path (optimistic, always)` --references--> `loadOpravila()`  [INFERRED]
  offlineSync.md → apps/mobile/src/lib/tasks.ts
- `Local model` --references--> `Zival`  [INFERRED]
  offlineSync.md → apps/mobile/src/constants/data.ts
- `Write path (optimistic, always)` --references--> `addAnimal()`  [INFERRED]
  offlineSync.md → apps/mobile/src/lib/animals-store.ts

## Import Cycles
- None detected.

## Communities (91 total, 19 thin omitted)

### Community 0 - "routes.tsx"
Cohesion: 0.07
Nodes (37): App(), AnimalDetail(), AnimalForm(), AnimalList(), Animal, AnimalWithRelations, FamilyTree(), FamilyTreeProps (+29 more)

### Community 1 - "cn"
Cohesion: 0.06
Nodes (38): Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+30 more)

### Community 2 - "sidebar.tsx"
Cohesion: 0.06
Nodes (43): Input(), Separator(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+35 more)

### Community 3 - "auth-context.tsx"
Cohesion: 0.15
Nodes (20): NewAnimalScreen(), EditFarmScreen(), styles, FarmSetupScreen(), styles, LoginScreen(), styles, EditProfileScreen() (+12 more)

### Community 4 - "api.ts"
Cohesion: 0.06
Nodes (43): API_URL, ApiAnimal, ApiEvent, AuthFarm, AuthResult, AuthUser, createAnimal(), CreateAnimalPayload (+35 more)

### Community 5 - "api/package.json"
Cohesion: 0.05
Nodes (36): author, description, eslint, @eslint/js, globals, @types/node, typescript, typescript-eslint (+28 more)

### Community 6 - "Animal"
Cohesion: 0.09
Nodes (3): AnimalsController, AnimalsService, Animal

### Community 7 - "engine.ts"
Cohesion: 0.06
Nodes (91): onChangeState(), onSubmit(), breedLabel(), Zival, addAnimal(), animals, emit(), getSnapshot() (+83 more)

### Community 8 - "utils.ts"
Cohesion: 0.07
Nodes (8): HoverCardContent(), PopoverContent(), Progress(), ScrollArea(), ScrollBar(), Slider(), Switch(), Textarea()

### Community 9 - "app.module.ts"
Cohesion: 0.16
Nodes (10): AnimalsModule, AuthModule, EventsModule, REMINDER_OFFSETS, FarmsModule, NotificationsModule, PushMessage, UsersModule (+2 more)

### Community 10 - "ui.tsx"
Cohesion: 0.20
Nodes (17): AnimalDetailScreen(), confirmDelete(), onDelete(), DetailTab, fmtDate(), MESECI, styles, MilkScreen() (+9 more)

### Community 11 - "dependencies"
Cohesion: 0.06
Nodes (34): dependencies, expo, expo-constants, expo-device, expo-font, expo-glass-effect, @expo-google-fonts/jetbrains-mono, @expo-google-fonts/libre-franklin (+26 more)

### Community 12 - "expo"
Cohesion: 0.07
Nodes (28): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, projectId, reactCompiler (+20 more)

### Community 13 - "alert-dialog.tsx"
Cohesion: 0.10
Nodes (18): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogPortal() (+10 more)

### Community 14 - "devDependencies"
Cohesion: 0.07
Nodes (27): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+19 more)

### Community 15 - "menubar.tsx"
Cohesion: 0.12
Nodes (12): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarPortal(), MenubarRadioItem(), MenubarSeparator() (+4 more)

### Community 16 - "mobile/eslint.config.js"
Cohesion: 0.40
Nodes (3): { defineConfig }, expoConfig, eslint-config-expo

### Community 17 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 18 - "mobile/package.json"
Cohesion: 0.07
Nodes (26): eslint, react, react-dom, @types/react, typescript, main, name, private (+18 more)

### Community 19 - "web/package.json"
Cohesion: 0.09
Nodes (21): eslint, @eslint/js, globals, react, react-dom, @types/node, @types/react, typescript (+13 more)

### Community 20 - "new.tsx"
Cohesion: 0.10
Nodes (21): BREED_OPTIONS, GENDER_TABS, styles, YES_NO_TABS, MilkTab, styles, BreedOption, BREEDS (+13 more)

### Community 21 - "pdfExports.ts"
Cohesion: 0.26
Nodes (20): Reports(), addHeaderFooter(), downloadCSV(), downloadFile(), exportAnimalListCSV(), exportARSKTRPSubsidyJSON(), exportCRGMovementXML(), exportHealthRecordsCSV() (+12 more)

### Community 22 - "command.tsx"
Cohesion: 0.14
Nodes (16): Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+8 more)

### Community 23 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+13 more)

### Community 24 - "FarmService"
Cohesion: 0.08
Nodes (7): AuthController, AuthService, UserLoginDto, UserRegisterDto, FarmService, UsersService, @nestjs/jwt

### Community 25 - "form.tsx"
Cohesion: 0.18
Nodes (11): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue, FormLabel() (+3 more)

### Community 26 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+11 more)

### Community 27 - "legal-screen.tsx"
Cohesion: 0.27
Nodes (9): PrivacyScreen(), TermsScreen(), LegalScreen(), styles, LegalDocument, LegalSection, POLICY_VERSION, PRIVACY_POLICY (+1 more)

### Community 28 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, build, format, lint, migration:create, migration:generate, migration:revert, migration:run (+10 more)

### Community 29 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, experimentalDecorators, forceConsistentCasingInFileNames, incremental, module (+9 more)

### Community 30 - "index.tsx"
Cohesion: 0.24
Nodes (13): daysUntil(), DNEVI, eventIcon(), HomeScreen(), MESECI, pad(), parseKey(), slovenianDate() (+5 more)

### Community 31 - "toggle-group.tsx"
Cohesion: 0.15
Nodes (11): Alert(), AlertDescription(), AlertTitle(), alertVariants, Badge(), badgeVariants, ToggleGroup(), ToggleGroupContext (+3 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, bcrypt, class-transformer, class-validator, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/jwt (+9 more)

### Community 33 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 34 - "main.ts"
Cohesion: 0.25
Nodes (4): AppModule, @nestjs/core, @nestjs/testing, supertest

### Community 35 - "@nestjs/common"
Cohesion: 0.11
Nodes (9): AuthUserPayload, FarmScopeGuard, FarmScoped(), JwtAuthGuard, JwtStrategy, UpdateFarmDto, FarmsController, @nestjs/common (+1 more)

### Community 36 - "carousel.tsx"
Cohesion: 0.17
Nodes (14): Button(), Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext() (+6 more)

### Community 37 - "PushToken"
Cohesion: 0.11
Nodes (3): ReminderService, PushToken, PushService

### Community 38 - "CalendarEvent"
Cohesion: 0.07
Nodes (5): CreateEventDto, CalendarEvent, EventsController, EventResponse, EventsService

### Community 40 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, date-fns, i18next, jspdf, jspdf-autotable, lucide-react, react, react-dom (+6 more)

### Community 42 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/node, @types/react (+5 more)

### Community 44 - "chart.tsx"
Cohesion: 0.24
Nodes (11): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+3 more)

### Community 45 - "drawer.tsx"
Cohesion: 0.20
Nodes (7): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerPortal(), DrawerTitle()

### Community 46 - "select.tsx"
Cohesion: 0.20
Nodes (7): SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger()

### Community 47 - "navigation-menu.tsx"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 48 - "api/README.md"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 49 - "app/_layout.tsx"
Cohesion: 0.24
Nodes (8): AppShell(), RootLayout(), AuthProvider(), expo-font, @expo-google-fonts/jetbrains-mono, @expo-google-fonts/libre-franklin, expo-splash-screen, expo-status-bar

### Community 50 - "jest"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+1 more)

### Community 51 - "deploy"
Cohesion: 0.22
Nodes (8): build, buildCommand, builder, deploy, restartPolicyMaxRetries, restartPolicyType, startCommand, $schema

### Community 52 - "notifications.ts"
Cohesion: 0.36
Nodes (8): ensureNotificationPermission(), getApi(), registerForPushNotificationsAsync(), remindersSupported(), setupNotifications(), expo-constants, expo-device, expo-notifications

### Community 53 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 54 - "web/eslint.config.js"
Cohesion: 0.32
Nodes (3): eslint-plugin-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh

### Community 55 - "Farm"
Cohesion: 0.05
Nodes (13): dataSource, dataSourceOptions, CreateFarmDto, Farm, AddDayReminder1790870000000, PushTokenFarmFk1790870100000, AddUserConsent1790870200000, DropUserRole1790870300000 (+5 more)

### Community 56 - "mobile/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, paths, strict, extends, include, @/assets/*, expo/tsconfig.base

### Community 57 - "ref_react"
Cohesion: 0.08
Nodes (18): LanguageSwitcher(), Layout(), getInitialTheme(), Theme, ThemeSwitcher(), AccordionContent(), AccordionItem(), AccordionTrigger() (+10 more)

### Community 59 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, android, ios, lint, reset-project, start, web

### Community 60 - "Welcome to your Expo app 👋"
Cohesion: 0.29
Nodes (6): Get a fresh project, Get started, Join the community, Learn more, Other setup steps, Welcome to your Expo app 👋

### Community 61 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 62 - "(tabs)/calendar.tsx"
Cohesion: 0.23
Nodes (13): CalendarScreen(), DNEVI, EVENT_TITLE_OPTIONS, EVENT_TITLES, fmtKey(), MESECI, monthMatrix(), pad() (+5 more)

### Community 64 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 67 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, eslint, eslint-config-expo, @types/react, typescript

### Community 68 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 70 - "theme.ts"
Cohesion: 0.21
Nodes (11): FinanceScreen(), styles, ProfileScreen(), styles, Screen(), styles, SecondaryButton(), SectionLabel() (+3 more)

### Community 72 - "tsconfig.build.json"
Cohesion: 0.50
Nodes (3): exclude, extends, ./tsconfig.json

### Community 73 - "app.config.ts"
Cohesion: 0.50
Nodes (3): Variant, variants, expo

### Community 74 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 76 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 77 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 78 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 93 - "Krave"
Cohesion: 0.50
Nodes (3): Apps, Krave, Local development

### Community 94 - "animals.tsx"
Cohesion: 0.33
Nodes (9): AnimalsScreen(), styles, formatLastSync(), styles, SyncBanner(), EarTag(), loadAnimals(), useAnimals() (+1 more)

### Community 95 - "animal.service.ts"
Cohesion: 0.12
Nodes (3): CreateAnimalDto, UpdateAnimalDto, class-validator

## Knowledge Gaps
- **466 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+461 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 733 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CreateEventDto` connect `CalendarEvent` to `@nestjs/common`, `api.ts`?**
  _High betweenness centrality (0.262) - this node is a cross-community bridge._
- **Why does `SQLite offline sync (animals + calendar)` connect `api.ts` to `engine.ts`?**
  _High betweenness centrality (0.262) - this node is a cross-community bridge._
- **Why does `Small API change (needed so retries do not duplicate events)` connect `api.ts` to `CalendarEvent`?**
  _High betweenness centrality (0.260) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _466 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `routes.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07207792207792207 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.06289308176100629 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06079664570230608 - nodes in this community are weakly interconnected._