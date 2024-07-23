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
    height: 100vh;
  }

  .main-content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .tasks-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .tasks-list {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  /* Custom scrollbar styles */
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: #f4f6f8;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #8e2de2, #4a00e0);
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #4a00e0, #8e2de2);
  }
`;

export default globalStyles;
