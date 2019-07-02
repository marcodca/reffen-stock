import { css } from 'styled-components';

const screens = {
  xs: "0",
  sm: "600",
  md: "960",
  lg: "1280",
  xl: "1920"
};

const media = {
  down : Object.keys(screens).reduce((acc, label) => {
    acc[label] = (...args) => css`
      @media (min-width: ${screens[label].replace("px", "") / 16}em) {
        ${css(...args)}
      }
    `;
  
    return acc;
  }, {})
  ,
  up : Object.keys(screens).reduce((acc, label) => {
    acc[label] = (...args) => css`
      @media (max-width: ${screens[label].replace("px", "") / 16}em) {
        ${css(...args)}
      }
    `;
  
    return acc;
  }, {})
}

export default media