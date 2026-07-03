# MobileIdler Game Design

## Overall Vision

MobileIdler is a private mobile-only idle progression game where in-game growth is powered by real-world activity. The player earns Real Life Activity Points (RAP) from real-life deeds and spends those points to progress characters through long-running activities.

The game should feel like a large personal progression tracker mixed with an idle RPG. It should support extremely long progression, many unlocks, many collectible items, rare drops, achievements, and multiple characters.

## Core Concept

The player starts by selecting a local account/save profile, such as `LuckyBoo`. The account starts with one character slot and can later unlock more character slots through account-wide progression milestones and RAP spending. Characters are similar in spirit to choosing and maintaining multiple characters in an MMORPG. Each character can perform activities if the prerequisites and RAP cost are met.

Example activities:

- Explore a region for several hours.
- Train a skill for several hours.
- Run a dungeon.
- Fight bosses.
- Progress toward achievements.
- Unlock points of interest.

The main interaction is choosing what a character should do, spending RAP or meeting requirements, then waiting for the activity to complete.

Multiple characters are supported as a progression feature, but the account starts with only one character slot.

Character creation should feel like a proper game flow, not a simple form. Race choice and class choice should both be presented with strong fantasy identity, readable descriptions, visual themes, and mechanical consequences.

## First Gameflow Skeleton

The current intended gameflow is:

1. Select or create a local account/save profile.
2. Create the first character through a themed race and class creation flow.
3. Enter the account dashboard.
4. Earn RAP through the prototype RAP button, later through real-life deeds.
5. Assign available characters to activities such as exploring, training, or fighting.
6. Activities consume RAP and run for real time.
7. Offline time counts.
8. Completion grants skill XP, drops, unlock progress, achievements, or region progress.
9. Account skills, combat level, equipment, account bonuses, and unlocks improve future activity speed, success chance, and available content.
10. New regions, bosses, dungeons, loot tables, skills, account upgrades, and character slots unlock through milestones.

The player should rarely be asked to make fast tactical decisions. The main decisions are long-term planning decisions: what to spend RAP on, which character should do which activity, what boss or region to farm, which unlock to chase, and which collection goals matter now.

## Account Flow And Dashboard

The game should be account-first rather than character-first.

First screen:

- Select an existing local account/save profile.
- Create a new account/save profile if none exists.
- Example account name: `LuckyBoo`.

After account selection:

- The player enters an account dashboard.
- The dashboard shows account-wide RAP, active character activities, available character slots, major unlock goals, achievements, and account upgrades.
- Characters are treated like assignable workers within the account.
- The player can assign an idle character to an activity directly from the account view or from an activity view.
- The player should not need to exit back to a character-select screen every time they want to manage another character.

Character management lives inside the Account dashboard for the current MVP:

- Create a character if a free slot exists.
- Inspect each character in the roster.
- See class, race, account combat level, relevant progress, current activity, and status.
- Assign idle characters to activities from the roster.
- Rename or customize characters if supported later.

Buying a character slot should not automatically force or open character creation. It only increases available capacity. The player may create a new character later by pressing a Create button.

Roster design direction:

- The account has up to seven character slots.
- Only unlocked slots are shown.
- Slot order matters and represents priority from left to right.
- The current implementation uses Move Mode instead of free drag-and-drop for better mobile control.
- In Move Mode, the player taps a filled source slot and then taps a filled or empty target slot.
- Moving onto a filled slot swaps the two slots.
- Moving onto an empty unlocked slot places the character there and leaves the old slot empty.
- Empty slots are not draggable.
- Empty unlocked slots can be clicked to create or assign a character.

Active character direction:

- The app has one currently active character used as the default worker for starting activities.
- After an activity starts, the active character should move to the next idle character in roster priority order if available.
- If a higher-priority character finishes an activity later, the app should not automatically switch focus back.
- The top bar should indicate when a higher-priority idle character is available and allow manual switching.
- The top bar includes left/right character arrows. The left arrow moves toward higher-priority idle characters and highlights when available. The right arrow moves toward lower-priority idle characters.

Design decision: the player plays the account, not one isolated character session.

## Real Life Activity Points

RAP is the primary fuel for in-game progression.

Initial simple version:

- The player can press the plus button in the top bar to gain `10,000 RAP`.
- This represents a fixed real-life activity value for early prototyping.

Planned direction:

