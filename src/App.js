import React, { Component } from 'react';
import './App.css';


import {GlobalEnvParams} from './core/envconfig'
import './utils/dateutil'
import {BrowserRouter, HashRouter, Route, Switch} from 'react-router-dom'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { LocaleProvider } from 'antd'
import Mqtt from './views/mqtt/index'
Component.prototype.GlobalEnvParams = GlobalEnvParams;

class App extends Component {

  render() {
    const browserRouter = this.GlobalEnvParams.IS_BrowserRouter;
    let router = null;
    if (browserRouter) {
      router =  <BrowserRouter >
        <Switch>
          <Route path='/' component={Mqtt}/>
        </Switch>
      </BrowserRouter>;
    } else {
      router =  <HashRouter >
        <Switch>
          <Route path='/' component={Mqtt}/>
        </Switch>
      </HashRouter>;
    }

    return (
        <LocaleProvider locale={zh_CN}>
          {router}
        </LocaleProvider>
    );
  }
}

export default App;
