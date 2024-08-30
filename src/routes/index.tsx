import React, { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import { AuthApi, BalanceApi, CartApi, ProductApi, TransactionApi } from '../apis';
import { ACCESS_TOKEN_KEY, AUTH_ROUTES, HELP_CENTER_ROUTES, IRoute, MAIN_ROUTES } from '../constants';
import { StorageHelper } from '../helpers';
import { HelpCenterLayout, MainLayout } from '../layout';
import { UserModel } from '../shared/models';
import { CartModel } from '../shared/models/cart.model';
import { addToCart, setBalances, setProducts, setTransactions, setUser } from '../store/actions';
import { getUser } from '../store/selectors';

const childRoutes = (routeType: string, Layout: FC, routes: IRoute[]) =>
  routes.map(({ component: Component, guard, children, path }, index) => {
    const Guard = guard || React.Fragment;

    return children ? (
      children.map((element: IRoute, index: number) => {
        const Guard = element.guard || React.Fragment;
        const ElementComponent = element.component || React.Fragment;
        if (element.path === 'confirm-email') {
          alert('ConfirmEmail');
        }
        return (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <Route
            key={index}
            path={element.path}
            exact
            render={(props) => (
              <Layout>
                <Guard>
                  <ElementComponent {...props} />
                </Guard>
              </Layout>
            )}
          />
        );
      })
    ) : Component ? (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <Route
        key={index}
        path={path}
        exact
        render={(props) => (
          <Layout>
            <Guard>
              <Component {...props} />
            </Guard>
          </Layout>
        )}
      />
    ) : null;
  });

const AppRoutes: FC = () => {
  const user = useSelector(getUser);

  const dispatch = useDispatch();

  const token = StorageHelper.getItem(ACCESS_TOKEN_KEY);

  useEffect(() => {
    ProductApi.readAll({}).then(r => {
      dispatch(setProducts(r.products))
    })
  }, [])
  if (!user && token) {
    AuthApi.me()
      .then((res) => {
        const user = new UserModel(res.user);
        if (user) {
          dispatch(setUser(user));
        }
      })
      .catch((err) => console.log(err));
  }

  const setUserBalances = useCallback(() => {
    BalanceApi.getBalance({
      options: {
        id: user?.id
      }
    })
      .then((res) => {
        dispatch(setBalances(res.balance));
      })
      .catch((err) => {
        dispatch(setBalances({}));
        console.log(err);
      });
  }, [dispatch, user]);

  const setUserTransactions = useCallback(() => {
    TransactionApi.gettransactions({
      query: {
        userId: user?.id
      },
      options: {
        limit: 5
      }
    })
      .then((res) => {
        dispatch(setTransactions(res.transactions));
      })
      .catch((err) => {
        dispatch(setTransactions([]));
        console.log(err);
      });
  }, [dispatch, user]);

  const setUserCart = useCallback(
    (userId: string) => {
      CartApi.read({
        fingerprint: userId
      })
        .then((res) => {
          dispatch(addToCart(new CartModel(res.cart)));
        })
        .catch((err) => {
          dispatch(addToCart(null));
          console.log(err);
        });
    },
    [dispatch]
  );

  useEffect(() => {
    if (user) {
      setUserBalances();
      setUserTransactions();
      setUserCart(user?.id);
    }
  }, [user, dispatch, setUserBalances, setUserTransactions, setUserCart]);

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Router>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*@ts-ignore*/}
      <Switch>
        {childRoutes('public', MainLayout, AUTH_ROUTES)}
        {childRoutes('public', MainLayout, MAIN_ROUTES)}
        {childRoutes('public', HelpCenterLayout, HELP_CENTER_ROUTES)}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/*@ts-ignore*/}
        <Redirect path="*" to={'/'} />
      </Switch>
    </Router>
  );
};

export default AppRoutes;