- Add a Deeds or Activities system for real-world actions.
- Example deed: walk 10,000 steps and gain 10,000 RAP.
- Example deed: exercise for one hour and gain around 20,000 RAP.
- Different real-life activities can reward different RAP amounts based on difficulty or value.
- A rough economy baseline is that one in-game activity hour costs about 5,000 RAP.
- A rough real-life earning baseline is that one hour of meaningful real-life activity earns about 20,000 RAP.
- RAP is used both to run activities and to unlock or purchase newly available content.
- Example: reaching a skill requirement may only unlock the option to buy an item, resource type, activity, or feature; the final unlock can still require RAP spending.

Design intent: meaningful in-game progress should be tied to real-world activity, but the game itself remains an idle/tracking RPG rather than an action game.

## Core Gameplay Loop

1. Player earns RAP through a button in the prototype, later through real-life deeds.
2. Player selects a character.
3. Player chooses an available activity.
4. RAP and requirements are checked.
5. The character starts a timed activity.
6. When the activity finishes, rewards are applied.
7. Rewards may include skill XP, account progress, items, currencies, unlocks, achievements, points of interest, or rare drops.
8. New activities and goals become available.

Offline progress counts. If an activity finishes while the app is closed, it should resolve when the app is opened again.

## Characters

Planned:

- Multiple character creation.
- The account starts with one character slot.
- Additional character slots are unlocked through milestones and RAP spending.
- Character selection similar in concept to MMORPG character select.
- Each character can have its own race, class, passives, and future character-specific identity, but core skill progression flows into the account.
- Characters can perform different activities.
- Multiple characters can perform activities at the same time.
- Each individual character can only have one active activity at a time.
- Skills are account-wide by default.
- Each character has a race and class.
- Character power can come from class, race, account combat level, account skills, equipment, character bonuses, and account-wide bonuses.
- Race/class combinations are restricted by default and can be expanded through account meta-progression.

Open questions:

- What are the exact milestones and RAP costs for unlocking character slots?

## Classes

Classes should be WoW-like high-fantasy archetypes. The game should eventually support dozens of classes.

First prototype classes:

- Warrior
- Paladin
- Mage

Future example classes:

- Warlock
- Hunter
- Shaman

Design direction:

- Classes define broad character identity and combat style.
- Classes can affect combat speed, survival, loot efficiency, available skills, or activity modifiers.
- Classes should be data-driven so new classes can be added without rewriting combat or UI logic.
- Each class starts with two passive abilities.
- Some classes may have preferred enemy types, region advantages, or skill synergies later.

First prototype class passive direction:

- Warrior: durable physical fighter; example passives could improve survival and weapon efficiency.
- Paladin: defensive holy fighter; example passives could improve undead combat and reduce failure chance.
- Mage: fragile high-output caster; example passives could improve magical kill speed and exploration of arcane locations.

Open questions:

- Should class choice be permanent?
- Should subclasses, specializations, or class unlocks exist later?

## Races

The game should include generic high-fantasy races rather than direct named characters or overly specific franchise references.

First prototype races:

- Human
- Orc
- Undead

Design direction:

- Races should provide flavor and possibly small bonuses.
- Race bonuses should be meaningful but not so dominant that one race is always correct.
- Races should be data-driven like classes.
- Keep the setting generic high fantasy. Do not rely on specific copyrighted characters or named IP references in core data.
- Each race has one passive ability.
- Races do not currently have active abilities.
- Each race should have its own character-creation UI theme, including background image direction, palette, and description.

First prototype race UI direction:

- Human: grounded kingdom/adventurer fantasy, balanced presentation, warm steel-and-banner palette.
- Orc: brutal clan/frontier fantasy, physical strength theme, rough earth-and-iron palette.
- Undead: cursed ruin/necromantic fantasy, endurance and decay theme, cold shadow-and-sickly-green palette.

First prototype race passive direction:

- Human: balanced growth or small bonus to account/skill flexibility.
- Orc: physical combat or survival advantage.
- Undead: resistance, persistence, or advantage against fear/death-themed content.

Open questions:

- Should races have account-wide unlocks, racial achievements, or region affinities?

## Race/Class Compatibility

Not every race can play every class at the start. This is intentional and should support long-term meta-progression.

Initial prototype matrix:

- Human: Warrior, Paladin, Mage
- Orc: Warrior, Mage
- Undead: Warrior, Mage
- Orc Paladin: locked at start
- Undead Paladin: locked at start

Design direction:

- Locked combinations should be shown as locked goals when it helps motivation.
- Unlock requirements can include RAP spending, combat level, account skill levels, achievements, quests, boss kills, reputation, rare drops, or account upgrades.
- Unlocking unusual combinations should feel like a special account milestone.
- Example: an account later unlocks Orc Paladin by completing a special quest about rescuing or recruiting an Orc Paladin, then spending a large amount of RAP.
- A long-term goal can be unlocking every race/class combination.
- The UI should distinguish "not available yet" from "never planned"; prefer "locked" when the design wants it to become unlockable later.

