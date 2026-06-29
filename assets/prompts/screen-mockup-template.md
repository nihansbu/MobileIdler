# Screen Mockup Prompt Template

Use case: ui-mockup
Asset type: mobile game screen mockup
Primary request: <screen name and state>
Scene/backdrop: <background or screen fantasy theme>
Subject: mobile portrait UI mockup for MobileIdler
Style/medium: clean high-fantasy mobile game UI, polished fantasy RPG menu, readable modern mobile layout
Composition/framing: 9:16 portrait screen, dense but clear, thumb-friendly controls, no desktop layout
Lighting/mood: <screen mood>
Color palette: <screen palette>
Materials/textures: parchment, dark metal, subtle glass, cloth banners, restrained magical accents as appropriate
Text: use only short readable labels; exact app copy will be implemented in code
Constraints: show useful hierarchy and layout direction; no watermark; no logo; no direct external-IP references
Avoid: generic SaaS dashboard, oversized marketing hero, unreadable tiny text, too many nested cards, decorative blobs, cluttered overlays

## Minimal Alpha UI Notes

Use this mode for early implementation mockups while mechanics and data are still changing:

- Prefer plain mobile app screens over illustrated fantasy menus.
- Use flat panels, rows, segmented controls, basic buttons, and reusable navigation.
- Keep fantasy flavor restrained: labels, small icons, subtle accent colors.
- Avoid large portraits, full-screen art, ornate frames, heavy textures, and decorative chrome.
- Prioritize information visibility, tap targets, and easy iteration.
- Bottom navigation or another shared app shell should be treated as a reusable component concept.

## Character Creation Mockup Notes

For race selection:

- Show Human, Orc, and Undead as selectable race options.
- The selected race should strongly influence background, palette, description area, and passive summary.
- Leave room for class selection in the next step.

For class selection:

- Show Warrior, Paladin, and Mage.
- Show locked class combinations when applicable.
- Example: Orc Paladin locked with an unlock hint.
