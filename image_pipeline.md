# MobileIdler Image Pipeline

## Purpose

This pipeline defines how MobileIdler visual assets should be requested, generated, reviewed, saved, and registered. It exists so icons, screen mockups, UI elements, and backgrounds stay consistent as the project grows.

The pipeline is intentionally reusable. Every future asset task should start by classifying the asset type, using the matching prompt template, saving the result in the right folder, and updating the asset manifest when the image becomes a project asset.

## Current Visual Direction

Primary style: clean high-fantasy mobile game art.

Style rules:

- Polished fantasy game UI, not generic SaaS/dashboard UI.
- Clean illustrated fantasy, readable on mobile.
- Rich but restrained materials: parchment, carved stone, dark metal, cloth banners, glass, subtle magic effects.
- Strong silhouettes and simple compositions.
- High contrast where small mobile details matter.
- During alpha/prototyping, prefer minimal code-native UI mockups over illustration-heavy fantasy screens.
- No photorealism unless explicitly requested.
- No pixel art by default. Pixel art can be used later for a specific asset family if intentionally chosen.
- No copyrighted characters, logos, or direct external-IP visual identifiers.
- No watermark.
- Avoid unreadable tiny text inside generated images.

## Asset Categories

### Item Icons

Use for inventory items, equipment, materials, collectibles, currencies, and drops.

Default direction:

- Square master image.
- Single centered object.
- Clean high-fantasy icon painting.
- Strong silhouette.
- Simple readable lighting.
- No text.
- Prefer transparent final PNG/WebP when used in UI.

Recommended master size: `1024x1024`.

Workspace path:

```text
assets/generated/icons/items/<item_id>.png
```

### Skill, Class, Race, And Ability Icons

Use for skills, passives, activities, class/race identity, unlocks, and achievements.

Default direction:

- Square master image.
- Symbolic fantasy icon rather than detailed scene.
- Readable at small size.
- Distinct color language by domain when useful.
- No text.

Recommended master size: `1024x1024`.

Workspace paths:

```text
assets/generated/icons/skills/<skill_id>.png
assets/generated/icons/classes/<class_id>.png
assets/generated/icons/races/<race_id>.png
assets/generated/icons/abilities/<ability_id>.png
assets/generated/icons/achievements/<achievement_id>.png
```

### Background Images

Use for race screens, account screens, regions, dungeons, bosses, and special feature pages.

Default direction:

- Portrait-first mobile composition.
- Subject and focal point should leave room for UI overlays.
- Avoid important detail under likely bottom navigation or main buttons.
- Atmospheric high-fantasy illustration.
- No embedded text.

Recommended mobile master size: `2160x3840`.

Workspace paths:

```text
assets/generated/backgrounds/races/<race_id>-creation-bg.png
assets/generated/backgrounds/regions/<region_id>.png
assets/generated/backgrounds/screens/<screen_id>.png
```

### UI Elements

Use for reusable game-facing decoration or bitmap UI pieces that are not better as CSS/SVG.

Examples:

- Ornamental dividers
- Frames
- Badges
- Reward banners
- Large fantasy panels
- Decorative screen flourishes

Default direction:

- Keep reusable pieces clean and not over-specific.
- Prefer CSS/SVG/code-native UI for simple buttons, tabs, nav bars, cards, borders, and layout.
- Use generated bitmap UI only when painterly material or fantasy texture is valuable.

Workspace path:

```text
assets/generated/ui/<element_id>.png
```

### Screen Mockups

Use for visual exploration before implementation.

Default direction:

- Mobile portrait mockup.
- Show actual intended UI hierarchy.
- Use real feature names when already decided.
- Avoid relying on exact generated text; generated mockups are visual direction, not source of truth copy.
- Good for deciding layout, mood, density, and interaction concept.
- For early app implementation, prefer minimal alpha/testing UI references with reusable app shell and navigation over heavy fantasy artwork.

Recommended size: `1080x1920` or `2160x3840`.

Workspace path:

```text
assets/generated/mockups/<screen_id>/<variant_id>.png
```

## Standard Workflow

1. Classify the request: icon, background, UI element, screen mockup, or other.
2. Check whether the asset is preview-only or intended for the app.
3. Use the matching prompt template from `assets/prompts/`.
4. Generate with the built-in image generation tool by default.
5. Review output for style, readability, mobile suitability, and constraints.
6. Iterate with one targeted change if needed.
7. Save final project assets under `assets/generated/...`.
8. Register shipped or referenced assets in `assets/manifests/asset-manifest.json` once that file exists.
9. Record any reusable prompt improvement in `assets/prompts/` or `project_memory.md`.

## Transparent Asset Workflow

For icons or cutouts needing transparency:

1. Generate the subject on a flat chroma-key background first.
2. Use a color unlikely to appear in the subject, usually `#00ff00` or `#ff00ff`.
3. Remove the chroma key locally with the installed imagegen helper.
4. Validate corners are transparent and edges are clean.
5. Save the final transparent PNG/WebP under `assets/generated/...`.

Use true native transparency only if the chroma-key workflow fails or the asset is too complex for it. That fallback requires explicit confirmation and an API-key-backed CLI path.

## Naming Rules

Use stable lowercase IDs:

```text
human_creation_bg.png
orc_creation_bg.png
undead_creation_bg.png
warrior_icon.png
paladin_icon.png
mage_icon.png
rusted_iron_sword.png
mount_bone_warhorse.png
```

Use hyphens or underscores consistently within a folder. Current preference: snake_case for asset filenames and IDs.

Avoid filenames based only on generated output numbers, dates, or vague names like `image1.png`.

## Manifest Rules

Project-used assets should have stable manifest entries. The manifest is the app-facing API; filenames are implementation detail.

Example:

```json
{
  "id": "race_human_creation_bg",
  "type": "background",
  "path": "assets/generated/backgrounds/races/human_creation_bg.png",
  "usage": "character_creation.race.human",
  "style": "clean_high_fantasy",
  "status": "draft",
  "promptFile": "assets/prompts/background-template.md"
}
```

## Quality Checklist

Before accepting an asset:

- It matches clean high-fantasy direction.
- It is readable on mobile.
- It has no watermark.
- It has no unintended text.
- It avoids direct external-IP identifiers.
- Icons have a strong silhouette.
- Backgrounds leave room for UI.
- Mockups show useful layout direction without becoming binding implementation specs.
- Project assets are saved inside the workspace, not only in a temporary generation folder.

## Character Creation Asset Needs

Near-term assets for the upcoming character/account flow:

- Account/select background or screen mockup.
- Account dashboard mockup.
- Human race creation background.
- Orc race creation background.
- Undead race creation background.
- Warrior class icon.
- Paladin class icon.
- Mage class icon.
- Human race icon or emblem.
- Orc race icon or emblem.
- Undead race icon or emblem.
- Character creation screen mockup showing race selection.
- Character creation screen mockup showing class restrictions and locked combinations.
- Minimal alpha UI mockups for account dashboard, character creation, and activity assignment.

## Prompt Template Index

- `assets/prompts/icon-template.md`
- `assets/prompts/background-template.md`
- `assets/prompts/ui-element-template.md`
- `assets/prompts/screen-mockup-template.md`
