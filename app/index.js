import {Scene, Router, Modal, Actions} from 'react-native-router-flux';
import React, { Component } from 'react';
import { AppRegistry, Text } from 'react-native';

import SplashLogin from './SplashLogin'

import UserHome from './UserHome'
import UserCart from './UserCart'
import UserOrders from './UserOrders'

import AdminHome from './AdminHome'
import AdminSecond from './AdminSecond'
import AddMenu from './AddMenu'

import Loader from './Loader'

CART = require('./Cart');
USER = require('./User');


export default class Index extends Component {

  clickedonRight=()=>{
    if (USER.admin == 0) {
      Actions.user_orders()
    } else{
      Actions.admin_second()
    }

  }

  clickedonLeft=()=>{
    if (USER.admin == 0) {
      Actions.user_cart()
    }
  }

  addNewMenu=()=>{
    Actions.add_menu()
  }

  render() {

    const getSceneStyle = () => {
    const style = {
      backgroundColor: 'transparent'
    };
    return style;
    };

    return <Router>
      <Scene key="modal" component={Modal} hideNavBar={true}>
        <Scene key="root" navigationBarStyle={{backgroundColor:'#3498db',borderBottomColor: 'transparent',borderBottomWidth:0}} titleStyle={{color:'white',textAlign:'center'}} headerTintColor="#ffffff">
          <Scene key="user_home" component={UserHome} title="Menu" initial titleStyle={{color:'white'}} onRight={()=> this.clickedonRight()} rightTitle="Orders" onLeft={()=>this.clickedonLeft()} leftTitle="Cart" titleWrapperStyle={{width:100}}  leftButtonStyle={{width:60}} rightButtonStyle={{width:80}}/>
          <Scene key="user_cart" component={UserCart} title="Your Cart"/>
          <Scene key="user_orders" component={UserOrders} title="Your Orders"/>
          <Scene key="admin_home" component={AdminHome} title="Orders"/>
          <Scene key="admin_second" component={AdminSecond} title="Menu" onRight={()=> this.addNewMenu()} rightTitle="Add"/>
          <Scene key="add_menu" component={AddMenu} title="Add new item"/>
        </Scene>
        <Scene key="splash_login" component={SplashLogin} title="" hideNavBar={true} initial={true}/>
        <Scene key="loader" component={Loader} title="" hideNavBar={true} getSceneStyle={getSceneStyle}/>
      </Scene>
    </Router>
  }
}
