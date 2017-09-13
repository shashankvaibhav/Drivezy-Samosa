import React, { Component } from 'react';
import { AppRegistry, TextInput, View, TouchableOpacity, Text, Keyboard } from 'react-native';
import {Scene, Router, Modal, Actions} from 'react-native-router-flux';
import RNFirebase from 'react-native-firebase'
const firebase = RNFirebase.initializeApp({
  debug:true
});


export default class UselessTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '' ,
      price:0,
      url:''
    };
  }

  submit=()=>{
    Actions.pop()

    var newOrderRef = firebase.database().ref('Menu').push();
    newOrderRef.set({
      id: newOrderRef.key,
      status:1,
      name:this.state.name,
      price:parseInt(this.state.price),
      image:this.state.url
    })
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={1} style={{flex:1, alignItems:'center'}} onPress={()=>Keyboard.dismiss()}>
        <TextInput
          style={{padding:6,height: 40,width:300 , borderColor: '#fafafa', borderWidth: 1, backgroundColor:'#fafafa',marginTop:20}}
          onChangeText={(text) => this.setState({name:text})}
          value={this.state.name}
          placeholder='Name'
        />

        <TextInput
          style={{padding:6,height: 40,width:300 , borderColor: '#fafafa', borderWidth: 1, backgroundColor:'#fafafa',marginTop:20}}
          onChangeText={(text) => this.setState({price:text})}
          value={this.state.price}
          placeholder='Price'
        />

        <TextInput
          style={{padding:6,height: 40,width:300 , borderColor: '#fafafa', borderWidth: 1, backgroundColor:'#fafafa',marginTop:20}}
          onChangeText={(text) => this.setState({url:text})}
          value={this.state.url}
          placeholder='Photo Url'
        />

        <TouchableOpacity style={{backgroundColor:'#3498db',position:'absolute',bottom:0,left:0,right:0,height:50,justifyContent:'center',alignItems:'center'}} onPress={()=>this.submit()}>
          <Text style={{color:'white',fontSize:17,fontWeight:'600'}}>SUBMIT</Text>
        </TouchableOpacity>


      </TouchableOpacity>

    );
  }
}
