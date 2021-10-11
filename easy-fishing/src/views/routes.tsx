import React from 'react';
import {
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import { Login } from './pages/Login';
import { Registration } from './pages/Registration';
import { UserPageTable } from './pages/UserPageTable';
import { UserPage } from './pages/UserPage';
import { MainPage } from './pages/MainPage';

export const useRoutes = (isAuthenticated: boolean) => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Switch>
                    <Route path="/user/page/table" exact>
                        <UserPageTable />
                    </Route>
                    <Route path="/user/page" exact>
                        <UserPage />
                    </Route>
                    <Redirect to='/user/page' />
                </Switch>
            </Switch>
        );
    }

    return (
        <Switch>
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/registration">
                <Registration />
            </Route>
            <Route path="/" exact>
                <MainPage />
            </Route>
            <Redirect to='/' />
        </Switch>
    );
}