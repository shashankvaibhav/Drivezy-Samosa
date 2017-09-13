import React, { Component } from 'react';
import { AppRegistry, Text, View, ListView, TouchableOpacity, Image} from 'react-native';
import RNFirebase from 'react-native-firebase'
import {Scene, Router, Modal, Actions} from 'react-native-router-flux';
const firebase = RNFirebase.initializeApp({
  debug:true
});

export default class Home extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
  }

  componentDidMount=()=>{
    firebase.database()
      .ref('Menu')
      .on('value', (snapshot) => {
        var menuObject = snapshot.val();
        if (menuObject == null) {
          return
        }
        var menuArray = Object.keys(menuObject).map(key => menuObject[key]);

        var filtered = [];
        for (var i = 0; i < menuArray.length; i++) {
            if (menuArray[i] != null) {
                filtered.push(menuArray[i]);
            }
        }

        this.setState({
             dataSource: this.state.dataSource.cloneWithRows(filtered),
        })
      });
  }

  menuUnAvailable=(rowData)=>{
    firebase.database()
    .ref('Menu/'+rowData.id)
    .update({
      status: 0
    });
  }

  menuAvailable=(rowData)=>{
    firebase.database()
    .ref('Menu/'+rowData.id)
    .update({
      status: 1
    });
  }


  renderRow=(rowData)=>{
    var available = true
    if (rowData.status == 0) {
      available = false
    }

    var image = ''
    if (rowData.image != null) {
      image = rowData.image
    }

    return(
      <View style={{flex:0.9,backgroundColor:'white',height:170,marginTop:10}}>
        <View style={{flex:1,flexDirection:'row'}}>
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          {image?(
            <Image
              style={{width: 60, height: 60}}
              source={{uri: image}}
            />
          ):(
            <Image
              style={{width: 60, height: 60}}
              source={require('../images/pan.png')}
            />
          )}

          </View>
          <View style={{flex:2,justifyContent:'center',alignItems:'flex-start'}}>
            <Text style={{color:'#222222',fontWeight:'400',fontSize:18,padding:10}}>{rowData.name}</Text>
            <Text style={{color:'#222222',fontWeight:'600',fontSize:16,padding:10}}>₹ {rowData.price}</Text>
          </View>
        </View>
        {available?(
          <TouchableOpacity style={{flex:0.4,backgroundColor:'green',justifyContent:'center',alignItems:'center',borderTopWidth:1,borderColor:'#f6f6f6',margin:5,borderRadius:4}} onPress={()=>this.menuUnAvailable(rowData)}>
            <Text style={{color:'white',fontWeight:'600',fontSize:16}}>MAKE UNAVAILABLE&#8674;</Text>
          </TouchableOpacity>
        ):(
          <TouchableOpacity style={{flex:0.4,backgroundColor:'red',justifyContent:'center',alignItems:'center',borderTopWidth:1,borderColor:'#f6f6f6',margin:5,borderRadius:4}} onPress={()=>this.menuAvailable(rowData)}>
            <Text style={{color:'white',fontWeight:'600',fontSize:16}}>MAKE AVAILABLE</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  render() {
    return (
      <View style={{flex:1}}>

      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => this.renderRow(rowData)}
      />

      </View>

    );
  }
}
