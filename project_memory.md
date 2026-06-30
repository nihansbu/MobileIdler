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
- Account-wide state includes RAP, skills, combat level, achievements, inventory, unlock flags, collections, and long-term progression.
- Character-bound state currently includes race, class, passives, and each character's current activity. Characters act as assignable workers that feed progress back into the account.
- The account should track an explicit roster order for characters. The roster has up to seven slots, unlocked over time. Slot order is meaningful: lower slot numbers have higher priority.
- Empty unlocked roster slots are visible and can receive an existing character via drag/drop or create a new character, but empty slots are not themselves draggable.
- The currently active character is the default worker used when starting a character activity. After starting an activity, the UI should auto-select the next idle character in roster order if one exists.
- If a higher-priority character becomes idle later, the app should not automatically steal focus back. Instead, the top bar should indicate that a higher-priority idle character is available and let the player switch manually.
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
- Universal requirements
- Universal rewards
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
- The Activity screen should no longer own a repeated character overview once the roster/active-worker model is implemented. It should use the globally active character from the app shell/top bar.
- The expanded top bar should expose a compact active-character controller: character icon, name, race, class, shared combat level, and previous/next roster navigation arrows.
- Top bar character navigation arrows follow roster priority: the left arrow switches to a higher-priority idle character and should visually highlight when one is available; the right arrow switches to a lower-priority idle character when available. Disabled arrows are greyed out.
- Implementation decision added on 2026-06-29: use a tap-based Move Mode for roster reordering instead of free mobile drag-and-drop. In Move Mode, the player taps a filled source slot, then a filled or empty target slot. Empty slots cannot be selected as a source.

Implementation implication: route/state design should be account-first. Character IDs should be referenced by activities; UI screens should not assume there is one globally selected active character.

## Codex Module Architecture

Design decision added on 2026-06-30: the Codex replaces the old Progress bottom-nav screen as the account's read-only long-term progress hub. It should summarize account completion, collections, records, and achievements without starting gameplay actions.

Initial Codex structure:

- Overview: compact account-level summary.
- Collection: Collector Items, Mounts, Pets, Skins, and future cosmetic/collection groups.
- Records: aggregate counters from gameplay modules, such as activity completions, exploration discoveries, unique explored regions, future boss kills, and dungeon runs.
- Achievements: achievement completion and achievement points.

Overview row-pair rules:

- Combat Level beside Total Skill Level.
- Skills at 99 beside Skills at 120.
- Total Quests beside Quest Points.
- Achievements beside Achievement Points.
- Unique Records beside Records.
- Collection count beside Collection percentage.

Implementation notes:

- `ViewId` should use `codex` rather than `progress`.
- Bottom navigation label should be `Codex`.
- Codex summary values should be derived from existing account state where possible.
- Systems not implemented yet, such as quests, achievements, and real collection ownership, may expose placeholder totals and zero completed counts until save-backed data exists.
- Collection percentage should be displayed with three decimal places to support thousands of collectibles.
- Save backup/export/import needs a future Settings home if it is removed from the old Progress screen.

## Universal Requirements And Rewards Architecture

Design decision added on 2026-06-29: the game needs one flexible requirements and rewards model that can be reused by activities, items, quests, bosses, regions, skills, unlocks, account upgrades, race/class combinations, and future systems.

Requirements should be optional and data-driven. Supported requirement types should include, at minimum:

- Skill level requirements.
- Quest completion requirements.
- Item ownership or collection requirements.
- Achievement requirements.
- Account unlock flags.
- Region progress or point-of-interest discovery.
- Boss kill counts or dungeon completion.
- RAP cost or spend requirements.
- Combat level requirements.
- Race/class or character-type requirements where content intentionally depends on the worker.

Requirements are hard gates for now. If the account does not meet the requirement, the content cannot be started, completed, bought, equipped, or claimed, depending on the entity. Temporary boosts and potion-style bypasses are intentionally out of scope for the initial system.

Rewards should also be optional and data-driven. Supported reward types should include, at minimum:

- Skill XP.
- RAP changes where needed.
- Items or stackable resources.
- Drop table rolls with explicit chances, including ultra-rare drops such as 1/500 mounts.
- Unlock flags.
- Achievement progress or completion.
- Quest progress.
- Region progress.
- Account upgrades or quality-of-life unlocks.

