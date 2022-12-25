/* Creative Commons Attribution 4.0 International (CC-BY-4.0) */
/* Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com) */
/* This source code was getting from https://github.com/tastejs/todomvc-app-css/blob/03e753aa21bd555cbdc2aa09185ecb9905d1bf16/index.css */

// import styled, { css } from "styled-components";
import styled from "styled-components";

export const Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  height: 100vh;
  .anigraphcontainer {
    max-width: 90vw;
    max-height: 90vh;
    min-height: 90vh;
    aspect-ratio: 1;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 10px;
  }
  .h1{
    text-align: center;
  }
`;
