import React from 'react'
import loadable from '@loadable/component';
const Loading = () => <h3>加载中</h3>
export default [
    {
        path: '/all',
        component: loadable(() => import('../page/All'), {fallback: Loading,}),
        exact: true,
    },
    {
        path: '/mobx',
        component: loadable(() => import('../page/mobxi'), {fallback: Loading,}),
        exact: true,
    },
    {
        path: '/home',
        component: loadable(() => import('../page/Home'), {fallback: Loading,}),
        exact: true,
    },
    {
        path: '/detail',
        component: loadable(() => import('../page/Detail'), {fallback: Loading,}),
        exact: true,
    },
    {
        path: '/x',
        component: loadable(() => import('../page/X'), {fallback: Loading,}),
        exact: true,
    },
    {
        path: '/y',
        component: loadable(() => import('../page/Y'), {fallback: Loading,}),
        exact: true,
    },
    {
        path: '/z',
        component: loadable(() => import('../page/Z'), {fallback: Loading,}),
        exact: true,
    },
    {
        path: '/hooks',
        component: loadable(() => import('../page/Hook'), {fallback: Loading,}),
        exact: true,
    },
]
