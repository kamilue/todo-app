import { css } from '@emotion/react';

const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Roboto', sans-serif;
    background-color: #f4f6f8;
    color: #333;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default globalStyles;