Implementation implication: build requirement evaluation and reward application as shared game-domain helpers, not as UI-specific branches. Content definitions should be able to declare `requirements` and `rewards` without every screen inventing its own format.

## Account-Wide Skill System Architecture

Design decision added on 2026-06-29: skills are account-wide progression, not character-bound progression. Characters are the workers that perform actions, but XP and unlock progress go back into the account.

Skill system requirements:

- Include the full RuneScape-style skill roster used by this project.
- Levels run from 1 to 120.
- Store XP as the source of truth and derive visible levels from the XP curve.
- Use the RuneScape XP curve, with level 99 around 13,034,431 XP and level 120 around 104,273,167 XP.
- XP may continue beyond level 120 up to a hard cap of 200,000,000 XP per skill.
- All skills should be visible in the Skills screen from the start.
- Locked skills still count toward total level.
- Locked skills cannot receive XP before they are unlocked.
- Invention, Necromancy, and Sailing are locked until total level 800.
- Total level should include locked skills, using their current level values.
- Skill levels can be used as requirements by any content entity.
- Skill XP can be granted by any content entity through the universal reward system.
- Activities do not need a single fixed main skill. Each activity can define no skill XP, one skill XP reward, or several skill XP rewards.

Initial skill roster uses only official RuneScape 3 and Old School RuneScape skills. Do not add homebrew skills to the roster unless the user explicitly asks for custom skills later.

- Attack
- Strength
- Defence
- Constitution
- Ranged
- Magic
- Prayer
- Summoning
- Necromancy
- Mining
- Smithing
- Fishing
- Cooking
- Firemaking
- Woodcutting
- Crafting
- Fletching
- Runecrafting
- Construction
- Agility
- Herblore
- Thieving
- Slayer
- Farming
- Hunter
- Divination
- Dungeoneering
- Invention
- Archaeology
- Sailing

Combat level is account-wide and replaces character level as the main power indicator. Every character on the account has the same combat level. The combat level should be displayed with two decimal places. Combat level itself can later be used as a requirement type.

Current combat formula decision: Slayer is treated as a combat skill for this project. In German RuneScape terminology this maps to Berserker. Requirements use the floored whole combat level, while display keeps two decimal places.

Implementation plan for the next coding step:

1. Add skill definitions and XP-curve helpers under the game/data layer.
2. Extend account save state with account-wide skill XP and unlocked skill flags.
3. Add a schema migration or defensive initialization path for existing localStorage saves.
4. Add shared requirement and reward types plus evaluator/applicator helpers.
5. Add combat level and total level selectors derived from account skills.
6. Add an Explore module with region definitions, discovery tracks, and tick-based resolution.
7. Add a dedicated Skills screen or subpage and expose it through navigation.
8. Remove old MVP character XP/level from visible UI rather than migrating it.

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
- Account skill XP and skill unlock state must be migration-safe because skills are a long-term progression layer.
- Save data should keep skill XP as account state; visible levels and total level should be derived from definitions and XP tables.
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

Current icon direction: old-school low-pixel fantasy RPG icons inspired by early MMORPG inventory icons. The style should be chunky, charming, readable at 24-32px, grounded, and low-detail rather than polished high-fantasy or Warcraft-like. Transparent final icons should be placed onto CSS-authored UI tiles rather than baking backgrounds into the asset.

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

Current first icon style anchor: the combat-level icon should use two crossed short iron swords, no shield, no badge, no ornate crest, no magical glow, on a transparent final background.

Top-bar icon implementation update on 2026-06-30:

- Combat level, RAP currency, and the RAP-earning action now use generated old-school low-pixel PNG icons instead of text-only labels or lucide placeholders.
- Top-bar icons are imported through Vite with `new URL(..., import.meta.url).href`.
- Final transparent app assets are stored at:
  - `assets/generated/icons/stats/combat_level.png`
  - `assets/generated/icons/currencies/rap.png`
  - `assets/generated/icons/actions/earn_rap.png`
