import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from "redux-logger";
import { BestParks } from './best-parks';
import { CheapParks } from './cheap-parks';
import { NearParks } from './near-parks'
import { ParkStatus } from './park-status';
import { ParkInfo } from './park-info';
import { Comments } from './comments';
import { reducer as formReducer } from 'redux-form';
import { InitialSignup } from './signup';
import { createForms } from 'react-redux-form';
import { InitialLogin } from './login';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            best_parks: BestParks,
            cheap_parks: CheapParks,
            near_parks: NearParks,
            park_status: ParkStatus,
            park_info: ParkInfo,
            comments: Comments,
            form: formReducer,
            ...createForms({
                signup: InitialSignup,
                login: InitialLogin
            })
        }),
        applyMiddleware(thunk, logger)
    );
    return store;
}