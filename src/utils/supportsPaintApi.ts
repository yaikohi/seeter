/**
 * This only works in browsers that support the painting API.
 * This excludes firefox.
 *
 * More info:
 * 1. CSS Painting API - https://developer.mozilla.org/en-US/docs/Web/API/CSS_Painting_API
 * 2. CSS Houdini - https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Houdini
 * 3. @property - https://developer.mozilla.org/en-US/docs/Web/CSS/@property
 *
 * eslint-disable-next-line @typescript-eslint/ban-ts-comment
 * @ts-ignore: CSS.paintWorklet DOES exist!*/
export const supportsPaintApi = CSS.paintWorklet as boolean;
