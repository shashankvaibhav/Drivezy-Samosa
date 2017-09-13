import React, { Component } from 'react';
import { AppRegistry, Text, View, ListView, TouchableOpacity, Image} from 'react-native';
import RNFirebase from 'react-native-firebase'
const firebase = RNFirebase.initializeApp({
  debug:false
});

export default class Home extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      object:{},
      empty:false
    };
  }

  componentDidMount=()=>{
    firebase.database()
      .ref('User/'+firebase.auth().currentUser.uid+'/Order')
      .on('value', (snapshot) => {

        var orderObject = snapshot.val();

        var keys = [];
        for(var k in orderObject) keys.push(k);

        for (var i = 0; i < keys.length; i++) {
          firebase.database()
            .ref('Order/'+keys[i])
            .on('value', (snapshot) => {

              var temp = this.state.object;
              temp[snapshot.val().id] = snapshot.val()
              this.setState({object:temp})

              var newArray = Object.keys(this.state.object).map(key => this.state.object[key]);

              if (newArray.length==0) {
                this.setState({empty:true})
              }

              newArray.sort(function(a, b) {
                  return parseFloat(b.createdAt) - parseFloat(a.createdAt);
              });

              this.setState({
                   dataSource: this.state.dataSource.cloneWithRows(newArray),
              })
            });
        }
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

    var d = new Date(rowData.createdAt);
    var time = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

    return(
      <View style={{flex:1,backgroundColor:'white',height:150,marginTop:10}}>
        <View style={{flex:1,flexDirection:'row',bottomBorderWidth:1,borderColor:'#fafafa'}}>
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
          <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:'#222222',fontWeight:'600',fontSize:18,padding:10,textAlign:'left'}}>{rowData.menu_name}</Text>
            <Text style={{color:'#222222',fontWeight:'600',fontSize:14,padding:10,textAlign:'left'}}>Ordered at:{time}</Text>
          </View>
        </View>

        <View>
        </View>
        {rowData.status == -1?(
          <View style={{flex:0.3,justifyContent:'center',alignItems:'center',backgroundColor:'#fafafa',flexDirection:'row'}}>
            <Text style={{color:'#bdbdbd',fontWeight:'500',fontSize:18,padding:10}}>ORDERED &#8658;</Text>
            <Text style={{color:'#3498db',fontWeight:'500',fontSize:18,padding:10}}>CANCELLED</Text>
          </View>
        ):(null)}
        {rowData.status == 0?(
          <View style={{flex:0.3,justifyContent:'center',alignItems:'center',backgroundColor:'#fafafa',flexDirection:'row'}}>
            <Text style={{color:'#3498db',fontWeight:'500',fontSize:18,padding:10}}>ORDERED&#8658;</Text>
            <Text style={{color:'#bdbdbd',fontWeight:'500',fontSize:18,padding:10}}>PREPARED&#8658;</Text>
            <Text style={{color:'#bdbdbd',fontWeight:'500',fontSize:18,padding:10}}>DELIVERED</Text>
          </View>
        ):(null)}
        {rowData.status == 1?(
          <View style={{flex:0.3,justifyContent:'center',alignItems:'center',backgroundColor:'#fafafa',flexDirection:'row'}}>
            <Text style={{color:'#bdbdbd',fontWeight:'500',fontSize:18,padding:10}}>ORDERED&#8658;</Text>
            <Text style={{color:'#3498db',fontWeight:'500',fontSize:18,padding:10}}>PREPARED&#8658;</Text>
            <Text style={{color:'#bdbdbd',fontWeight:'500',fontSize:18,padding:10}}>DELIVERED</Text>
          </View>
        ):(null)}
        {rowData.status == 2?(
          <View style={{flex:0.3,justifyContent:'center',alignItems:'center',backgroundColor:'#fafafa',flexDirection:'row'}}>
            <Text style={{color:'#bdbdbd',fontWeight:'500',fontSize:18,padding:10}}>ORDERED&#8658;</Text>
            <Text style={{color:'#bdbdbd',fontWeight:'500',fontSize:18,padding:10}}>PREPARED&#8658;</Text>
            <Text style={{color:'#3498db',fontWeight:'500',fontSize:18,padding:10}}>DELIVERED</Text>
          </View>
        ):(null)}
      </View>
    );
  }

  render() {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        {this.state.empty? (
          <Text>Nothing here...</Text>
        ):(
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => this.renderRow(rowData)}
          />
        )}

      </View>

    );
  }
}
