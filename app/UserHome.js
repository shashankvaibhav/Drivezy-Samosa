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
      name:'',
      wallet:0,
    };
  }

  componentDidMount=()=>{
    firebase.database()
      .ref('User/'+firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
        var userObject = snapshot.val();
        USER.wallet = userObject.wallet_amount
        if (userObject.admin != null && userObject.admin ==1 ) {
          USER.admin = 1
          Actions.refresh({title: 'Recent Orders', leftTitle: '', rightTitle:'Menu'})
          this.adminData()
        }else{
          this.userData()
        }

        this.setState({
             name: userObject.name,
             wallet:userObject.wallet_amount
        })
      });
  }

  userData=()=>{
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
            if (menuArray[i].status == 1) {
                filtered.push(menuArray[i]);
            }
        }

        this.setState({
             dataSource: this.state.dataSource.cloneWithRows(filtered),
        })
      });
  }

  adminData=()=>{
    firebase.database()
      .ref('Order')
      .on('value', (snapshot) => {
        var menuObject = snapshot.val();
        if (menuObject == null) {
          return
        }
        var menuArray = Object.keys(menuObject).map(key => menuObject[key]);

        menuArray.sort(function(a, b) {
            return parseFloat(b.createdAt) - parseFloat(a.createdAt);
        });

        var filtered = [];
        for (var i = 0; i < menuArray.length; i++) {
            if (menuArray[i].status >= 0 && menuArray[i].status <= 1) {
                filtered.push(menuArray[i]);
            }
        }

        this.setState({
             dataSource: this.state.dataSource.cloneWithRows(filtered),
        })
      });
  }

  addToCart=(rowData)=>{
    alert(rowData.name+" added to cart")
    var array = CART.cart;
    array.push({menu_id:rowData.id,menu_name:rowData.name,menu_image:rowData.image,menu_price:rowData.price})
    CART.cart = array
  }

  renderRowAdmin=(rowData)=>{

    var image = ''
    if (rowData.image != null) {
      image = rowData.image
    }

    var d = new Date(rowData.createdAt)
    var time = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);;

    return(
      <View style={{flex:0.9,backgroundColor:'white',height:170,marginTop:15}}>
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
            <Text style={{color:'#222222',fontWeight:'600',fontSize:22,padding:5}}>{(rowData.menu_name.charAt(0).toUpperCase() + rowData.menu_name.slice(1))}</Text>
            <Text style={{color:'#222222',fontWeight:'400',fontSize:16,padding:5}}>{(rowData.user_name.charAt(0).toUpperCase() + rowData.user_name.slice(1))}</Text>
            <Text style={{color:'#222222',fontWeight:'400',fontSize:14,padding:5}}>Ordered at: {time}</Text>
          </View>
        </View>

        <View style={{flex:0.4,justifyContent:'center',alignItems:'center',backgroundColor:'#fafafa',flexDirection:'row'}}>

          {rowData.status == 0?(
            <TouchableOpacity style={{flex:1,backgroundColor:'blue',margin:8,borderRadius:6}} onPress={()=>this.foodPrepared(rowData)}>
              <Text style={{color:'white',fontWeight:'bold',fontSize:18,padding:10, textAlign:'center'}}>READY</Text>
            </TouchableOpacity>
          ):(
            null
          )}

          {rowData.status == 1?(
            <TouchableOpacity style={{flex:1,backgroundColor:'green',margin:8,borderRadius:6}} onPress={()=>this.foodDelivered(rowData)}>
              <Text style={{color:'white',fontWeight:'bold',fontSize:18,padding:10, textAlign:'center'}}>CLOSE</Text>
            </TouchableOpacity>
          ):(
            null
          )}

        </View>

      </View>
    );
  }

  foodPrepared=(rowData)=>{
    firebase.database()
    .ref('Order/'+rowData.id)
    .update({
      status: 1
    });
  }

  foodDelivered=(rowData)=>{
    firebase.database()
    .ref('Order/'+rowData.id)
    .update({
      status: 2
    });
  }


  renderRow=(rowData)=>{
    var unavailable = false
    if (rowData.status == 0) {
      unavailable = true
    }

    var image = ''
    if (rowData.image != null) {
      image = rowData.image
    }

    return(
      <View style={{flex:0.9,backgroundColor:'#fafafa',height:150,marginTop:10}}>
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
        { unavailable? (
          <View style={{flex:0.4,backgroundColor:'white',justifyContent:'center',alignItems:'center',borderTopWidth:1,borderColor:'#f6f6f6'}}>
            <Text style={{color:'#bdbdbd',fontWeight:'600',fontSize:16}}>UNAVAILABLE</Text>
          </View>
        ):(
          <TouchableOpacity style={{flex:0.4,backgroundColor:'white',justifyContent:'center',alignItems:'center',borderTopWidth:1,borderColor:'#f6f6f6'}} onPress={()=>this.addToCart(rowData)}>
            <Text style={{color:'#3498db',fontWeight:'600',fontSize:16}}>ADD TO CART</Text>
          </TouchableOpacity>
        )}

      </View>
    );
  }

  render() {
    return (
      <View style={{flex:1}}>

      {USER.admin == 0?(
        <View style={{flex:1}}>
          <View style={{backgroundColor:'#3498db',height:60,elevation:2,flexDirection:'row',padding:10}}>
            <Text style={{color:'white',fontSize:18,padding:6,fontWeight:'600',textAlign:'left'}}>{this.state.name.charAt(0).toUpperCase() + this.state.name.slice(1)}</Text>
            <Text style={{color:'white',fontSize:18,padding:6,fontWeight:'600',textAlign:'right'}}>₹ {this.state.wallet}</Text>
          </View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => this.renderRow(rowData)}
          />
        </View>
      ):(
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this.renderRowAdmin(rowData)}
        />
      )}

      </View>

    );
  }
}