- Master transparent source assets are stored beside them with `_master.png` suffixes.
- The RAP currency icon is a gold token with a walking/bootprint mark.
- The earn-RAP action icon is a walking boot with a small gold token accent.
- Both new icons are first-pass draft assets and can be replaced if the visual direction changes.

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
- Account UI decision added on 2026-06-29: character management belongs inside the Account screen, not as a primary bottom-nav item.
- Character slot UX decision added on 2026-06-29: buying/unlocking a character slot must not automatically prompt character creation. It should only make capacity available; the player creates a character later by pressing a Create button.
- Mobile shell decision added on 2026-06-29: the top bar and bottom navigation should remain visible while only the body content scrolls. Top bar and bottom navigation can be collapsed and expanded separately to give the body more space.
- Mobile shell update added on 2026-06-29: top bar and bottom navigation collapse/expand through matching thin arrow rows. The top arrow row sits below the top bar; the bottom arrow row sits above the bottom nav.
- RAP prototype button decision added on 2026-06-29: the large Account-screen `+10,000 RAP` button is removed. The player gains 10,000 RAP by pressing the plus button in the top bar.
- Activity screen UX decision added on 2026-06-29: the activity catalog must remain visible even when there is no idle character or no character exists yet. In those states, start buttons are disabled instead of hiding the content.
- Activity architecture decision added on 2026-06-29: `Activity` is the umbrella term for character-executed game actions. Activities should be grouped into modules, with Explore as the first real module.
- Explore module decision added on 2026-06-29: regions use tick-based simulation. Each region can define requirements, RAP cost, duration, tick interval, repeat rewards, discovery tracks, and completion rewards.
- Region discovery decision added on 2026-06-29: early region content can be represented by counters such as Region Quests, Treasures, Points of Interest, World Bosses, and Secrets. These counters do not need fully authored objects at first.
- Reward timing decision added on 2026-06-29: long activities should not grant only one final reward. They should roll repeat rewards and discovery chances per simulation tick, with offline progress resolved by elapsed tick count.
- Combat requirement decision added on 2026-06-29: combat level is displayed with decimals but requirements use whole levels, checked against the floored combat level.
- Implemented on 2026-06-29: save schema v2 with account-wide skill XP, unlocked skill IDs, region progress, and active activity resolved tick counts.
- Implemented on 2026-06-29: first Skills screen exposed in the bottom navigation.
- Implemented on 2026-06-29: first Explore module slice with Old Road, tick rewards, discovery tracks, and offline tick resolution.
- Implemented on 2026-06-29: old visible Character XP/level UI was removed instead of migrated. Characters now display race/class, shared combat level, and current activity/tick state.
- Skill roster correction added on 2026-06-29: the roster should include only official RuneScape 3 or Old School RuneScape skills unless the user explicitly asks for custom skills. Perception was removed as a homebrew skill.
- Slayer/Berserker decision added on 2026-06-29: use the official English `Slayer` skill in UI/data, and treat it as the user's Berserker combat skill for this project's combat-level calculation.
- Skills UI decision added on 2026-06-29: remove the `Req` summary stat, remove visible skill categories, and show all skills in one mobile viewport through a compact 4-column grid.

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
- If Vite serves a stale deleted module after a structural refactor, start a fresh dev server on a new port and test there instead of debugging a phantom source import.
- For layout changes, verify that `body` is not the scroll container and `.screen` is the scroll container in a mobile Playwright viewport.

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

Current status update on 2026-06-30: the old Progress screen has been replaced by Codex in the bottom navigation. The backup serialization/parsing helpers remain in `src/game/save.ts`, but the backup UI needs a future Settings location before it is user-facing again.

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

### Codex MVP

Problem: The old Progress screen was too narrow for the game's long-term progression goals. The user wanted a Codex-style area that motivates collection and completion through overview stats, collections, records, and achievements.

Successful solution: Replaced the Progress bottom-nav destination with Codex. Added `src/game/codex.ts` for derived Codex summary data and `src/screens/CodexScreen.tsx` for the UI. The Codex is read-only from a gameplay perspective and does not start activities.

Important implementation details:

- `ViewId` now uses `codex` instead of `progress`.
- Bottom navigation label is `Codex` and uses a book icon.
- Codex tabs are `Overview`, `Collection`, `Records`, and `Achievements`.
- Overview stat pairs are implemented in the requested row order:
  - Combat Level / Total Skill Level
  - Skills at 99 / Skills at 120
  - Total Quests / Quest Points
  - Achievements / Achievement Points
  - Unique Records / Records
  - Collection / Collection %
