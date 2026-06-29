# MobileIdler Project Memory

## High-Level Project Description

MobileIdler is a private, mobile-only idle/progression web game for personal use. The game is driven by Real Life Activity Points (RAP), a currency representing real-world effort. The player spends RAP to run long-duration in-game activities such as exploring, training skills, running dungeons, bossing, and progressing characters.

The project should be built for long-term expansion: many characters, items, skills, unlock flags, achievements, currencies, status values, timers, activities, and progression systems are expected.

## Core Product Constraints

- Target platform: mobile only.
- Audience: private personal use by the project owner.
- Version control: GitHub.
- Hosting preference: static web hosting if possible.
- Privacy preference: public repository is acceptable for now so GitHub Pages works on the current account plan.
- Hosting privacy: the hosted website is publicly reachable by link.
- Save stability is a top priority because progression is expected to last for a very long time.

## Hosting Notes

GitHub Pages is a candidate for hosting a static web app.

Important verified notes from GitHub documentation:

- GitHub Pages can host static HTML, CSS, and JavaScript from a repository.
- GitHub Pages is available for public repositories on GitHub Free and for public/private repositories on GitHub Pro, Team, Enterprise Cloud, and Enterprise Server.
- GitHub warns that Pages sites are publicly available on the internet even if the repository is private, unless private Pages access control is available for the account/organization.
- Privately published GitHub Pages sites require GitHub Enterprise Cloud organization access control.

Current practical decision as of 2026-06-29: the repository may be public so the MVP can be tested live through GitHub Pages.

GitHub profile/privacy notes verified on 2026-06-28:

- Public profile contribution graphs show public repository activity by default.
- Private contributions can be shown or hidden in GitHub profile contribution settings.
- If private contributions are shown, GitHub can show contribution counts without exposing repository details to people who cannot access the private repository.
- GitHub also supports making the profile private and hiding activity.
- Recommended project privacy stance: keep the repository private and hide private contributions unless the owner intentionally wants anonymous private contribution counts visible.
- References:
  - https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/manage-visibility-settings-for-private-contributions-and-achievements
  - https://docs.github.com/en/account-and-profile/reference/profile-contributions-reference
  - https://docs.github.com/en/account-and-profile/how-tos/profile-customization/setting-your-profile-to-private

## Technology Direction

Implemented frontend stack:

- React
- TypeScript
- Vite
- lucide-react icons
- localStorage persistence for the first MVP

Current architectural direction:

- Mobile-first or mobile-only web app.
- Static deploy target compatible with GitHub Pages.
- DOM-first UI, because the game is mostly menus, lists, timers, tracking, progression, and inventory rather than a real-time canvas game.
- Renderer should not own game state.
- Saveable simulation/progression state should be serializable and independent from UI components.

Future save system may move to IndexedDB once save size or structured backup needs justify it.

## Architecture Principles

- Keep gameplay state, rules, and persistence separate from rendering/UI.
- Use modular domain files for major systems.
- Use reusable UI components for recurring elements such as navigation bars, tabs, action buttons, list rows, icon frames, panels, and status displays.
- Avoid large monolithic files.
- Each major gameplay module should have its own file or folder boundary.
- Shared data definitions should be structured and stable rather than scattered through UI code.
- Long-term progression requires save migrations from the beginning.
- The account starts with one character slot.
- Additional character slots are account-wide progression/QoL unlocks gated by milestones and RAP costs.
- Multiple characters can run activities at the same time.
- Each individual character can only run one active activity at a time.
- Account-wide state includes RAP, achievements, and inventory.
- Character-bound state includes skills and each character's current activity.
- Character creation must be data-driven: races, classes, passives, allowed race/class combinations, locked combinations, and unlock requirements should live in content definitions rather than hard-coded UI branches.
- Race/class combinations can be locked initially and unlocked later through meta-progression.

Expected module areas:

