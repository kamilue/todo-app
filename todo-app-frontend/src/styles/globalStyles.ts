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

  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .main-content {
    display: flex;
    width: 100%;
    overflow: hidden;
  }

  .tasks-container {
    display: flex;
    width: 100%;
    overflow: hidden;
  }

  .tasks-list {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
`;

export default globalStyles;