- Combat level, total level, and skill milestone counts are derived from account skill XP.
- Records derive from existing account state: completed activities, exploration discoveries, and explored regions.
- Collection totals are placeholder structure for the future collection save model: 3,800 Collector Items, 80 Mounts, 60 Pets, and 60 Skins for 4,000 total.
- Achievement totals are placeholder structure: five starter categories with eight achievements each.
- Collection percentage is formatted with three decimal places.
- The old `src/screens/ProgressScreen.tsx` was removed to avoid maintaining two competing progress surfaces.

Commands used:

```powershell
npm run build
```

```powershell
npm run dev -- --port 5181
```

Local browser smoke test covered:

- Bottom navigation shows `Codex` instead of `Progress`.
- Codex opens to `Overview`.
- Overview contains the requested stat pairs and values.
- Collection, Records, and Achievements tabs switch correctly.
- Records tab reflects seeded completed activities and exploration discoveries.
- No `Explore` activity-start button appears in Codex.
- Top bar collapse/expand still works.
- No console errors.

Files involved:

- `src/App.tsx`
- `src/types.ts`
- `src/components/AppShell.tsx`
- `src/components/icons.tsx`
- `src/game/codex.ts`
- `src/screens/CodexScreen.tsx`
- `src/screens/ProgressScreen.tsx`
- `src/styles.css`
- `project_memory.md`
- `game_design.md`

### Account-Integrated Character Management

Problem: The separate Characters bottom-nav item made the game feel character-first instead of account-first. The user wanted character management moved into Account, while preserving player agency after buying a character slot.

Successful solution: Removed Characters from the primary bottom navigation and moved character creation into the Account screen. The Account screen now owns roster display, first-character creation, optional creation for free slots, slot unlock display, assignment entry point, XP progress, and active activity timers.

Important implementation details:

- Superseded on 2026-06-30: `ViewId` now contains `account`, `activities`, `skills`, and `codex`.
- `CharacterCreator` is a reusable component under `src/components/`.
- `AccountScreen` controls whether the creation panel is open.
- Unlocking the second slot only increases `characterSlots`; it does not open the creation panel.
- Superseded on 2026-06-29: character cards no longer show character level/XP. They now show race/class, shared combat level, status, and active activity tick state.
- Superseded on 2026-06-29: `xpForNextLevel` and visible character XP were removed when account-wide skills were implemented.
- Superseded on 2026-06-29: activity logs no longer mention character level gains; they now log activity completion and region discoveries.
- Activity category tabs now filter the visible activities.

Commands used:

```powershell
npm run build
```

Local browser smoke test covered:

- Characters nav item is no longer visible.
- First character can be created from Account.
- Locked race/class combinations remain disabled.
- Buying the next character slot does not open character creation automatically.
- Activity assignment still works after the navigation change.
- Account screen shows active activity timer and XP block.

Files involved:

- `src/App.tsx`
- `src/types.ts`
- `src/components/AppShell.tsx`
- `src/components/CharacterCreator.tsx`
- `src/screens/AccountScreen.tsx`
- `src/screens/ActivitiesScreen.tsx`
- `src/game/simulation.ts`
- `src/styles.css`
- `project_memory.md`
- `game_design.md`

### Collapsible Fixed Mobile App Shell

Problem: The top bar and bottom navigation scrolled away with the page body, which made the mobile app feel less like a persistent game UI. The user wanted both bars to stay visible and to be separately collapsible so the body can gain more usable space.

Successful solution: Updated `AppShell` and layout CSS so the app uses a fixed-height `100dvh` shell with `overflow: hidden`, while `.screen` is the only scroll container. Added independent React state for top bar collapse and bottom navigation collapse. Both bars use matching thin arrow rows for collapse/expand: the top row sits below the top bar, and the bottom row sits above the bottom nav. Each collapsed bar leaves its arrow row visible so it can be expanded again.

Important implementation details:

- `src/components/AppShell.tsx` owns `isTopCollapsed` and `isNavCollapsed`.
- Expanded top bar shows account name, RAP, and a plus button.
- Pressing the top bar plus button grants 10,000 RAP in the current prototype.
- Top bar collapse/expand uses `top-collapse-button`, not an icon inside the top bar.
- Expanded bottom shell shows a small collapse strip plus the primary nav.
- Collapsed top and bottom shells keep only their arrow rows visible.
- `src/styles.css` sets `.app-shell` to `height: 100dvh` and `.screen` to `overflow: auto`.
- The Account screen no longer contains the large `+10,000 RAP` button.

