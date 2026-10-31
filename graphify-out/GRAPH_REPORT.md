# Graph Report - eKMG  (2026-10-31)

## Corpus Check
- 216 files · ~166,543 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 7, .css 4, .example 1)

## Summary
- 1589 nodes · 3272 edges · 87 communities (68 shown, 19 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1f564a23`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ref_react
- cn
- sidebar.tsx
- new.tsx
- api.ts
- api/package.json
- Animal
- engine.ts
- utils.ts
- @nestjs/common
- context-menu.tsx
- dependencies
- expo
- alert-dialog.tsx
- devDependencies
- menubar.tsx
- mobile/eslint.config.js
- What You Must Do When Invoked
- mobile/package.json
- web/package.json
- data.ts
- pdfExports.ts
- command.tsx
- compilerOptions
- auth.service.ts
- navigation-menu.tsx
- compilerOptions
- legal.ts
- scripts
- compilerOptions
- form.tsx
- button.tsx
- dependencies
- index.tsx
- Farm
- AuthUserPayload
- carousel.tsx
- PushToken
- CreateEventDto
- CalendarEvent
- dependencies
- UsersController
- devDependencies
- app.ts
- chart.tsx
- drawer.tsx
- select.tsx
- resizable.tsx
- create-test-db.js
- app/_layout.tsx
- jest
- deploy
- notifications.ts
- graphify reference: extra exports and benchmark
- web/eslint.config.js
- User
- mobile/tsconfig.json
- ui.tsx
- engines
- scripts
- Welcome to your Expo app 👋
- nest-cli.json
- (tabs)/calendar.tsx
- InitialSchema1793000000000
- graphify reference: query, path, explain
- DropAnimalDateOfTagging1793448249931
- devDependencies
- scripts
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
- eKMG

## God Nodes (most connected - your core abstractions)
1. `cn()` - 223 edges
2. `@nestjs/common` - 39 edges
3. `lucide-react` - 35 edges
4. `getDb()` - 33 edges
5. `Farm` - 28 edges
6. `Animal` - 26 edges
7. `useAuth()` - 25 edges
8. `react-native` - 22 edges
9. `AnimalDetailScreen()` - 21 edges
10. `User` - 20 edges

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

## Communities (87 total, 19 thin omitted)

### Community 0 - "ref_react"
Cohesion: 0.06
Nodes (46): App(), AnimalDetail(), AnimalForm(), AnimalList(), Animal, AnimalWithRelations, FamilyTree(), FamilyTreeProps (+38 more)

### Community 1 - "cn"
Cohesion: 0.05
Nodes (42): AccordionContent(), AccordionItem(), AccordionTrigger(), Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem() (+34 more)

### Community 2 - "sidebar.tsx"
Cohesion: 0.06
Nodes (43): Input(), Separator(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+35 more)

### Community 3 - "new.tsx"
Cohesion: 0.12
Nodes (32): BREED_OPTIONS, GENDER_TABS, NewAnimalScreen(), parentLabel(), styles, YES_NO_TABS, EditFarmScreen(), styles (+24 more)

### Community 4 - "api.ts"
Cohesion: 0.06
Nodes (43): API_URL, ApiAnimal, ApiEvent, AuthFarm, AuthResult, AuthUser, createAnimal(), CreateAnimalPayload (+35 more)

### Community 5 - "api/package.json"
Cohesion: 0.06
Nodes (35): author, description, eslint, @eslint/js, globals, @types/node, typescript, typescript-eslint (+27 more)

### Community 6 - "Animal"
Cohesion: 0.06
Nodes (6): AnimalsController, AnimalsService, Animal, CreateAnimalDto, UpdateAnimalDto, class-validator

### Community 7 - "engine.ts"
Cohesion: 0.06
Nodes (93): onChangeState(), onSubmit(), breedLabel(), Zival, addAnimal(), animals, emit(), getSnapshot() (+85 more)

### Community 8 - "utils.ts"
Cohesion: 0.06
Nodes (10): HoverCardContent(), InputOTP(), InputOTPGroup(), InputOTPSlot(), PopoverContent(), Progress(), ScrollArea(), ScrollBar() (+2 more)

### Community 9 - "@nestjs/common"
Cohesion: 0.15
Nodes (14): AnimalsModule, AuthModule, dataSource, dataSourceOptions, EventsModule, REMINDER_OFFSETS, FarmsModule, NotificationsModule (+6 more)

### Community 10 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 11 - "dependencies"
Cohesion: 0.06
Nodes (34): dependencies, expo, expo-constants, expo-device, expo-font, expo-glass-effect, @expo-google-fonts/jetbrains-mono, @expo-google-fonts/libre-franklin (+26 more)

### Community 12 - "expo"
Cohesion: 0.07
Nodes (27): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, projectId, reactCompiler (+19 more)

### Community 13 - "alert-dialog.tsx"
Cohesion: 0.11
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
Cohesion: 0.10
Nodes (20): eslint, @eslint/js, globals, react, react-dom, @types/node, @types/react, typescript (+12 more)

### Community 20 - "data.ts"
Cohesion: 0.15
Nodes (14): styles, BreedOption, BREEDS, Dostava, EMPTY_DETAIL, FARM, GENDERS, Molzenje (+6 more)

### Community 21 - "pdfExports.ts"
Cohesion: 0.22
Nodes (22): Reports(), addHeaderFooter(), downloadCSV(), downloadFile(), exportAnimalListCSV(), exportARSKTRPSubsidyJSON(), exportCRGMovementXML(), exportHealthRecordsCSV() (+14 more)

### Community 22 - "command.tsx"
Cohesion: 0.15
Nodes (16): Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+8 more)

### Community 23 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+13 more)

### Community 24 - "auth.service.ts"
Cohesion: 0.10
Nodes (6): AuthController, AuthService, UserLoginDto, UserRegisterDto, bcrypt, @nestjs/jwt

### Community 25 - "navigation-menu.tsx"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 26 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+11 more)

### Community 27 - "legal.ts"
Cohesion: 0.27
Nodes (8): PrivacyScreen(), TermsScreen(), LegalScreen(), LegalDocument, LegalSection, POLICY_VERSION, PRIVACY_POLICY, TERMS_OF_SERVICE

### Community 28 - "scripts"
Cohesion: 0.11
Nodes (19): scripts, build, format, lint, migration:create, migration:generate, migration:revert, migration:run (+11 more)

### Community 29 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, experimentalDecorators, forceConsistentCasingInFileNames, incremental, module (+9 more)

### Community 30 - "form.tsx"
Cohesion: 0.18
Nodes (11): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue, FormLabel() (+3 more)

### Community 31 - "button.tsx"
Cohesion: 0.14
Nodes (11): Alert(), AlertDescription(), AlertTitle(), alertVariants, Badge(), badgeVariants, ToggleGroup(), ToggleGroupContext (+3 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, bcrypt, class-transformer, class-validator, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/jwt (+9 more)

### Community 33 - "index.tsx"
Cohesion: 0.23
Nodes (14): daysUntil(), DNEVI, eventIcon(), HomeScreen(), MESECI, pad(), parseKey(), slovenianDate() (+6 more)

### Community 34 - "Farm"
Cohesion: 0.08
Nodes (5): CreateFarmDto, Farm, UpdateFarmDto, FarmsController, FarmService

### Community 35 - "AuthUserPayload"
Cohesion: 0.12
Nodes (6): AuthUserPayload, FarmScopeGuard, JwtAuthGuard, JwtStrategy, RegisterPushTokenDto, @nestjs/passport

### Community 36 - "carousel.tsx"
Cohesion: 0.17
Nodes (14): Button(), Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext() (+6 more)

### Community 38 - "CreateEventDto"
Cohesion: 0.09
Nodes (5): FarmScoped(), CreateEventDto, EventsController, EventResponse, EventsService

### Community 39 - "CalendarEvent"
Cohesion: 0.09
Nodes (3): CalendarEvent, PushController, PushService

### Community 40 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, date-fns, i18next, jspdf, jspdf-autotable, lucide-react, react, react-dom (+6 more)

### Community 42 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/node, @types/react (+5 more)

### Community 43 - "app.ts"
Cohesion: 0.07
Nodes (20): API (`apps/api`), E2E (`npm run test:e2e`), Tests, Unit (`npm test`), AppController, AppModule, AppService, ReminderService (+12 more)

### Community 44 - "chart.tsx"
Cohesion: 0.24
Nodes (11): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+3 more)

### Community 45 - "drawer.tsx"
Cohesion: 0.20
Nodes (7): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerPortal(), DrawerTitle()

### Community 46 - "select.tsx"
Cohesion: 0.20
Nodes (7): SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger()

### Community 48 - "create-test-db.js"
Cohesion: 0.20
Nodes (6): { Client }, fs, loadEnv(), main(), path, pg

### Community 49 - "app/_layout.tsx"
Cohesion: 0.29
Nodes (7): AppShell(), RootLayout(), expo-font, @expo-google-fonts/jetbrains-mono, @expo-google-fonts/libre-franklin, expo-splash-screen, expo-status-bar

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

### Community 56 - "mobile/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, paths, strict, extends, include, @/assets/*, expo/tsconfig.base

### Community 57 - "ui.tsx"
Cohesion: 0.13
Nodes (29): AnimalDetailScreen(), confirmDelete(), onDelete(), DetailTab, fmtDate(), MESECI, styles, FinanceScreen() (+21 more)

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
Cohesion: 0.16
Nodes (20): AnimalsScreen(), styles, CalendarScreen(), DNEVI, EVENT_TITLE_OPTIONS, EVENT_TITLES, fmtKey(), MESECI (+12 more)

### Community 64 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 67 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, eslint, eslint-config-expo, @types/react, typescript

### Community 68 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

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

### Community 93 - "eKMG"
Cohesion: 0.40
Nodes (4): API tests, Apps, eKMG, Local development

## Knowledge Gaps
- **466 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+461 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 721 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CreateEventDto` connect `CreateEventDto` to `@nestjs/common`, `api.ts`?**
  _High betweenness centrality (0.237) - this node is a cross-community bridge._
- **Why does `SQLite offline sync (animals + calendar)` connect `api.ts` to `engine.ts`?**
  _High betweenness centrality (0.236) - this node is a cross-community bridge._
- **Why does `Small API change (needed so retries do not duplicate events)` connect `api.ts` to `CreateEventDto`?**
  _High betweenness centrality (0.235) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _466 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_react` be split into smaller, more focused modules?**
  _Cohesion score 0.05917721518987342 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.053939714436805924 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05925925925925926 - nodes in this community are weakly interconnected._