import React from 'react'
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

import { routeConfig } from './app.router'
import '../style.scss';

const RouteWithSubRoutes = (route) => (
  <Route path={route.path} render={(props) => (
    <route.component {...props} routes={route.routes}/>
  )}/>
)

ReactDOM.render(
  <Router>
    <div>
      {routeConfig.map((route) => (
        <RouteWithSubRoutes key={route.path} {...route} />
      ))}
    </div>
  </Router>, document.getElementById('app')
)