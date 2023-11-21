import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import radarReducer from 'Redux/RadarReducer'
import radarTemplateReducer from 'Redux/RadarTemplateReducer'
import userReducer from 'Redux/UserReducer'
import teamReducer from 'Redux/TeamReducer'

export const appsProviderStore = createStore(combineReducers({
    radarReducer: radarReducer,
    radarTemplateReducer: radarTemplateReducer,
    userReducer: userReducer,
    teamReducer: teamReducer}),
    applyMiddleware(thunk));
