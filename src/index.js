import React from 'react'
import { render } from 'react-dom'
import './index.less';
import Root from './App'
// import * as serviceWorker from './serviceWorker';

// serviceWorker.unregister();

// Read the state sent with markup
const state = window.__STATE__;

// delete the state from global window object
delete window.__STATE__;

/**
 * hydrate the page to make sure both server and client
 * side pages are identical. This includes markup checking,
 * react comments to identify elements and more.
 */
const elRoot = document.getElementById('app');

const renderD = Component => {
    render(
        <Component/>, elRoot
    )
};

renderD(Root);
