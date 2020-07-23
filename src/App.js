import React, { Component } from 'react';
import one from './one'
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import createStore from './store';

import AppRoutes from './router';

function f() {
    return '猪'
}
console.log(one)
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            appName: 'React-v16',
            context: {
                userName: 'jason-in-app',
            },
        };
        this.initialData = {};

        const initDataScript = document.getElementById('__INITIAL_DATA__');
        if (initDataScript) {
            try {
                this.initialData = JSON.parse(initDataScript.innerText);
            } catch (err) {
                console.error(err);
            }
        }
        console.log('this.initialData: ');
    }
    render() {
        return (
            <Provider store={createStore()}>
            <Router>
                <AppRoutes
                    context={this.state.context}
                    initialData={this.initialData}
                />
            </Router>
            </Provider>
        );
    }
}

export default App;
