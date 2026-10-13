# Graph Report - Krave  (2026-10-05)

## Corpus Check
- 182 files · ~109,385 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 8, .css 4)

## Summary
- 1423 nodes · 2710 edges · 88 communities (68 shown, 20 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `66083a44`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ref_react
- cn
- sidebar.tsx
- ui.tsx
- api.ts
- api/package.json
- Animal
- new.tsx
- utils.ts
- @nestjs/common
- user.service.ts
- dependencies
- expo
- alert-dialog.tsx
- devDependencies
- Farm
- UsersService
- What You Must Do When Invoked
- mobile/package.json
- web/package.json
- [id].tsx
- pdfExports.ts
- command.tsx
- compilerOptions
- auth.service.ts
- index.tsx
- compilerOptions
- animal.controller.ts
- scripts
- compilerOptions
- (tabs)/calendar.tsx
- toggle-group.tsx
- dependencies
- context-menu.tsx
- dropdown-menu.tsx
- CalendarEvent
- carousel.tsx
- form.tsx
- EventsController
- PushController
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
- ReminderService
- mobile/tsconfig.json
- EventsService
- PushService
- scripts
- Welcome to your Expo app 👋
- nest-cli.json
- CreateEventDto
- input-otp.tsx
- graphify reference: query, path, explain
- AnimalStatus
- mobile/eslint.config.js
- devDependencies
- scripts
- InitialSchema1790869824212
- AddDayReminder1790870000000
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 223 edges
2. `lucide-react` - 35 edges
3. `@nestjs/common` - 27 edges
4. `Farm` - 26 edges
5. `Animal` - 25 edges
6. `UsersService` - 23 edges
7. `useAuth()` - 21 edges
8. `User` - 20 edges
9. `compilerOptions` - 20 edges
10. `AnimalDetailScreen()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/app/components/ui/alert-dialog.tsx → apps/web/src/app/components/ui/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/app/components/ui/alert-dialog.tsx → apps/web/src/app/components/ui/utils.ts
- `AlertDialogTitle()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/app/components/ui/alert-dialog.tsx → apps/web/src/app/components/ui/utils.ts
- `AlertDialogDescription()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/app/components/ui/alert-dialog.tsx → apps/web/src/app/components/ui/utils.ts
- `AlertTitle()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/app/components/ui/alert.tsx → apps/web/src/app/components/ui/utils.ts

## Import Cycles
- None detected.

## Communities (88 total, 20 thin omitted)

### Community 0 - "ref_react"
Cohesion: 0.07
Nodes (44): App(), AnimalDetail(), AnimalForm(), AnimalList(), Animal, AnimalWithRelations, FamilyTree(), FamilyTreeProps (+36 more)

### Community 1 - "cn"
Cohesion: 0.05
Nodes (45): AccordionContent(), AccordionItem(), AccordionTrigger(), Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem() (+37 more)

### Community 2 - "sidebar.tsx"
Cohesion: 0.06
Nodes (43): Input(), Separator(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+35 more)

### Community 3 - "ui.tsx"
Cohesion: 0.12
Nodes (26): FarmSetupScreen(), styles, LoginScreen(), styles, RegisterScreen(), ROLE_TABS, styles, MilkTab (+18 more)

### Community 4 - "api.ts"
Cohesion: 0.07
Nodes (38): API_URL, ApiAnimal, ApiEvent, AuthFarm, AuthResult, AuthUser, createAnimal(), CreateAnimalPayload (+30 more)

### Community 5 - "api/package.json"
Cohesion: 0.05
Nodes (38): author, description, eslint, @eslint/js, globals, @types/node, typescript, typescript-eslint (+30 more)

### Community 6 - "Animal"
Cohesion: 0.09
Nodes (3): AnimalsController, AnimalsService, Animal

### Community 7 - "new.tsx"
Cohesion: 0.09
Nodes (34): BREED_OPTIONS, GENDER_TABS, NewAnimalScreen(), onSubmit(), STATUS_TABS, styles, DateField(), onAndroidChange() (+26 more)

### Community 8 - "utils.ts"
Cohesion: 0.06
Nodes (11): HoverCardContent(), PopoverContent(), Progress(), RadioGroup(), RadioGroupItem(), ResizableHandle(), ResizablePanelGroup(), ScrollArea() (+3 more)

### Community 9 - "@nestjs/common"
Cohesion: 0.14
Nodes (13): AnimalsModule, AppModule, AuthModule, JwtStrategy, EventsModule, FarmsModule, NotificationsModule, UsersModule (+5 more)

### Community 10 - "user.service.ts"
Cohesion: 0.11
Nodes (7): dataSource, dataSourceOptions, REMINDER_OFFSETS, PushToken, PushMessage, User, typeorm

### Community 11 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, expo, expo-constants, expo-device, expo-font, expo-glass-effect, @expo-google-fonts/jetbrains-mono, @expo-google-fonts/libre-franklin (+24 more)

### Community 12 - "expo"
Cohesion: 0.07
Nodes (28): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, projectId, reactCompiler (+20 more)

### Community 13 - "alert-dialog.tsx"
Cohesion: 0.10
Nodes (18): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogPortal() (+10 more)

### Community 14 - "devDependencies"
Cohesion: 0.07
Nodes (27): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+19 more)