- Accounts/save profiles
- Characters
- Character slots
- Classes
- Races
- Race/class compatibility and unlocks
- Passive abilities
- RAP and real-life activity/deeds
- Activities and timers
- Exploration
- Regions and points of interest
- Combat
- Bossing
- Dungeons
- Inventory
- Items
- Equipment
- Loot tables
- Mounts and collectibles
- Skills
- Achievements
- Account-wide bonuses and quality-of-life unlocks
- Unlocks and prerequisites
- Currencies
- Save/load/migrations
- Asset manifests
- Reusable mobile UI components

## Account And Character Flow

The app should start with local account/save-profile selection rather than immediately entering a character.

Current account-flow direction:

- A local account/save profile represents one full game state, for example `LuckyBoo`.
- There is no external authentication requirement for the first version.
- The first screen should allow selecting or creating a local account/save profile.
- After account selection, the player enters an account-level dashboard.
- The dashboard owns RAP, account upgrades, achievements, inventory, collections, character slots, and active activity overview.
- Characters are managed inside the account as assignable workers.
- The player should be able to assign any available character to an activity from inside the account dashboard without fully leaving the game and re-entering via character select.
- Character select/character detail still exists, but it is a management view, not the only way to play.

Implementation implication: route/state design should be account-first. Character IDs should be referenced by activities; UI screens should not assume there is one globally selected active character.

## Character Creation Architecture

Character creation should be one of the more polished early UI flows.

Required direction:

- Use a multi-step mobile flow rather than a bare form.
- Race selection gets its own themed screen.
- Each race can define a background image, palette/theme tokens, description text, and passive ability.
- Class selection is filtered by selected race and current account unlocks.
- Locked race/class combinations should be visible when useful, with clear unlock requirements.
- Initial restrictions should exist; not every race can play every class.
- Meta-progression can unlock special combinations later, such as unlocking Orc Paladin through a high-cost account milestone or special quest.
- The long-term collection goal is eventually unlocking all race/class combinations.
- Each class starts with two passive abilities.
- Races do not currently have active abilities; they have one passive ability.

Implementation implication: save data should track unlocked race/class combinations separately from base content definitions. Content definitions should include default availability and unlock requirement IDs.

## Save System Requirements

Save data is one of the most important systems.

Required direction:

- Use an explicit save schema version.
- Store serializable game state only.
- Do not persist UI-only state as core progression state unless necessary.
- Include migration functions when save shape changes.
- Support export/import backup as early as practical.
- Prefer robust browser storage suited for larger structured saves, likely IndexedDB or a tested abstraction over it.
- Consider automatic periodic save plus manual backup.
- Design for many variables, items, skills, achievements, unlock flags, timers, and character records.
- Offline progress must count.
- Timed activities should save their start time, expected end time, owner character ID, activity ID, costs, and relevant resolution data.
- On app startup or resume, completed activities should be resolved from saved timestamps.
- Activity completion logic must be idempotent where practical, so reopening the app cannot double-claim rewards.
- Save data should track account-level unlocked race/class combinations and any completed unlock quests or milestones that grant those combinations.

## Asset And Image Pipeline

The project needs a reusable image pipeline because it will eventually require many icons and visual assets.

Expected assets:

- Item icons, likely hundreds over time.
- Skill icons.
- Activity icons.
- Achievement icons.
- Background images.
- UI decorative elements where useful.

Pipeline goals:

- Establish a consistent clean high-fantasy mobile game style before producing assets at scale.
- Generate assets in batches where possible.
- Use stable asset IDs and manifest keys instead of treating filenames as gameplay API.
- Keep source prompts/style rules documented.
- Prefer repeatable generation, normalization, sizing, and export steps.
- Document successful commands and workflows once proven.

Current visual direction: clean high-fantasy mobile game art. Pixel art is not the default anymore; it can still be used later for a specific asset family if intentionally chosen.

Important UI direction update on 2026-06-29: early implementation UI should be minimal and alpha/testing-friendly, not ornate or illustration-heavy. Use clean code-native components for navigation, cards, rows, forms, and buttons while mechanics and data are still changing. Fantasy artwork and richer theming can be layered in later once systems stabilize.

Primary pipeline document: `image_pipeline.md`.

Initial asset pipeline structure:

