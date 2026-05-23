import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

import { paths } from './paths';

export function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path={paths.login}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path={paths.register}
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path={paths.home}
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}