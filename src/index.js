import React from 'react'
import {hydrate} from 'react-dom'
import configureStore from './store'
import './index.less';
import Root from './router'
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

hydrate(
    <Root store={configureStore(state)} />, document.getElementById('app')
)