## Activities

Activities are the broad umbrella term for everything a character can do in the game. A character performs an activity, and the resulting progress flows back into the account.

Current activity categories:

- Exploration
- Skill training
- Dungeons
- Bossing
- Combat

Design expectations:

- Activities can have prerequisites.
- Activities can cost RAP.
- Activities can take real time.
- Activities can produce deterministic and random rewards.
- Activities can unlock new systems, regions, dungeons, bosses, or points of interest.
- Activities can run while the app is closed.
- Activity completion should resolve from saved timestamps when the app is reopened.
- Activities can be gated by combat level, account skill levels, region progress, achievements, account upgrades, discovered points of interest, or collected items.
- Activity lists should remain visible even if no character is idle or no character exists yet. Availability should disable Start actions, not hide the activity catalog.
- Activities should be organized by modules over time. The first real module is Explore.
- Combat level requirements are written and checked as whole levels, such as Combat Level 3. The combat level display can still show decimals for motivation.

## Exploration

Exploration is a major progression activity.

Possible rewards:

- Skill XP
- Exploration or region progress
- Region progress
- Items
- Currencies
- Points of interest
- Unlock flags
- Achievements

Example: A character explores for five hours and may discover special points of interest.

Explore is a module where characters investigate whole regions. A region is its own small progression game and can have requirements, RAP cost, tick cadence, repeat rewards, discovery tracks, and completion rewards.

Regions can have discovery tracks such as:

- Points of interest
- Treasure hunting
- World bosses
- Regional achievements
- Skilling opportunities
- Region-specific drops
- Unlockable dungeons or special activities
- Region quests
- Secrets

These tracks do not need fully authored quests, bosses, or treasures at first. They can start as simple counters, such as `Region Quests 0 / 73`. While a character explores the region, each simulation tick can roll against those counters. A successful roll increments the counter until that track is complete.

Exploration rewards should not only happen at the end of a long timer. Long waits with a single final reward are not satisfying. Instead, Explore activities should use repeat rolls during the activity:

- Each Explore region defines a tick interval, such as 60 seconds.
- Each tick can grant repeat rewards, such as skill XP.
- Each tick can roll discovery tracks, such as Region Quests or Treasures.
- Offline progress is resolved by calculating how many ticks elapsed while the app was closed.
- The UI does not need to animate every hidden roll, but progress should update when ticks resolve.
- Very rare rewards can later be converted from an intended hourly chance into a smaller per-tick chance.

Discovery tracks and repeat rewards are separate:

- Discovery tracks are permanent region completion counters.
- Repeat rewards can keep a fully explored region useful, such as XP, resources, currencies, or future drops.

Example region structure:

- `Old Road`
- Requirements: none
- RAP cost: 5,000 per hour baseline, scaled down in the prototype for fast testing
- Tick interval: 60 seconds
- Discovery tracks: Region Quests, Treasures, Points of Interest, World Bosses, Secrets
- Repeat rewards: Hunter XP, Agility XP, Constitution XP
- Completion reward: achievement or unlock flag when all tracks are complete

Example early flow:

- A new account starts with baseline level 1 skills and the first region available.
- Explore is the first core activity.
- Exploration can grant skill XP and region progress.
- At a future skill milestone or combat level milestone, a new region, skill activity, or account upgrade can become available.
- Region progress can reveal bosses, dungeons, treasures, or points of interest.

## Combat System

Combat should be simple and mostly automatic.

The player chooses what a character should fight. The character then fights passively for the selected duration or until the activity is resolved.

Combat should consider:

- Account combat level
- Character class
- Character race
- Account combat skills
- Equipped items
- Account-wide bonuses
- Character-specific bonuses
- Enemy or boss difficulty
- Region modifiers

Combat output should determine:

- Kill speed
- Chance to die or fail
- Expected number of kills during the activity
- Loot rolls per successful kill
- XP and other rewards

Design direction:

- The player does not manually control combat.
- A weak character may kill slowly or have a meaningful chance to die.
- A strong character may kill quickly with very low or zero death chance.
- Long boss-farming sessions should repeatedly roll loot based on the number of successful kills.
- The UI should show enough estimated information to make choices understandable, such as expected kills, danger, and notable drops.

Open questions:

- What happens on death: lost time, reduced rewards, repair cost, injury timer, or just failed kills?
- Should combat simulate individual kills or use an aggregate formula?
- Should combat require consumables, gear durability, or preparation later?

## Dungeons And Drops

Dungeons are repeatable activities with drop tables.

Planned behavior:

