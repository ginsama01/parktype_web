import ParkListTabs from "./ParkListComponent";
import Start from "./StartComponent";
import { useRouteMatch, Switch, Route, Redirect } from "react-router";
import Login from './LoginComponent';
import Register from './SignupComponent';

function MainUser() {
    let { path, url } = useRouteMatch()
    return (
        <div>
            <Switch>
                <Route exact path={`${url}/start`}><Start /></Route>
                <Route exact path={`${url}/parks`}><ParkListTabs /></Route>
                <Route exact path={`${url}/login`}><Login /></Route>
                <Route exact path={`${url}/register`}><Register /></Route>
            </Switch>
        </div>
    );
}

export default MainUser;