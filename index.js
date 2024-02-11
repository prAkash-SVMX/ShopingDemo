/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './js/reducer/reducers';
const store=createStore(rootReducer);
const ReduxWrapper=()=>{
    return (<Provider store={store}>
        <App></App>
    </Provider>)
}

AppRegistry.registerComponent(appName, () => ReduxWrapper);
