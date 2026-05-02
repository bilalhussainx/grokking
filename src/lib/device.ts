// Single source of truth for the mobile/desktop split. The .98 fudge is
// the standard CSS pattern that avoids the off-by-one between 1023 and
// 1024 in browsers that snap to integer pixel widths.
export const MOBILE_BREAKPOINT_PX = 1024;
export const MOBILE_MEDIA_QUERY = "(max-width: 1023.98px)";
