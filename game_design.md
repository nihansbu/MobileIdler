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
8. Completion grants XP, drops, unlock progress, achievements, or region progress.
9. Character levels, skills, equipment, account bonuses, and unlocks improve future activity speed, success chance, and available content.
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

Character select still exists as a management view:

- Create character if a free slot exists.
- Inspect each character.
- Rename or customize characters if supported later.
- See class, race, level, current activity, and status.

Design decision: the player plays the account, not one isolated character session.

## Real Life Activity Points

RAP is the primary fuel for in-game progression.

Initial simple version:

- The player can press a button to gain `10,000 RAP`.
- This represents a fixed real-life activity value for early prototyping.

Planned direction:

- Add a Deeds or Activities system for real-world actions.
- Example deed: walk 10,000 steps and gain 10,000 RAP.
- Example deed: exercise for one hour and gain around 20,000 RAP.
- Different real-life activities can reward different RAP amounts based on difficulty or value.

Design intent: meaningful in-game progress should be tied to real-world activity, but the game itself remains an idle/tracking RPG rather than an action game.

## Core Gameplay Loop

1. Player earns RAP through a button in the prototype, later through real-life deeds.
2. Player selects a character.
3. Player chooses an available activity.
4. RAP and requirements are checked.
5. The character starts a timed activity.
6. When the activity finishes, rewards are applied.
7. Rewards may include XP, levels, items, currencies, unlocks, achievements, points of interest, or rare drops.
8. New activities and goals become available.

Offline progress counts. If an activity finishes while the app is closed, it should resolve when the app is opened again.

## Characters

Planned:

- Multiple character creation.
- The account starts with one character slot.
- Additional character slots are unlocked through milestones and RAP spending.
- Character selection similar in concept to MMORPG character select.
- Each character can have its own progression.
- Characters can perform different activities.
- Multiple characters can perform activities at the same time.
- Each individual character can only have one active activity at a time.
- Skills are character-bound by default.
- Each character has a race and class.
- Character power can come from class, race, level, skills, equipment, character bonuses, and account-wide bonuses.
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
- Unlock requirements can include RAP spending, character level, achievements, quests, boss kills, reputation, rare drops, or account upgrades.
- Unlocking unusual combinations should feel like a special account milestone.
- Example: an account later unlocks Orc Paladin by completing a special quest about rescuing or recruiting an Orc Paladin, then spending a large amount of RAP.
- A long-term goal can be unlocking every race/class combination.
- The UI should distinguish "not available yet" from "never planned"; prefer "locked" when the design wants it to become unlockable later.

## Activities

Activities are long-running actions selected by the player.

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
- Activities can be gated by character level, region progress, achievements, skills, account upgrades, discovered points of interest, or collected items.

## Exploration

Exploration is a major progression activity.

Possible rewards:

- Character XP
- Exploration XP
- Region progress
- Items
- Currencies
- Points of interest
- Unlock flags
- Achievements

Example: A character explores for five hours and may discover special points of interest.

Regions should have subcategories such as:

- Points of interest
- Treasure hunting
- World bosses
- Regional achievements
- Skilling opportunities
- Region-specific drops
- Unlockable dungeons or special activities

Example early flow:

- A level 1 character starts in the first region.
- Explore is the first core activity.
- Exploration grants XP and region progress.
- At level 5, a new region, skill, activity, or account upgrade becomes available.
- Region progress can reveal bosses, dungeons, treasures, or points of interest.

## Combat System

Combat should be simple and mostly automatic.

The player chooses what a character should fight. The character then fights passively for the selected duration or until the activity is resolved.

Combat should consider:

- Character level
- Character class
- Character race
- Character skills
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

- Character level
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

## Skills

Skills are a major progression system.

Planned:

- Skills can be trained by spending RAP on timed activities.
- Each skill should have its own icon eventually.
- Skills may unlock activities, items, crafting, regions, combat options, or passive benefits.
- Skills are character-bound by default.

Open questions:

- What are the first prototype skills?
- Are skill levels capped or effectively uncapped?

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
- Reach character level 5.
- Discover all points of interest in a region.
- Defeat a specific boss enough times.

Achievements can unlock new content such as special dungeons, bosses, account bonuses, or quality-of-life upgrades.

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

Current visual direction: clean high-fantasy mobile game art. Pixel art is not the default style anymore, but can be used later for a specific asset family if intentionally chosen.

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
- Character management/select.
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
- RAP can be gained with the prototype `+10,000 RAP` button.
- One character slot exists at start.
- The next character slot can be unlocked for 2,000 RAP in the MVP.
- Character creation supports Human, Orc, Undead, Warrior, Paladin, and Mage with starter restrictions.
- Activity assignment supports Explore First Region, Train Endurance, and Fight Training Dummy.
- Activities cost RAP, assign the character, and resolve from timestamps when complete.
- Inventory, items, dungeons, bossing, and achievements are not implemented yet.

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
- RAP is the central resource connecting real life and in-game progress.
- The game should support multiple characters.
- The account starts with one character slot.
- Additional character slots are unlocked through account-wide milestones and RAP costs.
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
- Skills are character-bound by default.
- Combat is passive: the player chooses a target/activity, then character power determines speed, danger, and rewards.
- Boss and dungeon loot tables should be visible in the UI.
- Collection progress should show obtained and missing drops.
- Ultra-rare drops, especially mounts, are important long-term goals.
- Achievements can unlock gameplay content, including special dungeons and account-wide upgrades.
- Progression should be gated through levels, regions, skills, achievements, item collection, boss kills, and RAP spending.
- Offline progress counts and should resolve when the app is reopened.
- The first prototype can omit inventory.
- Clean high-fantasy mobile game art is the current visual direction.
- The game should be modular enough for long-term expansion.
- Save stability is a core design requirement, not a later polish feature.

## Open Questions

- What are the first three prototype activities?
- What is the first skill list?
- What are the exact names and effects of the first race passives?
- What are the exact names and effects of the first class passives?
- What should unlock Orc Paladin and Undead Paladin?
- What are the first region and level 5 unlocks?
- What is the first combat formula?
- What should death or failure do in passive combat?
- Should progression be mostly linear, region-based, skill-gated, achievement-gated, or mixed?
- How punishing should rare drops be?
- Should drop rates be visible exactly or described by rarity only?
- Should there be any failure state, or should every activity always produce some progress?
- What are the exact milestones and RAP costs for additional character slots?