- Dungeons can have common, uncommon, rare, and very rare rewards.
- Dungeons may be run repeatedly for collection goals.
- Example rare reward: a mount with a 1 in 500 drop chance.
- Bosses and dungeons should expose their loot table in the UI.
- The UI should show what can drop and what has already been collected.
- Ultra-rare drops are a major chase goal.
- Mounts are a key ultra-rare collectible type.

Open questions:

- Should dungeon rewards resolve instantly when the timer ends, or as multiple simulated encounters?
- Should drop rates be visible in the UI?
- Should pity systems or collection milestones exist?

## Loot And Collection

Loot is a major long-term motivation.

Design direction:

- Bosses, dungeons, regions, and special activities can have loot tables.
- Loot tables can include common resources, rare items, equipment, cosmetics, mounts, and unlock items.
- The player should be able to inspect possible drops before choosing what to farm.
- The player should be able to see collected vs. missing drops.
- Some drops may unlock future content directly or contribute to achievement gates.
- Very rare drops should exist for long-tail goals.

Mount collection is an early example collection category:

- First mount achievement
- 5 mounts achievement
- 10 mounts achievement
- 25 mounts achievement
- 50 mounts achievement
- Category achievements, such as owning 5 raid mounts

## Gating And Unlocks

The game should use layered gated progression similar in spirit to RuneScape and modded Minecraft.

Possible gates:

- Combat level
- Skill level
- Region progress
- Boss kills
- Item collection
- Mount collection
- Achievement completion
- RAP spending
- Account upgrades
- Special points of interest
- Dungeon completion
- Race/class combination unlocks

Unlock rewards can include:

- New regions
- New skills
- New activities
- New bosses
- New dungeons
- New loot tables
- Special dungeons
- Character slots
- Quality-of-life upgrades
- Account-wide bonuses
- New race/class combinations

Design direction:

- Gating should create visible goals and chains of progress.
- Achievements can unlock actual gameplay, not only badges.
- Account-wide bonuses and QoL upgrades should be a major sink for RAP and milestones.
- Unlock chains should be data-driven so new content can be added as content definitions.
- Unlocking rare race/class combinations is part of meta-progression.

## Requirements And Rewards

Requirements and rewards are core systems that should sit underneath nearly every gameplay entity.

Any of the following should be able to declare requirements later:

- Activities
- Items
- Quests
- Bosses
- Dungeons
- Regions
- Skills or skill milestones
- Account upgrades
- Race/class combinations
- Achievements
- Future systems

Requirements are hard gates for now. If the account does not meet the requirement, the related content cannot be started, completed, bought, equipped, or claimed.

Requirement examples:

- Skill level, such as Prayer 45.
- Combat level.
- Quest completion.
- Item ownership.
- Mount or collection count.
- Achievement completion.
- Region progress.
- Boss kill count.
- Dungeon completion.
- Account unlock flag.
- RAP cost or RAP spend requirement.
- Race, class, or race/class condition for content that intentionally depends on the worker.

Rewards should also be flexible and optional. Any activity or unlock can grant none, one, or many reward types.

Reward examples:

- Skill XP.
- Items or stackable resources.
- Drop table rolls.
- Ultra-rare drops, such as a 1 in 500 mount.
- Unlock flags.
- Quest progress or completion.
- Achievement progress or completion.
- Region progress.
- Account upgrades.
- Quality-of-life unlocks.

Design intent: the game should not hard-code "this is a Fishing activity" or "this is a Combat reward" into one-off UI logic. Content should describe requirements and rewards, and the shared game systems should evaluate and apply them.

## Skills

Skills are a major account-wide progression system inspired by RuneScape. Characters perform actions, but the resulting skill XP belongs to the account.

Planned:

- Skills can be trained by spending RAP on timed activities.
- Each skill should have its own icon eventually.
- Skills may unlock activities, items, crafting, regions, combat options, or passive benefits.
- Skill levels can act as hard requirements for any content entity.
- Skill XP can be granted through any reward definition.
- Activities do not need one fixed main skill. An activity can grant no skill XP, one skill XP reward, or several skill XP rewards.
- Skills run from level 1 to 120.
- XP continues past level 120 up to 200,000,000 XP per skill.
- XP should follow the RuneScape XP curve, with level 99 around 13,034,431 XP and level 120 around 104,273,167 XP.
- XP is the source of truth; visible level is derived from XP.
- All skills should be visible from the start on a dedicated Skills screen.
- Invention, Necromancy, and Sailing are visible but locked until account total level 800.
- Locked skills still count toward total level.
- Locked skills cannot receive XP before they are unlocked.
- The skill roster should contain only official RuneScape 3 or Old School RuneScape skills unless the user explicitly asks to add custom skills later.
- Do not add Perception or other homebrew skills by default.