Commands used:

```powershell
npm run build
```

```powershell
npm run dev -- --port 5175
```

Local browser smoke test covered:

- Account setup and character creation still work.
- `body` is not the scroll container.
- `.screen` is the scroll container.
- Top bar collapses and expands.
- Bottom navigation collapses and expands separately.
- Superseded on 2026-06-30: bottom navigation now contains Account, Activities, Skills, and Codex after expanding.
- Top bar plus adds 10,000 RAP.
- Account screen no longer contains the old large RAP button.

Files involved:

- `src/components/AppShell.tsx`
- `src/components/icons.tsx`
- `src/App.tsx`
- `src/screens/AccountScreen.tsx`
- `src/styles.css`
- `project_memory.md`
- `game_design.md`

### Always-Visible Activity Catalog

Problem: The Activity screen returned an empty-state-only view when every character was busy, hiding the actual activities. The user wanted to inspect activities even when no character is currently available to start one.

Successful solution: Removed the early return for "no idle character" from `ActivitiesScreen`. The screen now always renders the activity tabs and filtered activity list. When no character exists, activity buttons are disabled and labelled `Locked`. When all characters are busy, activity buttons are disabled and labelled `Busy`. Requirement text explains the blocking state.

Commands used:

```powershell
npm run build
```

Local browser smoke test covered:

- Activities are visible before any character exists.
- No-character start buttons are disabled and labelled `Locked`.
- Activities remain visible while all characters are busy.
- Busy-state start buttons are disabled and labelled `Busy`.
- Category tabs still switch visible activities while all characters are busy.

Files involved:

- `src/screens/ActivitiesScreen.tsx`
- `project_memory.md`
- `game_design.md`

### Account-Wide Skills, Requirements, And Rewards Design

Problem: The next major content layer needs to support RuneScape-style skills, hard unlock gates, loot tables, rare drops, combat requirements, account upgrades, and future quests without scattering custom logic across every screen.

Successful solution: Defined a shared data-driven architecture where skills are account-wide, characters act as workers, and content can declare optional `requirements` and `rewards`. Requirements are hard gates for now. Rewards can grant XP, items, drop-table rolls, unlock flags, achievement progress, quest progress, region progress, or account upgrades.

Important implementation details:

- Skills belong to the account, not individual characters.
- XP is stored per account skill and levels are derived from the RuneScape XP curve.
- Skills run from level 1 to 120, with XP continuing up to 200,000,000 per skill.
- Invention, Necromancy, and Sailing are visible but locked until total level 800.
- Locked skills still count toward total level but cannot receive XP until unlocked.
- Combat level is account-wide, shown with two decimals, and replaces character level as the primary shared power indicator.
- Slayer is treated as a combat skill for this project; in German RuneScape terminology this maps to Berserker.
- Combat level can later be used as a requirement type.

Files involved:

- `project_memory.md`
- `game_design.md`

### Account-Wide Skills And Explore Tick MVP

Problem: The app needed to become more playable than the initial placeholder activities. The user wanted account-wide RuneScape-style skills, whole-number combat-level gates with decimal display, and an Explore module where regions progress through repeated discovery rolls instead of one final reward.

Successful solution: Implemented save schema v2 and the first real progression slice:

- Account-wide skill XP for the full skill roster.
- RuneScape-style XP curve from level 1 to 120, with XP continuing to 200,000,000.
- Skills screen in the bottom navigation.
- Locked skill display for Invention, Necromancy, and Sailing until total level 800.
- Account-wide combat level display with two decimals.
- Combat level requirements use whole levels via the floored combat level.
- Character XP/level removed from visible UI instead of migrated.
- Explore module with the first region, Old Road.
- Old Road has tick-based rewards every 10 seconds for prototype testing.
- Old Road discovery tracks: Region Quests, Treasures, Points of Interest, World Bosses, and Secrets.
- Offline/reload progress resolves elapsed ticks and applies skill XP, discoveries, completion logs, and region progress.

Important implementation details:

- `src/types.ts` now uses `schemaVersion: 2`.
- `src/game/save.ts` migrates v1 saves to v2 and initializes all account skills.
- Old v1 placeholder active activities are discarded during migration because their content IDs no longer exist.
- `src/game/skills.ts` owns XP thresholds, skill levels, total level, locked-skill checks, and combat level.
- `src/game/requirements.ts` owns shared requirement checks and labels.
- `src/game/simulation.ts` resolves ticks incrementally while the app is open and in aggregate after offline/reload.
- `src/data/activities.ts` now defines Explore region content rather than generic placeholder activities.

