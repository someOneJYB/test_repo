import React from 'react'
import Loadable from 'react-loadable';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom'
import getCreateStore from '../src/store'
import {Provider} from 'react-redux';
import path from 'path';
import fs from 'fs';
import {Helmet} from 'react-helmet';
import { ChunkExtractor } from '@loadable/server';
import App from '../src/router/index';
import 'isomorphic-fetch'

const prepHTML=(data,{html,head,style,body,script,css,state})=>{
    data=data.replace('<html',`<html ${html}`);
    data=data.replace('</head>',`${head}${style}</head>`);
    data=data.replace('<body>',`<body><script>window._INIT_STATE_ = ${JSON.stringify(state)}</script>`);
    data=data.replace('<div>hahahahhah</div><div id="root"></div>',`<div id="root">${body}</div><div>hahahahhah</div>`);
    data=data.replace('</body>',`${script}</body>`);
    return data;
}


const render=async (ctx)=>{
    const filePath = path.resolve(__dirname,'../dist/index.html')
    let htmlData=fs.readFileSync(filePath,'utf8');

    const store = getCreateStore({ num: 1 });

    //初始请求数据
    //await initalActions(store,ctx.req.url,initialRequestConfig)
    let state=store.getState();
    console.log(state, 'state........................')
    let modules=[];
    let routeMarkup =renderToString(
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
            <Provider store={store}>
                <StaticRouter location={ctx.request.url} context={ctx}>
                    <App/>
                </StaticRouter>
            </Provider>
        </Loadable.Capture>
    )
    const extractor = new ChunkExtractor({ statsFile: path.resolve(process.cwd(), 'dist/loadable-stats.json') });
    const renderedScriptTags = extractor.getScriptTags();
    const renderedLinkTags = extractor.getLinkTags();
    const renderedStyleTags = extractor.getStyleTags();
    const helmet=Helmet.renderStatic();
    const html=prepHTML(htmlData,{
        html:helmet.htmlAttributes.toString(),
        head:helmet.title.toString()+helmet.meta.toString()+helmet.link.toString(),
        style:renderedStyleTags,
        body:routeMarkup,
        script:renderedScriptTags,
        state,
    })
    console.log('body--------send')
    ctx.body=html
}

export default render;