Current skill roster:

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

Example future activity:

- `Catch Lobster` requires Fishing 40.
- It costs RAP based on duration, roughly 5,000 RAP per in-game hour.
- It rewards lobsters and Fishing XP per successful catch.
- Catch count can vary with randomness and account skill level.

Open questions:

- What should the exact first skill-training activities be?
- Should skills grant passive bonuses immediately, or should passive skill bonuses be added later after the core XP/requirement system is stable?

## Combat Level

Combat level is account-wide and replaces character level as the main power indicator.

Design direction:

- Every character on the account shares the same combat level.
- Combat level is calculated from account combat skills.
- Combat level should be displayed with two decimal places.
- The current MVP formula is RuneScape-style and adapted for early visible progress: defence, Constitution with a baseline of 10, Prayer, Summoning, and the strongest combat style contribute to the displayed value.
- Slayer is a combat skill for this project and maps to Berserker in German RuneScape terminology.
- Combat level can be used as a hard requirement for future bosses, quests, dungeons, or activities.
- Combat level requirements use whole levels. For example, a requirement of Combat Level 3 checks the floored combat level even if the display shows 3.42.
- Combat level is an important indicator for passive combat, but individual combat skills may also matter later.

Combat skills for this project:

- Attack
- Strength
- Defence
- Constitution
- Ranged
- Magic
- Prayer
- Summoning
- Necromancy
- Slayer

Design example: an enemy weak to magic may be easier for an account whose combat profile is heavily supported by Magic, even if the overall combat level is similar to another account.

Current formula decision:

- Slayer is treated as a combat skill for this project. In German RuneScape terminology this maps to Berserker.
- Requirements use `Math.floor(combatLevel)`.
- The formula may be tuned later after real combat content exists, but the current MVP implementation is good enough for visible early progress and hard-gate checks.

## Skills UI

The Skills screen should be compact enough to show the full current skill roster in one mobile viewport without scrolling.

Current direction:

- Show only Combat and Total in the top summary.
- Do not show a separate Requirement/Req number in the summary.
- Do not show skill categories such as combat, gathering, artisan, support, or elite in the player-facing tile UI.
- Each skill should be a compact tile with skill name, level number, and a mini XP-to-next progress bar.
- Locked skills still show their unlock requirement compactly, for example `TL 800`.
- Long skill names may truncate in the compact alpha UI; icons can later improve recognition without increasing height.

## Items And Inventory

Items are expected to become a large content area.

Planned:

- Hundreds of items over time.
- Each item should eventually have its own icon.
- Items can come from exploration, dungeons, bosses, skills, achievements, or other systems.
- Inventory is account-wide by default.
- Inventory is not required for the first prototype.

Open questions:

- Should items have rarity tiers?
- Should equipment exist from the beginning or come later?
- Should crafting consume items?

## Achievements

Achievements are a core tracking layer.

Planned:

- Achievements for progression milestones.
- Achievements for exploration discoveries.
- Achievements for rare drops.
- Achievements for skill training.
- Achievements for real-life deeds.

Achievements may unlock rewards, cosmetics, activities, or currencies later.

Achievements are account-wide by default.

Achievement examples:

- Own the first mount.
- Own 5 mounts.
- Own 10 mounts.
- Own 25 mounts.
- Own 50 mounts.
- Own 5 raid mounts.
- Reach combat level 5.
- Discover all points of interest in a region.
- Defeat a specific boss enough times.

Achievements can unlock new content such as special dungeons, bosses, account bonuses, or quality-of-life upgrades.

## Codex

The Codex is the account's central long-term progress, collection, records, and achievement area. It replaces the old Progress bottom-navigation destination.

Design direction:

- The Codex is read-only from a gameplay perspective. It does not start activities or assign characters.
- The Codex should feel satisfying to check often, because it summarizes account completion and collector progress.
- The Codex is one of the game's main progression anchors alongside Skills.
- The first structure uses four tabs: Overview, Collection, Records, and Achievements.
- Overview is a compact account summary. It should not go deep into per-category detail.
- Detail tabs provide the deeper breakdown for collection categories, record categories, and achievement categories.

Codex Overview stat pairs:

- Combat Level and Total Skill Level.
- Skills at 99 and Skills at 120.
- Total Quests and Quest Points.
- Achievements and Achievement Points.
- Unique Records and Records.
- Collection count and Collection percentage.

Pairing similar values on the same row is an intentional UI rule for this screen. For example, Total Quests sits beside Quest Points; Achievements sits beside Achievement Points; Unique Records sits beside Records.

