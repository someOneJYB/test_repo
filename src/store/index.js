import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducer'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default function configureStore(preloadedState) {
    const store = createStore(
        combineReducers({num: rootReducer}),
        preloadedState,
        composeEnhancers(applyMiddleware(
            thunkMiddleware
        ))
    )
    return store;
}
