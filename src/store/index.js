import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducer'

export default function configureStore(preloadedState) {
    return createStore(
        combineReducers({num: rootReducer}),
        preloadedState,
        applyMiddleware(
            thunkMiddleware
        )
    )
}