Current MVP data decisions:

- Quests are not implemented yet, so Total Quests and Quest Points start at zero.
- Achievements are structurally planned but not implemented yet, so completed achievements and achievement points start at zero.
- The Codex must not expose fake planned totals as if they were implemented content. Collection and achievement detail tabs should stay empty until those systems have real content definitions and save-backed ownership/completion state.
- Collection percentage should support decimals because long-term collection totals may reach hundreds or thousands of entries.
- Collection items, mounts, pets, and skins are separate collection categories. Collector Items are their own high-volume category and should not be treated as normal inventory.
- Records are aggregate account accomplishments, such as completed activities, region discoveries, unique explored regions, boss kills, dungeon runs, or future module counters.
- Unique Records count distinct record lines with progress, while Records count aggregate total progress. For example, one boss killed 1,000 times would contribute one Unique Record and 1,000 Records.
- Records are unbounded statistics when the underlying activity can be repeated forever. The Overview `Records` tile should be a plain counter, not `current / total`. Bounded record values still use `current / total` where the current game content defines a real maximum, such as exploration discovery counters.
- For Exploration Discoveries, `Unique` means fully completed discovery tracks. A partially progressed track, such as `Secrets 1 / 2`, contributes to `Total` but not to `Unique`.
- Codex tiles should show both visual completion and explicit percentage text. The visual completion can be a subtle animated fill layer, but the percentage should still be readable as text.
- Locked or uncompleted one-time entries should show no fill at 0% and full fill at 100% once completed.
- Codex tabs should be switchable by tapping the segmented control and by swiping left or right across the Codex body on mobile.
- Codex Records should only count content that still exists in current game data. Removed prototype activities or stale save entries should not inflate current records.

Initial Codex tests:

- Bottom navigation shows Codex instead of Progress and opens the Codex screen.
- Codex defaults to Overview.
- Overview shows the stat pairs in the intended row order.
- Combat Level, Total Skill Level, Skills at 99, and Skills at 120 are derived from account skill state.
- Records update from current account activity and exploration progress.
- Collection percentage displays with three decimals.
- Collection, Records, and Achievements tabs are visible and switch without starting gameplay actions.
- No Activity-start buttons appear in the Codex.
- Existing top bar and bottom navigation collapse behavior still works.
- Codex tiles show percentage text and fill state.
- Horizontal swipe changes Codex tabs.
- Stale activity logs and stale region progress from removed content do not count toward current Codex Records.

## UI/UX Direction

The UI should be simple, usable, and mobile-only.

Design priorities:

- Efficient one-handed mobile use.
- Clear activity selection.
- Clear character state.
- Clear timers and rewards.
- Reusable navigation bars and shared UI components.
- Modular pages where each major system can still have a specialized interface.
- Early implementation UI should be minimal, functional, and alpha/testing-friendly while mechanics and values are still changing.
- Use reusable app-shell components such as bottom navigation, headers, cards, rows, segmented controls, and action buttons.
- Top bar and bottom navigation should stay visible while the body content scrolls.
- Top bar and bottom navigation should be separately collapsible to free more body space on mobile.
- Top bar and bottom navigation collapse/expand should use matching thin arrow rows.
- The top bar plus button is the current prototype RAP gain action.
- The expanded top bar should include compact active-character information: character icon, name, race, and class.
- Account-wide combat level should be displayed as its own top-bar stat with an icon and number, not as part of the character text.
- RAP should also be displayed as an icon-led top-bar stat instead of the literal `RAP` text where space is tight.
- The prototype RAP gain action should use a custom activity/earning icon rather than a generic plus symbol.
- The expanded top bar should include quick character navigation arrows. The left arrow points toward higher-priority idle characters and should highlight when one is available. The right arrow points toward lower-priority idle characters. Disabled arrows should be greyed out.
- The Activity screen should use the top-bar active character instead of showing its own repeated character overview block.
- Character creation can become visually richer later, but should start as a simple data-driven wizard.
- Race selection should initially use clear labels, descriptions, passives, and allowed classes; race-specific backgrounds can come later.
- Class selection should show available classes for the selected race, locked classes, class passives, and unlock requirements where applicable.

Expected pages or screens:

- Account/save profile select
- Account dashboard
- Character select
- Character overview
- Character creation with race and class selection
- RAP/deeds
- Activities
- Exploration
- Skills
- Inventory
- Dungeons
- Bossing
- Collections, including mounts
- Account upgrades
- Achievements
- Settings/save backups

Character creation flow:

1. Name character.
2. Choose race from a themed race-selection screen.
3. Read race description and passive.
4. Choose class from classes available to that race.
5. Review locked classes and their unlock hints if applicable.
6. Review final character summary.
7. Create character if a slot is available.

