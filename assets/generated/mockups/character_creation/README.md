# Character Creation Mockups

Generated on 2026-06-28 using the built-in image generation tool.

## Files

- `race_selection_human.png`: race-selection state with Human selected.
- `class_selection_orc_warrior.png`: class-selection state with Orc selected, Warrior chosen, Mage available, Paladin locked.
- `final_review_undead_mage.png`: final review state for an Undead Mage.

## Design Notes

- The strongest direction is the multi-step flow with a compact progress indicator at the top.
- Race selection should feel like a high-fantasy character hall with one dominant selected race panel and smaller race tiles.
- Class selection should make locked combinations visible without blocking the whole flow.
- Final review should show slot usage, race/class identity, and passives before committing the character.
- Exact generated text should not be treated as final copy. Labels and descriptions should be implemented in code.

## Follow-Up Implementation Notes

- Keep UI panels as real DOM components where possible.
- Use generated backgrounds and icons as supporting assets, not as text-bearing UI.
- Preserve the mobile-only 9:16 hierarchy when implementing the React screens.
