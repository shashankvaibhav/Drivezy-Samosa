/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import {
   AppRegistry,
 } from 'react-native';
import Samosa from './app/index';

import { Tester, TestHookStore } from 'cavy';
import SamosaSpec from './SamosaSpec';

const testHookStore = new TestHookStore();

class AppWrapper extends Component {
  render() {
    return (
      <Tester specs={[SamosaSpec]} store={testHookStore} waitTime={1000} startDelay={3000}>
        <Samosa />
      </Tester>
    );
  }
}

 AppRegistry.registerComponent('Samosa', () =>AppWrapper);