First generated mockups:

- `assets/generated/mockups/character_creation/race_selection_human.png`
- `assets/generated/mockups/character_creation/class_selection_orc_warrior.png`
- `assets/generated/mockups/character_creation/final_review_undead_mage.png`
- `assets/generated/mockups/minimal_alpha_ui/variant_a_dark_race_wizard.png`
- `assets/generated/mockups/minimal_alpha_ui/variant_b_light_account_dashboard.png`
- `assets/generated/mockups/minimal_alpha_ui/variant_c_dark_activity_assignment.png`

Mockup direction:

- Use a three-step flow: race, class, review.
- Use a compact progress indicator at the top.
- For the early implementation, keep screens minimal and functional rather than illustration-heavy.
- Race selection should emphasize clear choice rows/cards, readable summary, passive, and allowed classes.
- Class selection should show available and locked classes in one place.
- Final review should show name, race, class, slot usage, and passives before committing.
- Account dashboard and activity assignment should share a reusable bottom navigation shell.
- Generated text in mockups is not final game copy.

## Art Direction And Asset Direction

The game will need many generated images over time.

Planned asset types:

- Item icons
- Skill icons
- Achievement icons
- Activity icons
- Background images
- UI elements where helpful

Design requirement: agree on a consistent style before creating large batches of assets.

Open questions:

- What size should icons be authored at?
- Should backgrounds be atmospheric illustrations, map-like panels, or minimal textured surfaces?

Current icon direction: old-school low-pixel fantasy RPG icons inspired by early MMORPG inventory icons. Icons should be chunky, charming, grounded, readable at 24-32px, and low-detail rather than polished high-fantasy or Warcraft-like.

Icons should generally be generated as isolated subjects and then used with transparent backgrounds on top of CSS-authored UI tiles. The first accepted direction for the combat-level icon is two crossed short iron swords without a shield, crest, badge, or magical glow.

Primary image pipeline document: `image_pipeline.md`.

Pipeline coverage:

- Item icons
- Skill, class, race, ability, and achievement icons
- UI elements
- Screen mockups
- Background images

## Planned Content

Early prototype:

- Local account/save profile selection or creation.
- RAP gain button granting 10,000 RAP.
- Character creation with race and class choice.
- First races: Human, Orc, Undead.
- First classes: Warrior, Paladin, Mage.
- Initial class restrictions: Human can choose Warrior, Paladin, or Mage; Orc and Undead can choose Warrior or Mage; Paladin is locked for Orc and Undead.
- Each race has one passive.
- Each class has two passives.
- Account dashboard with character activity overview.
- Character management inside the Account screen.
- Basic character overview.
- One or more timed activities.
- Basic skill or exploration progression.
- Initial save/load.
- No inventory requirement for the first prototype.

Current MVP status:

- Implemented as a React/Vite mobile-only web app.
- Uses a minimal dark Type-C-style alpha UI.
- Account creation is local only.
- `LuckyBoo` is the default account name.
- RAP can be gained with the prototype plus button in the top bar.
- One character slot exists at start.
- The next character slot can be unlocked for 2,000 RAP in the MVP.
- Buying a new character slot does not auto-open character creation.
- Character creation supports Human, Orc, Undead, Warrior, Paladin, and Mage with starter restrictions.
- Character creation is launched from the Account screen rather than a separate Characters nav item.
- Account now shows a prioritized roster instead of a simple character list.
- The roster supports up to seven slots, shows only unlocked slots, and currently uses Move Mode for mobile-friendly slot movement.
- The expanded top bar shows the active character, race, class, combat-level icon stat, RAP, and RAP plus button.
- Activities now use the active character from the top bar rather than an Activity-screen character selector.
- Starting an activity automatically advances the active character to the next idle roster character when possible.
- Roster slots show status, race/class, account combat level, and active activity timers.
- Top bar and bottom navigation remain visible while the middle body scrolls.
- Top bar and bottom navigation can be collapsed or expanded separately.
- Top bar and bottom navigation use matching arrow rows for collapse and expand.
- The old placeholder activities Explore First Region, Train Endurance, and Fight Training Dummy have been replaced by the Explore module.
- Activity assignment now uses Explore as the first real module.
- Explore currently contains the first region, Old Road.
- Old Road runs for 5 minutes in the prototype, costs 400 RAP, and resolves every 10 seconds.
- Old Road has discovery tracks for Region Quests, Treasures, Points of Interest, World Bosses, and Secrets.
- Old Road repeat rewards grant Hunter, Agility, and Constitution XP per tick.
- Skills screen shows account-wide skills, total level, combat level, XP progress, and locked skills.
- Combat level requirements use the floored combat level, while display keeps two decimal places.
- Activity tabs and activity rows remain visible when all characters are busy; Start buttons are disabled in that state.
- Activities cost RAP, assign the character, and resolve from timestamps when complete.
- Codex replaces the old Progress bottom-nav screen.
- Codex currently includes Overview, Collection, Records, and Achievements tabs.
- Codex Overview shows Combat Level, Total Skill Level, Skills at 99, Skills at 120, Total Quests, Quest Points, Achievements, Achievement Points, Unique Records, Records, Collection count, and Collection percentage.
- Codex Records currently derive from completed activities, exploration discoveries, and explored regions.
- Collection and Achievement tabs intentionally show empty states until save-backed collection and achievement content exists.
- Inventory, items, quests, dungeons, bossing, and save-backed achievements are not implemented yet.

