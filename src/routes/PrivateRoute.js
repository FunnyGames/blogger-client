import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import * as utils from '../helpers/utils';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        isLoggedIn()
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login?from=' + encodeURIComponent(props.location.pathname) }} />
    )} />
);

function isLoggedIn() {
    return utils.getUserId();
}