import App from '../page/App';
import Home from '../page/Home';
import React from 'react'
import Loadable from 'react-loadable';
const Loading = () => <h3>加载中</h3>
export default [
    {
        path: '/app',
        component: Loadable({
            loader: () => import('../page/App'),
            loading: Loading,
        }),
        exact: true,
    },
    {
        path: '/home',
        component: Loadable({
            loader: () => import('../page/Home'),
            loading: Loading,
        }),
        exact: true,
    },
    {
        path: '/detail',
        component: Loadable({
            loader: () => import('../page/Detail'),
            loading: Loading,
        }),
        exact: true,
    },
    {
        path: '/x',
        component: Loadable({
            loader: () => import('../page/X'),
            loading: Loading,
        }),
        exact: true,
    },
    {
        path: '/y',
        component: Loadable({
            loader: () => import('../page/Y'),
            loading: Loading,
        }),
        exact: true,
    },
    {
        path: '/z',
        component: Loadable({
            loader: () => import('../page/Z'),
            loading: Loading,
        }),
        exact: true,
    },
]