- `image_pipeline.md`
- `assets/README.md`
- `assets/prompts/icon-template.md`
- `assets/prompts/background-template.md`
- `assets/prompts/ui-element-template.md`
- `assets/prompts/screen-mockup-template.md`
- `assets/manifests/asset-manifest.example.json`

Asset categories covered:

- Item icons
- Skill, class, race, ability, and achievement icons
- Background images
- Reusable bitmap UI elements
- Screen mockups

Default asset paths:

- `assets/generated/icons/...`
- `assets/generated/backgrounds/...`
- `assets/generated/ui/...`
- `assets/generated/mockups/...`

Open decision: generate and review the first visual samples before locking final exact palette, icon shape language, and screen chrome.

## Development Workflow

Confirmed current state:

- Repository exists locally at `C:\Users\nikla\Documents\MobileIdler`.
- The repository now contains a React/Vite MVP, project documentation, and the asset pipeline.
- GitHub repository target: `nihansbu/MobileIdler`.
- Current GitHub repository: public `nihansbu/MobileIdler`.
- Live GitHub Pages URL: `https://nihansbu.github.io/MobileIdler/`.
- Deployment target: GitHub Pages via `.github/workflows/deploy-pages.yml`.
- The Pages workflow builds with `npm ci` and `npm run build`, uploads `dist`, and deploys from GitHub Actions.
- On 2026-06-29, GitHub rejected Pages enablement for the private repository on the current account plan: `Your current plan does not support GitHub Pages for this repository.`
- The GitHub Actions build step itself succeeds on GitHub. The deploy pipeline fails at `actions/configure-pages` because Pages cannot be enabled for this private repo in the current setup.
- The user approved making the source repository public on 2026-06-29 so the app can be tested live.
- Confirmed successful public Pages deployment on 2026-06-29: GitHub Actions run `28388691584`.
- Confirmed live mobile smoke test on `https://nihansbu.github.io/MobileIdler/`: account creation, character creation, RAP grant, activity start, and account return all passed without console errors.
- User workflow preference added on 2026-06-29: if the user sends an image without an explicit implementation prompt, only describe what is visible and do not change code.
- User workflow preference added on 2026-06-29: do not run a full deploy cycle for a tiny isolated UI fix when it can be bundled with useful feature work.

Required documentation workflow:

- Read `project_memory.md` before significant technical work.
- Read `game_design.md` before gameplay/system design work.
- Update `project_memory.md` when technical knowledge, working commands, failed approaches, architecture decisions, or workflow decisions are discovered.
- Update `game_design.md` when game mechanics, vision, progression, content, or design direction changes.

Required publish workflow:

- After a completed implementation prompt, run the relevant local verification first.
- At minimum for the current MVP, run `npm run build`.
- If UI behavior changed, run a mobile Playwright smoke test or equivalent browser verification.
- Commit the tested changes to Git.
- Push to `main` so GitHub Actions updates the GitHub Pages deployment.
- If the Pages run fails, fix the deployment problem before calling the work complete.
- For image-only messages, respond with an observation/description only unless the user also asks for a change.

## Known Working Commands

Confirmed:

```powershell
git status --short
```

```powershell
npm install
```

```powershell
npm run dev -- --port 5173
```

```powershell
npm run build
```

```powershell
gh auth status
```

```powershell
gh repo create MobileIdler --private --source=. --remote=origin --push
```

```powershell
gh run list --workflow deploy-pages.yml --limit 1
```

```powershell
gh run view <run-id> --log-failed
```

```powershell
gh repo edit nihansbu/MobileIdler --visibility public --accept-visibility-change-consequences
```

```powershell
gh api --method POST repos/nihansbu/MobileIdler/pages -f build_type=workflow
```

```powershell
gh workflow run deploy-pages.yml --ref main
```

```powershell
gh run watch <run-id> --exit-status
```

```powershell
Get-Content -Raw -LiteralPath 'assets\manifests\asset-manifest.example.json' | ConvertFrom-Json | Out-Null; Write-Output 'asset manifest example JSON is valid'
```

```powershell
Get-Content -Raw -LiteralPath 'assets\manifests\asset-manifest.json' | ConvertFrom-Json | Out-Null; Write-Output 'asset manifest JSON is valid'
```

