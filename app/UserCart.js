import React, { Component } from 'react';
import { AppRegistry, Text, View, ListView, TouchableOpacity, Image} from 'react-native';
import RNFirebase from 'react-native-firebase'
const firebase = RNFirebase.initializeApp({
  debug:true
});

export default class Home extends Component {

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    var temp = 0
    var t = true
    for (var i = 0; i < CART.cart.length; i++) {
      temp = temp + CART.cart[i].menu_price
      t = false
    }

    this.state = {
      dataSource: ds.cloneWithRows(CART.cart),
      amount:temp,
      empty:t
    };
  }

  confirmPayment=()=>{

    if (this.state.amount > USER.wallet) {
      alert("Not enough amount in wallet")
      return
    }


    alert("Order confirmed. See the status in orders. Go get them when status is prepared")

    for (var i = 0; i < CART.cart.length; i++) {
      var newOrderRef = firebase.database().ref('Order').push();
      newOrderRef.set({
        id: newOrderRef.key,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        menu_id:CART.cart[i].menu_id,
        menu_name:CART.cart[i].menu_name,
        quantity:1,
        status:0,
        user_id:firebase.auth().currentUser.uid,
        user_name:firebase.auth().currentUser.displayName
      })

      firebase.database().ref('User/'+firebase.auth().currentUser.uid+'/Order/'+newOrderRef.key).set({
        createdAt:firebase.database.ServerValue.TIMESTAMP
      });
    }

    CART.cart = []
    this.setState({
         dataSource: this.state.dataSource.cloneWithRows([]),
    })
  }

  removeFromCart=(sectionID,rowID)=>{
    var array = CART.cart
    array.splice(rowID, 1);
    CART.cart = array
    this.setState({
         dataSource: this.state.dataSource.cloneWithRows(array),
    })

    var temp = 0
    for (var i = 0; i < CART.cart.length; i++) {
      temp = temp + CART.cart[i].menu_price
    }

    this.state = {
      amount:temp
    };
  }

  renderRow=(rowData, sectionID, rowID)=>{

    var image = ''
    if (rowData.image != null) {
      image = rowData.menu_image
    }

    return(
      <View style={{flex:0.9,backgroundColor:'white',height:150,marginTop:10}}>
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
            <Text style={{color:'#222222',fontWeight:'400',fontSize:18,padding:10}}>{rowData.menu_name}</Text>
            <Text style={{color:'#222222',fontWeight:'600',fontSize:16,padding:10}}>₹ {rowData.menu_price}</Text>
          </View>
        </View>

        <TouchableOpacity style={{flex:0.4,justifyContent:'center',alignItems:'center',backgroundColor:'#fafafa'}} onPress={()=>this.removeFromCart(sectionID,rowID)}>
          <Text style={{color:'red',fontWeight:'500',fontSize:18,padding:10}}>REMOVE</Text>
        </TouchableOpacity>

      </View>
    );
  }

  render() {
    return (
      <View style={{flex:1}}>

        {this.state.empty? (
          <Text>No items in your cart</Text>
        ):(
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData,sectionID,rowID) => this.renderRow(rowData,sectionID,rowID)}
          />
        )}

        {CART.cart.length == 0? (
          null
        ):(
          <TouchableOpacity style={{position:'absolute',bottom:0,left:0,right:0,height:50,backgroundColor:'#3498db',justifyContent:'center',alignItems:'center'}} onPress={()=> this.confirmPayment()}>
            <Text style={{color:'white',fontSize:17,fontWeight:'600'}}>CONFIRM - ₹{this.state.amount}</Text>
          </TouchableOpacity>
        )}

      </View>

    );
  }
}
