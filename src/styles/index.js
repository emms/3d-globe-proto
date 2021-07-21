import { createGlobalStyle } from "styled-components";

export const SCREEN_SIZES = {
  largeDesktop: 1600,
  mediumDesktop: 1400,
  desktop: 1200,
  smallDesktop: 1024,
  tabletLandscape: 900,
  tabletPortrait: 600,
  mobileLarge: 425,
  mobileMedium: 375,
};

export const sizes = {
  mobileMedium: `(min-width: ${SCREEN_SIZES.mobileMedium}px)`,
  mobileLarge: `(min-width: ${SCREEN_SIZES.mobileLarge}px)`,
  tabletPortrait: `(min-width: ${SCREEN_SIZES.tabletPortrait}px)`,
  tabletLandscape: `(min-width: ${SCREEN_SIZES.tabletLandscape}px)`,
  smallDesktop: `(min-width: ${SCREEN_SIZES.smallDesktop}px)`,
  desktop: `(min-width: ${SCREEN_SIZES.desktop}px)`,
  mediumDesktop: `(min-width: ${SCREEN_SIZES.mediumDesktop}px)`,
  largeDesktop: `(min-width: ${SCREEN_SIZES.largeDesktop}px)`,
};

export const GlobalStyle = createGlobalStyle`
  html, body, #root {
    width: 100%;
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
  }

  * {
    box-sizing: border-box;
  }
`;