Commands used:

```powershell
npm run build
```

```powershell
npm run dev -- --port 5176
```

Local browser smoke test covered:

- Fresh account creation.
- Character creation.
- Adding RAP through the top bar.
- Starting Explore Old Road.
- Waiting for a live tick and confirming skill XP appears in Skills.
- Superseded on 2026-06-30: Old Road region progress is now summarized through Codex Records and still appears on the Account screen.
- Forcing a saved activity into the past and reloading to verify offline tick resolution.
- Confirming completed activity count, region tracks, activity log, combat level, and total level update.
- Mobile screenshot check at 393 x 852 with no visible overlap.

Files involved:

- `src/types.ts`
- `src/data/activities.ts`
- `src/data/skills.ts`
- `src/game/save.ts`
- `src/game/skills.ts`
- `src/game/requirements.ts`
- `src/game/simulation.ts`
- `src/App.tsx`
- `src/components/AppShell.tsx`
- `src/components/CharacterCreator.tsx`
- `src/screens/AccountScreen.tsx`
- `src/screens/ActivitiesScreen.tsx`
- `src/screens/SkillsScreen.tsx`
- `src/screens/ProgressScreen.tsx`
- `src/styles.css`
- `project_memory.md`
- `game_design.md`

### Skill Roster And Compact Skills UI Correction

Problem: The first Skills screen contained a homebrew `Perception` skill, a confusing `Req` summary stat, visible skill categories, and a tall list layout that required scrolling on mobile.

Successful solution: Removed `Perception`, kept the official `Slayer` skill and treated it as the user's Berserker combat skill for this project's combat-level calculation. Removed visible skill categories from the player-facing UI. Removed the `Req` summary stat. Reworked the Skills screen into a compact 4-column mobile grid with skill name, level number, and a mini XP-to-next progress bar. Locked skills show compact `TL 800` requirements.

Important implementation details:

- The skill roster should contain only official RuneScape 3 or Old School RuneScape skills unless the user explicitly asks for custom skills.
- `src/game/save.ts` now normalizes skill XP through the current skill list, which drops stale `perception` XP from existing local saves.
- The UI uses the official English skill name `Slayer`; design notes map this to Berserker in German RuneScape terminology.
- The local mobile check confirmed 30 skill tiles, no `Perception`, no `Req`, no visible category labels, and no Skills-screen scroll at 393 x 852.

Reference sources checked:

- RuneScape official skill guide: https://www.runescape.com/game-guide/skills
- Old School RuneScape Sailing: https://secure.runescape.com/m=news/sailing---the-journey-so-far

Files involved:

- `src/types.ts`
- `src/data/skills.ts`
- `src/data/activities.ts`
- `src/game/save.ts`
- `src/game/skills.ts`
- `src/screens/SkillsScreen.tsx`
- `src/styles.css`
- `project_memory.md`
- `game_design.md`

### Active Character Top Bar And Account Roster

Problem: The Activity screen repeated character-selection UI and the account lacked a clear prioritized roster. The user wanted the currently active character to be globally visible in the top bar, activities to use that active character, and character ordering to become a real gameplay priority system.

Successful solution: Implemented save schema v3 with persistent `activeCharacterId` and fixed seven-position `rosterSlots`. The Account screen now displays unlocked slots as a centered roster. Filled slots can be moved through a mobile-friendly Move Mode: tap `Move`, tap a filled source slot, then tap a filled or empty target slot. Empty slots can receive characters or start character creation, but cannot be selected as a move source.

Important implementation details:

- `src/game/roster.ts` owns roster normalization, active-character lookup, higher/lower idle navigation, post-start idle selection, slot movement, and slot placement.
- Existing schema v1 and v2 saves migrate to schema v3 through `src/game/save.ts`.
- The top bar now shows account name, active character name, race, class, shared combat level, priority arrows, RAP, and the RAP plus button.
- The left top-bar arrow highlights amber when a higher-priority idle character is available.
- The right top-bar arrow switches to the next lower-priority idle character.
- Starting an activity uses the globally active character and then auto-selects the next idle character in roster order.
- If a higher-priority character finishes later, the app does not auto-switch focus back; the arrow indicates availability instead.
- The Activity screen no longer renders its own character card or character select.
- The Old Road activity-card title/description layout was tightened so the title and description no longer run together.