Later:

- Deeds system for real-life activities.
- Account-wide progression and quality-of-life unlocks, including additional character slots.
- More classes and races.
- Race/class combination unlocks as account meta-progression.
- Special quests or milestones that unlock unusual combinations.
- Passive combat resolution.
- Boss farming with visible loot tables.
- Mount collection achievements.
- Multiple skills.
- Exploration regions and points of interest.
- Dungeons with drop tables.
- Bossing module.
- Inventory and item collection.
- Achievements.
- Asset/icon pipeline.
- Backup/export/import save tools.

## Design Decisions

- The game is mobile-only.
- The game is for private personal use.
- The setting should remain generic high fantasy, using races like humans, orcs, and undead rather than specific named external IP characters.
- The game flow is account-first: select a local account/save profile, then manage all characters from inside that account.
- The player plays the account, while characters are assignable workers inside that account.
- Character management is not a primary bottom-nav destination in the current MVP; it is part of Account.
- RAP is the central resource connecting real life and in-game progress.
- The game should support multiple characters.
- The account starts with one character slot.
- Additional character slots are unlocked through account-wide milestones and RAP costs.
- Unlocking a character slot must not force immediate character creation.
- Multiple characters can run activities simultaneously.
- Each character can only run one activity at a time.
- Each character has a race and class.
- Race/class combinations are restricted at first and can be unlocked later through account meta-progression.
- First prototype races are Human, Orc, and Undead.
- First prototype classes are Warrior, Paladin, and Mage.
- Initial prototype availability: Human can be Warrior, Paladin, or Mage; Orc can be Warrior or Mage; Undead can be Warrior or Mage.
- Orc Paladin and Undead Paladin are locked at start and may be unlockable later.
- Each race has one passive ability.
- Each class starts with two passive abilities.
- Race selection should start as a simple data-driven wizard; richer race-specific art can be layered in later.
- Early UI should stay minimal and alpha/testing-friendly until mechanics and content stabilize.
- Character slots are a major progression/QoL reward because each extra active character increases account throughput.
- RAP is account-wide.
- Achievements are account-wide.
- Inventory is account-wide.
- Skills are account-wide by default.
- Combat level is account-wide and replaces character level as the primary shared power indicator.
- Slayer/Berserker is a combat skill for this project.
- Combat is passive: the player chooses a target/activity, then character power determines speed, danger, and rewards.
- Boss and dungeon loot tables should be visible in the UI.
- Collection progress should show obtained and missing drops.
- Ultra-rare drops, especially mounts, are important long-term goals.
- Achievements can unlock gameplay content, including special dungeons and account-wide upgrades.
- Progression should be gated through combat level, skill levels, regions, achievements, item collection, boss kills, and RAP spending.
- Offline progress counts and should resolve when the app is reopened.
- The first prototype can omit inventory.
- Old-school low-pixel fantasy RPG icons are the current icon direction.
- The game should be modular enough for long-term expansion.
- Save stability is a core design requirement, not a later polish feature.

## Open Questions

- What should the next Explore region be after Old Road?
- What should the first non-Explore module be: Combat, Skilling, Dungeon, or Deeds?
- What are the exact names and effects of the first race passives?
- What are the exact names and effects of the first class passives?
- What should unlock Orc Paladin and Undead Paladin?
- What are the first region, skill, or combat-level unlocks?
- How should combat level be tuned once enemies and combat rewards exist?
- What should death or failure do in passive combat?
- Should progression be mostly linear, region-based, skill-gated, achievement-gated, or mixed?
- How punishing should rare drops be?
- Should drop rates be visible exactly or described by rarity only?
- Should there be any failure state, or should every activity always produce some progress?
- What are the exact milestones and RAP costs for additional character slots?
