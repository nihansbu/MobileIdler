# Minimal Alpha UI Mockups

Generated on 2026-06-29 using the built-in image generation tool.

## Files

- `variant_a_dark_race_wizard.png`: dark character-creation race step with a reusable bottom navigation bar.
- `variant_b_light_account_dashboard.png`: light account dashboard with account summary, character worker card, next action, and bottom navigation.
- `variant_c_dark_activity_assignment.png`: dark activity assignment screen with character status, segmented activity type control, activity rows, and bottom navigation.

## Design Notes

- These are the preferred direction for early implementation: minimal, functional, and flexible.
- The previous ornate high-fantasy mockups are useful as long-term mood references only, not as the first UI implementation target.
- Use DOM components for the UI shell, navigation, cards, rows, controls, and text.
- Keep fantasy flavor restrained during alpha: labels, icons, light accent colors, and later optional background assets.
- Bottom navigation looks reusable and should likely become a shared app shell component.
- Variant B is the cleanest account dashboard reference.
- Variant C is the clearest interaction-density reference for activity assignment.
- Generated text is not source-of-truth copy; implement labels and descriptions in code.