## Known Issues And Caveats

- `localStorage` is the first MVP persistence layer. This is acceptable for the prototype but should become a versioned, backup-friendly save system before large progression data accumulates.
- Manual save export/import now exists, but it is still JSON-text based and should later become a more user-friendly file download/upload flow.
- GitHub Pages may expose the deployed game publicly even if the repository is private. Do not put secrets or sensitive data into the client app.
- Private GitHub Pages access control requires a suitable GitHub Enterprise Cloud organization setup.
- Private repository work can still affect GitHub profile contribution visibility depending on account settings.
- If names, races, classes, or references from existing franchises are used, remember that a GitHub Pages deployment may still be publicly reachable by link even when the repository is private. For a public-facing version, prefer original names or generic fantasy equivalents.
- Save stability must be designed before large gameplay expansion starts.

## Successful Solutions

### GitHub Pages Deployment Pipeline

Problem: The MVP needed to be available through a live link after tested implementation work.

Successful solution: Added a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`. The workflow runs on pushes to `main`, installs dependencies with `npm ci`, builds with `npm run build`, uploads the `dist` folder as a Pages artifact, and deploys with GitHub Pages actions. The source repository was changed to public with user approval because the current plan does not support Pages for the private repo.

Important implementation details:

- Local verification still matters before pushing. The current minimum check is `npm run build`.
- The deployed Pages site is publicly reachable at `https://nihansbu.github.io/MobileIdler/`.
- Future completed prompts should be committed and pushed to `main` after testing so the live Pages version updates automatically.
- After pushing, verify the GitHub Actions Pages run and check that the live URL returns HTTP 200.
- Run `28388691584` confirmed the public Pages path works end to end. The deploy step can take several minutes after the build job finishes.
- A Playwright mobile smoke test against the live URL confirmed the MVP flow after deployment.

Files involved:

- `.github/workflows/deploy-pages.yml`
- `project_memory.md`

### Manual Save Backup MVP

Problem: Save stability is a core project requirement, and the first MVP only stored state in `localStorage`.

Successful solution: Added a manual backup panel on the Progress screen. The player can export the current account save as JSON text and import a previously exported backup. Imported saves are validated against the current schema and then resolved for completed offline activities before being stored.

Important implementation details:

- Backup serialization lives in `src/game/save.ts`.
- `serializeAccountBackup` wraps the save with a `mobile-idler-save-backup` marker and export timestamp.
- `parseAccountBackup` accepts the wrapped backup and validates core account fields before import.
- The first UI is intentionally text-based for speed and debuggability; file download/upload can replace it later.

Commands used:

```powershell
npm run build
```

Local browser smoke test covered:

- Account creation.
- Character creation.
- Exporting a save.
- Rejecting invalid import text.
- Importing a valid backup.
- Returning to the account dashboard with imported account and character state visible.
- Ensuring the body uses `user-select: none` to reduce accidental mobile text selection.

Files involved:

- `src/game/save.ts`
- `src/App.tsx`
- `src/screens/ProgressScreen.tsx`
- `src/styles.css`
- `.gitignore`
- `project_memory.md`

### Initial Project Memory Setup

Problem: The repository did not yet contain the required persistent documentation files.

Successful solution: Created `project_memory.md` and `game_design.md` as required long-term reference documents and recorded the initial project constraints, architecture direction, and game design.

Commands used:

```powershell
Get-ChildItem -Force
git status --short
```

Files involved:

- `project_memory.md`
- `game_design.md`

### Foundational Game Architecture Decisions

Problem: The game needed early decisions for account-vs-character ownership, offline progress, hosting privacy, and asset direction before implementation.

Successful solution: Documented the following current decisions:

- The account starts with one character slot.
- Additional character slots are unlocked through account-wide progression milestones and RAP costs.
- Multiple characters can be active at the same time.
- One active activity per character.
- RAP, achievements, and inventory are account-wide.
- Skills are character-bound.
- Offline activity progress must count.
- Inventory is not required for the first prototype.
- Icon direction is clean high-fantasy mobile game art.
- Repository should be private; hosted site may be reachable by link.

