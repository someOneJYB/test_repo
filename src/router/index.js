import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { HashRouter as Router, Route } from 'react-router-dom'
import routes from './routes';

const Root = ({ store }) => (
    <Provider store={store}>
        <Router>
            {routes.map(i => ( <Route exact={i.exact} key={i.path} path={i.path} component={i.component} />))}
        </Router>
    </Provider>
)

Root.propTypes = {
    store: PropTypes.object.isRequired
}

export default Root
