import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import store from '/imports/client/store'


import { HomeContainer } from '/imports/client/ui/containers/HomeContainer.jsx'
import App from '/imports/client/ui/containers/App.jsx'

import { TopogramViewContainer } from '/imports/client/ui/containers/TopogramViewContainer.jsx'
import { TopogramViewContainerForMapScreenshots } from '/imports/client/ui/containers/TopogramViewContainerForMapScreenshots.jsx'

import { TopogramViewContainerForNetScreenshots } from '/imports/client/ui/containers/TopogramViewContainerForNetScreenshots.jsx'
import { TopogramViewContainerForMapScreenshotsNoTiles } from '/imports/client/ui/containers/TopogramViewContainerForMapScreenshotsNoTiles.jsx'
import { TopogramViewContainerForMapScreenshotsNoTilesWithMainVenuesHighlighted} from '/imports/client/ui/containers/TopogramViewContainerForMapScreenshotsNoTilesWithMainVenuesHighlighted.jsx'

import { TopogramsPrivateListContainer } from '/imports/client/ui/containers/TopogramsPrivateListContainer.jsx'

import { SignUpPage } from '/imports/client/ui/pages/SignUpPage.jsx'
import { LoginPage } from '/imports/client/ui/pages/LoginPage.jsx'
import Page404 from '/imports/client/ui/pages/Page404.jsx'

export const renderRoutes = () => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/"
        component={App}>
        <IndexRoute component={HomeContainer}/>
        <Route path="topograms"
          component={TopogramsPrivateListContainer}/>
        <Route path="topograms/:topogramId"
          component={TopogramViewContainer}/>
        <Route path="topograms/:topogramId/view"
          component={TopogramViewContainer}/>
        <Route path="topograms/:topogramId/map"
            component={TopogramViewContainerForMapScreenshots}/>
        <Route path="topograms/:topogramId/map_without_tiles"
                component={TopogramViewContainerForMapScreenshotsNoTiles}/>
        <Route path="topograms/:topogramId/map_without_tiles_highlighted"
                        component={TopogramViewContainerForMapScreenshotsNoTilesWithMainVenuesHighlighted}/>
        <Route path="topograms/:topogramId/network"
            component={TopogramViewContainerForNetScreenshots}/>

        <Route path="/signup"
          component={SignUpPage}/>
        <Route path="/login"
          component={LoginPage}/>
        <Route path="*"
          component={Page404}/>
      </Route>
    </Router>
  </Provider>
)