Files involved:

- `project_memory.md`
- `game_design.md`

### Character Slot Progression Decision

Problem: Unlimited early character creation would undermine progression because multiple active characters are a major account-wide power increase.

Successful solution: Start the account with one character slot. Additional character slots should be unlocked later through milestones and RAP spending as account-wide progression or quality-of-life upgrades.

Files involved:

- `project_memory.md`
- `game_design.md`

### Initial Gameflow Skeleton

Problem: The project needed a first structured gameflow from brainstormed ideas about classes, races, passive combat, rare drops, achievements, regions, and gated progression.

Successful solution: Documented an initial design where the player creates a character, earns RAP, assigns timed activities, unlocks regions/systems through level and achievement gates, hunts bosses repeatedly for loot tables and ultra-rare collectibles, and unlocks account-wide bonuses such as character slots and quality-of-life upgrades.

Important implementation implication: combat, loot, achievements, unlocks, character classes, races, equipment, regions, and account upgrades should be separate data-driven systems rather than hard-coded inside UI screens.

Files involved:

- `project_memory.md`
- `game_design.md`

### Account Dashboard Flow Decision

Problem: A traditional character-select-first flow would become clumsy once the account has multiple characters running parallel activities.

Successful solution: Use an account-first flow. The player selects a local save profile/account first, then manages characters from an account dashboard. Characters function like assignable workers that can be placed on activities. Character select and detail screens are still useful, but the main game loop should not require exiting back to character select for every assignment.

Files involved:

- `project_memory.md`
- `game_design.md`

### Character Creation And Race/Class Unlock Decision

Problem: Character creation needs to feel meaningful and support long-term meta-progression instead of allowing every race/class combination from the start.

Successful solution: Design character creation as a polished, data-driven flow. Race selection gets themed visuals, descriptions, and one passive. Class selection depends on race compatibility and account unlocks. Classes start with two passives. Locked combinations can become progression goals and can be unlocked later through RAP, milestones, achievements, or special quests.

Files involved:

- `project_memory.md`
- `game_design.md`

### Reusable Image Pipeline Setup

Problem: The project will need many recurring visual assets: item icons, skill icons, class/race icons, backgrounds, UI elements, and screen mockups. Without a documented pipeline, asset generation would become inconsistent and repetitive.

Successful solution: Created `image_pipeline.md`, prompt templates, an asset README, and an example manifest. The default style is now clean high-fantasy mobile game art rather than pixel art. The pipeline defines asset categories, folder paths, prompt templates, transparent icon workflow, naming rules, manifest rules, and quality checks.

Files involved:

- `image_pipeline.md`
- `assets/README.md`
- `assets/prompts/icon-template.md`
- `assets/prompts/background-template.md`
- `assets/prompts/ui-element-template.md`
- `assets/prompts/screen-mockup-template.md`
- `assets/manifests/asset-manifest.example.json`
- `project_memory.md`
- `game_design.md`

### Character Creation Mockup Generation

Problem: The project needed first visual direction for the mobile-only character creation flow before implementing account creation and character creation screens.

Successful solution: Generated three clean high-fantasy 9:16 mobile screen mockups using the built-in image generation tool and saved them under the project asset pipeline:

- `assets/generated/mockups/character_creation/race_selection_human.png`
- `assets/generated/mockups/character_creation/class_selection_orc_warrior.png`
- `assets/generated/mockups/character_creation/final_review_undead_mage.png`

Useful design takeaways:

- Use a compact three-step progress indicator at the top.
- Race selection benefits from one large selected-race hero panel plus smaller race tiles.
- Class selection should show allowed and locked classes together, with locked combos as future goals.
- Final review should summarize name, race, class, slot usage, and passives before character creation.
- Generated text is not source-of-truth copy; implement labels and descriptions in code.

Files involved:

- `assets/generated/mockups/character_creation/README.md`
- `assets/manifests/asset-manifest.json`
- `project_memory.md`

### Minimal Alpha UI Mockup Generation

