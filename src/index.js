import React from 'react'
import { render } from 'react-dom'
import { loadableReady } from '@loadable/component';
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
    // eslint-disable-next-line no-undef
    loadableReady(() => {
        render(
            <Component/>, elRoot
        )
    });
};

renderD(Root);

// Webpack Hot Module Replacement API
if (module.hot) {
    console.log('hot')
    module.hot.accept('./App', () => {
        render(require('./App').default);
    });
    // module.hot.check().then(modules => {
    //   console.log('modules: ', modules);
    // });
    // module.hot.addStatusHandler((status) => {
    //   console.log('status: ', status);
    //   if (status === 'idle') {
    //     // window.location.reload()
    //   }
    // })
}
