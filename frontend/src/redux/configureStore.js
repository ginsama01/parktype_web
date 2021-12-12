import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from "redux-logger";
import { reducer as formReducer } from 'redux-form';
import { createForms } from 'react-redux-form';
import { BestParks } from './user/best-parks';
import { CheapParks } from './user/cheap-parks';
import { NearParks } from './user/near-parks'
import { ParkStatus } from './user/park-status';
import { ParkInfo } from './user/park-info';
import { Comments } from './user/comments';
import { InitialSignup } from './user/signup';
import { InitialLogin } from './user/login';
import { AllParks } from './user/all-parks';
import { SearchInfo } from './user/search-info';
import { FavoriteMark } from './user/favorite-mark';

import { UserList } from './admin/user-list';
import { OwnerList } from './admin/owner-list';
import { ParkList } from './admin/park-list';
import { UserChart } from './admin/user-chart';
import { RatingChart } from './admin/rating-chart';
import { TransChart } from './admin/trans-chart';

import { LoveParks } from './account/love-parks';
import { OrderParks } from './account/order-parks';
import { HistoryParks } from './account/history-parks';
import { InfoUser } from './account/info-user';
import { InitialChangInfo } from './account/change-info';
import { InitialDeleteUser} from './account/delete-user';
import { InitialDeleteLovepark } from './account/delete-lovepark';
import { InitialDeleteHistorypark } from './account/delete-historypark';
import { InitialDeleteOrderpark } from './account/delete-orderpark';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            best_parks: BestParks,
            cheap_parks: CheapParks,
            near_parks: NearParks,
            park_status: ParkStatus,
            park_info: ParkInfo,
            comments: Comments,
            all_parks: AllParks,
            search_info: SearchInfo,
            favo_mark: FavoriteMark,

            user_list: UserList,
            owner_list: OwnerList,
            park_list: ParkList,
            user_chart: UserChart,
            rating_chart: RatingChart,
            trans_chart: TransChart,
            
            love_parks: LoveParks,
            order_parks: OrderParks,
            history_parks: HistoryParks,
            info_user: InfoUser,

            form: formReducer,
            ...createForms({
                signup: InitialSignup,
                login: InitialLogin,
                changeinfo: InitialChangInfo,
                deleteUser: InitialDeleteUser,
                deleteLovepark: InitialDeleteLovepark,
                deleteHistorypark: InitialDeleteHistorypark,
                deleteOrderpark: InitialDeleteOrderpark
            })
        }),
        applyMiddleware(thunk, logger)
    );
    return store;
}