Problem: The first ornate high-fantasy character creation mockups were too overloaded for the project's early stage. The UI needs to stay flexible while mechanics, values, items, and progression systems are still changing.

Successful solution: Generated three minimal mobile alpha UI mockups and saved them under the project asset pipeline:

- `assets/generated/mockups/minimal_alpha_ui/variant_a_dark_race_wizard.png`
- `assets/generated/mockups/minimal_alpha_ui/variant_b_light_account_dashboard.png`
- `assets/generated/mockups/minimal_alpha_ui/variant_c_dark_activity_assignment.png`

Useful design takeaways:

- Prefer simple DOM-driven app screens for the first implementation.
- Use a reusable app shell, likely with bottom navigation.
- Variant B is the cleanest reference for the account dashboard.
- Variant C is the clearest reference for dense activity assignment.
- Variant A keeps the race/class/review wizard idea but strips out heavy art.
- Generated text remains reference-only; source-of-truth labels belong in code/content data.

Files involved:

- `assets/generated/mockups/minimal_alpha_ui/README.md`
- `assets/manifests/asset-manifest.json`
- `assets/prompts/screen-mockup-template.md`
- `image_pipeline.md`
- `project_memory.md`
- `game_design.md`

## Failed Approaches

### Enabling GitHub Pages Directly On Private Repo With Current Plan

Problem: The project should stay private while being deployed to GitHub Pages.

Failed approach: Creating a private repository and enabling GitHub Pages directly on that repository with the current GitHub account plan.

Commands used:

```powershell
gh repo create MobileIdler --private --source=. --remote=origin --push
gh api --method POST repos/nihansbu/MobileIdler/pages -f build_type=workflow
gh run view 28387915916 --log-failed
```

Observed result:

- `gh api` returned `Your current plan does not support GitHub Pages for this repository.`
- The first Pages workflow failed at `actions/configure-pages` because the repository had no enabled Pages site.
- After updating the workflow to `actions/configure-pages@v6` with `enablement: true`, run `28388037409` still failed at Pages creation with `Resource not accessible by integration`. The GitHub Actions `npm ci` and `npm run build` steps succeeded before the Pages enablement failure.

Do not repeat this exact approach unless the GitHub plan changes. Safer fallback: keep the source repository private and deploy `dist` to a separate public Pages repository after user approval.

### Ornate High-Fantasy Mockups As Early UI Target

Problem: The initial character creation mockups were visually rich but too overloaded for the current early-stage implementation.

Failed approach: Treating ornate fantasy-art-heavy screens as the first implementation target.

Why not repeat: Mechanics, values, items, activities, and progression systems are still fluid. Heavy art direction makes iteration slower and can obscure the core information architecture.

Better current approach: Use minimal alpha/testing UI with reusable DOM components first. Keep the ornate mockups only as long-term mood references.

### React/Vite MVP Implementation

Problem: The project needed a playable MVP based on the minimal Type-C alpha UI direction.

Successful solution: Implemented a React/Vite/TypeScript MVP with:

- Local account creation (`LuckyBoo` default).
- Account-first app shell with dark mobile UI.
- Reusable bottom navigation.
- Account dashboard with RAP, character slots, active character cards, and next slot unlock.
- Character creation with data-driven races/classes, passives, and locked race/class combinations.
- Activity assignment screen based on Type-C mockup with three starter activities.
- RAP spending and `+10,000 RAP` prototype button.
- localStorage save/load.
- Timestamp-based activity completion resolver for offline progress.
- Progress screen with activity log and reset.

Important implementation details:

- Content definitions live under `src/data/`.
- Save and simulation logic live under `src/game/`.
- Reusable shell/components live under `src/components/`.
- Screens live under `src/screens/`.
- The UI currently intentionally avoids image-heavy fantasy art for iteration speed.

Commands used:

```powershell
npm install
npm install -D @types/react @types/react-dom playwright
npx playwright install chromium
npm run build
npm run dev -- --port 5173
```

Files involved:

- `package.json`
- `package-lock.json`
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `src/`
- `.gitignore`
- `project_memory.md`
- `game_design.md`
