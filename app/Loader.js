import React, { Component } from 'react';
import { AppRegistry, Text, View, ListView, TouchableOpacity, Image} from 'react-native';
import RNFirebase from 'react-native-firebase'
import {Scene, Router, Modal, Actions} from 'react-native-router-flux';

export default class StatusModal extends Component {

  constructor(props) {
    super(props)
    // set state with passed in props
    this.state = {
      message: props.error,
      hide: props.hide,
    }
    // bind functions
    this.dismissModal = this.dismissModal.bind(this)
  }

  dismissModal() {
    this.setState({hide: true})
  }

  // show or hide Modal based on 'hide' prop
  render() {
    if(this.state.hide){
      return (
        <TouchableOpacity activeOpacity={1.0} style={{flex:1,backgroundColor:'rgba(0,0,0,0.6)',justifyContent:'center',alignItems:'center',
      position:'absolute',
      top:0,
      left:0,
      right:0,
      bottom:0}}>

        </TouchableOpacity>
      )
    } else {
        return (
          <TouchableOpacity activeOpacity={1.0} style={{flex:1,backgroundColor:'rgba(0,0,0,0.6)',justifyContent:'center',alignItems:'center',
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0}}>
            <TouchableOpacity activeOpacity={1.0} style={{width:300,height:150,backgroundColor:'white',borderRadius:10,justifyContent:'center',alignItems:'center'}}>
              <View style={{flex:1}}>
                <Text style={{fontSize:15,padding:20,fontWeight:'600',color:'black'}}>Are you sure you want to cancel?</Text>
              </View>
              <View style={{flex:0.5,flexDirection:'row',borderTopWidth:1,borderColor:'#d3d3d3'}}>
                <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:16,fontWeight:'700'}}>No</Text>
                </TouchableOpacity>
                <View style={{width:0.5,backgroundColor:'#d3d3d3'}}/>
                <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:16,fontWeight:'700'}}>Yes, cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        )
      }
  }
}
