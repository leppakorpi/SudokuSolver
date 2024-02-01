// ==UserScript==
// @name         Interceptor Example
// @namespace    http://tampermonkey.net/
// @version      2024-02-01
// @description  Simple solver interceptor example
// @author       Toni Leppäkorpi
// @match        https://f-puzzles.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let connection;
  let reqNonce;
  let reqTime;
  let asynchronous = false;

  const onRequest = (message, puzzle) => {
    console.log("send", message.nonce, message.command, puzzle);
    reqNonce = message.nonce;
    reqTime = new Date();

    if (asynchronous) {
        setTimeout(() => connection.send(message), 500);
        return;
    } else {
        return message;
    }
  };

  const onMessage = (response) => {
    console.log("received", response);
    if (response.nonce === reqNonce) {
      const now = new Date();
      const duration = now - reqTime;
      console.log("duration", duration);
    }

    if (asynchronous) {
        setTimeout(() => connection.processResponse(response), 500);
        return;
    } else {
        return response;
    }
  };

  function createSimpleInterceptor() {
    connection = interceptSolver(onMessage, onRequest);
    if (connection) {
        console.log('solver intercepted');
    }
  }

  const doShim = function () {
    setTimeout(createSimpleInterceptor, 500);
  };

  if (window.grid) {
    doShim();
  } else {
    document.addEventListener("DOMContentLoaded", (event) => {
      doShim();
    });
  }
})();