Commands used:

```powershell
npm run build
```

```powershell
npm run dev -- --port 5178
```

```powershell
npx playwright install chromium
```

Local browser smoke test covered:

- Schema v3 seeded account with four unlocked slots, three characters, and one empty slot.
- Top bar initially showed active character Aetheron.
- Activity screen rendered without `.selected-character`.
- Starting Explore Old Road with Aetheron switched active character to Borin.
- Higher-priority arrow stayed disabled while Aetheron was busy.
- Lower-priority arrow switched from Borin to Mira.
- Higher-priority arrow then became enabled and switched back to Borin.
- Move Mode moved Mira from slot 3 to empty slot 4.
- Schema v2 save migrated to schema v3 and rendered the legacy character in the top bar without console errors.

Files involved:

- `src/types.ts`
- `src/game/save.ts`
- `src/game/roster.ts`
- `src/App.tsx`
- `src/components/AppShell.tsx`
- `src/components/icons.tsx`
- `src/screens/AccountScreen.tsx`
- `src/screens/ActivitiesScreen.tsx`
- `src/styles.css`
- `project_memory.md`
- `game_design.md`

### Combat Level Icon Asset And Top Bar Stat

Problem: The first generated icon directions were too polished/high-fantasy. The user wanted a RuneScape-like old-school low-pixel icon style and asked to start by integrating a combat-level icon into the top bar.

Successful solution: Generated an old-school low-pixel crossed-swords combat icon on a flat green chroma-key background, removed the background locally, preserved a master asset, created a 256x256 transparent app asset, registered it in the asset manifest, and imported it into the React top bar with Vite.

Important implementation details:

- Final app asset: `assets/generated/icons/stats/combat_level.png`.
- Master asset: `assets/generated/icons/stats/combat_level_master.png`.
- Manifest ID: `stat_combat_level`.
- `src/components/AppShell.tsx` imports the image via `new URL('../../assets/generated/icons/stats/combat_level.png', import.meta.url).href`.
- Combat level is now displayed as a separate top-bar stat with the crossed-swords icon and numeric value.
- Combat level text was removed from the active-character text block because combat level is account-wide.
- The right top-bar character arrow now uses the same amber `available` state as the left arrow when a lower-priority idle character is available.
- `image-rendering: pixelated` is used for the top-bar combat icon so the low-pixel style survives scaling.

Commands used:

```powershell
python -m pip install --user pillow
```

```powershell
python "C:\Users\nikla\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py" --input "tmp\imagegen\combat_level_chroma.png" --out "assets\generated\icons\stats\combat_level.png" --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 220 --despill
```

```powershell
npm run build
```

```powershell
npm run dev -- --port 5179
```

Local browser smoke test covered:

- Combat icon is visible in the top bar.
- Active-character text no longer contains combat level.
- Combat stat displays the numeric combat level next to the icon.
- Right arrow has `character-switch available` when a lower-priority idle character exists.
- Clicking the right arrow switches active character.
- No console errors.

Files involved:

- `assets/generated/icons/stats/combat_level.png`
- `assets/generated/icons/stats/combat_level_master.png`
- `assets/manifests/asset-manifest.json`
- `src/components/AppShell.tsx`
- `src/styles.css`
- `image_pipeline.md`
- `project_memory.md`
- `game_design.md`

### Stale Vite Module After Deleted Screen

Problem: After deleting `src/screens/CharactersScreen.tsx`, the already-running Vite dev server on port 5173 continued serving a stale browser module graph that requested the deleted file, leaving the local app blank even though `npm run build` succeeded.

Successful solution: Started a fresh Vite dev server on port 5174 and reran the Playwright smoke test there. The fresh server loaded the current source graph correctly.

Commands used:

```powershell
npm run build
```

```powershell
npm run dev -- --port 5174
```

Files involved:

- `src/screens/CharactersScreen.tsx`
- `src/App.tsx`

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
- Skills are account-wide.
- Combat level is account-wide and replaces character level as the primary shared power indicator.
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
- Superseded on 2026-06-30: the old Progress screen was replaced by the Codex module.

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
