import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'
import routes from './routes';

const Root = () => (
            <Switch>
            {routes.map(i => ( <Route exact={i.exact} key={i.path} path={i.path} component={i.component} />))}
            </Switch>
)

Root.propTypes = {
    store: PropTypes.object.isRequired
}

export default Root