### Community 15 - "Farm"
Cohesion: 0.11
Nodes (3): AuthService, Farm, FarmService

### Community 16 - "UsersService"
Cohesion: 0.11
Nodes (5): JwtAuthGuard, CreateFarmDto, UpdateFarmDto, FarmsController, UsersService

### Community 17 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 18 - "mobile/package.json"
Cohesion: 0.08
Nodes (24): eslint, react, react-dom, @types/react, typescript, main, name, private (+16 more)

### Community 19 - "web/package.json"
Cohesion: 0.09
Nodes (22): eslint, @eslint/js, globals, react, react-dom, @types/node, @types/react, typescript (+14 more)

### Community 20 - "[id].tsx"
Cohesion: 0.16
Nodes (22): AnimalDetailScreen(), confirmDelete(), onChangeStatus(), onDelete(), DetailTab, fmtDate(), MESECI, styles (+14 more)

### Community 21 - "pdfExports.ts"
Cohesion: 0.26
Nodes (20): Reports(), addHeaderFooter(), downloadCSV(), downloadFile(), exportAnimalListCSV(), exportARSKTRPSubsidyJSON(), exportCRGMovementXML(), exportHealthRecordsCSV() (+12 more)

### Community 22 - "command.tsx"
Cohesion: 0.15
Nodes (16): Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+8 more)

### Community 23 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+13 more)

### Community 24 - "auth.service.ts"
Cohesion: 0.15
Nodes (5): AuthController, UserLoginDto, UserRegisterDto, bcrypt, class-validator

### Community 25 - "index.tsx"
Cohesion: 0.19
Nodes (19): FinanceScreen(), styles, daysUntil(), DNEVI, eventIcon(), HomeScreen(), MESECI, pad() (+11 more)

### Community 26 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+11 more)

### Community 27 - "animal.controller.ts"
Cohesion: 0.16
Nodes (3): ANIMAL_STATUSES, CreateAnimalDto, UpdateAnimalDto

### Community 28 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, build, format, lint, migration:create, migration:generate, migration:revert, migration:run (+10 more)

### Community 29 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, experimentalDecorators, forceConsistentCasingInFileNames, incremental, module (+9 more)

### Community 30 - "(tabs)/calendar.tsx"
Cohesion: 0.21
Nodes (16): CalendarScreen(), DNEVI, EVENT_TITLES, fmtKey(), MESECI, monthMatrix(), pad(), parseKey() (+8 more)

### Community 31 - "toggle-group.tsx"
Cohesion: 0.15
Nodes (11): Alert(), AlertDescription(), AlertTitle(), alertVariants, Badge(), badgeVariants, ToggleGroup(), ToggleGroupContext (+3 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, bcrypt, class-transformer, class-validator, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/jwt (+9 more)

### Community 33 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 34 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 35 - "CalendarEvent"
Cohesion: 0.15
Nodes (3): CalendarEvent, EVENT_TITLES, EventResponse

### Community 36 - "carousel.tsx"
Cohesion: 0.17
Nodes (14): Button(), Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext() (+6 more)

### Community 37 - "form.tsx"
Cohesion: 0.18
Nodes (11): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue, FormLabel() (+3 more)

### Community 40 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, date-fns, i18next, jspdf, jspdf-autotable, lucide-react, react, react-dom (+6 more)

### Community 42 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/node, @types/react (+5 more)

### Community 43 - "AppService"
Cohesion: 0.26
Nodes (3): AppController, AppService, @nestjs/testing

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

### Community 56 - "mobile/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, paths, strict, extends, include, @/assets/*, expo/tsconfig.base

### Community 59 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, android, ios, lint, reset-project, start, web

### Community 60 - "Welcome to your Expo app 👋"
Cohesion: 0.29
Nodes (6): Get a fresh project, Get started, Join the community, Learn more, Other setup steps, Welcome to your Expo app 👋

### Community 61 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 63 - "input-otp.tsx"
Cohesion: 0.33
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

### Community 64 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 65 - "AnimalStatus"
Cohesion: 0.40
Nodes (5): AnimalStatus, Aktivna, Brejost, Presusena, Zdravljenje

### Community 66 - "mobile/eslint.config.js"
Cohesion: 0.40
Nodes (3): { defineConfig }, expoConfig, eslint-config-expo

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

## Knowledge Gaps
- **443 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+438 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 680 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `eslint-plugin-prettier` connect `web/eslint.config.js` to `api/package.json`?**
  _High betweenness centrality (0.304) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `ref_react` to `cn`, `context-menu.tsx`, `dropdown-menu.tsx`, `carousel.tsx`, `sidebar.tsx`, `utils.ts`, `alert-dialog.tsx`, `select.tsx`, `navigation-menu.tsx`, `web/package.json`, `pdfExports.ts`, `command.tsx`, `input-otp.tsx`?**
  _High betweenness centrality (0.210) - this node is a cross-community bridge._
- **Why does `eslint-plugin-react-hooks` connect `web/eslint.config.js` to `web/package.json`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _443 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_react` be split into smaller, more focused modules?**
  _Cohesion score 0.06627175120325805 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05427547363031234 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05925925925925926 - nodes in this community are weakly interconnected._