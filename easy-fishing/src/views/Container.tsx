import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { useRoutes } from './routes';
import { selectIsAuthenticated } from './containerSlice';
import { useAppSelector } from '../app/hooks';


export function Container() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const routes = useRoutes(isAuthenticated);

  return (
    <Router>
      <div className="container">
        {routes}
      </div>
    </Router >
  );
}
