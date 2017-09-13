import React, { Component } from 'react';
import { AppRegistry, Text, View, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {Scene, Router, Modal, Actions} from 'react-native-router-flux';
import RNFirebase from 'react-native-firebase'
const firebase = RNFirebase.initializeApp({
  debug:false
});
import { hook, wrap } from 'cavy';

class Login extends Component {

  constructor(props) {
    super(props);
    scene = this
    this.state = {
      isLoggedIn:false,
      user: null
    };
  }

  componentDidMount=()=>{
    AsyncStorage.getItem('is_logged_in').then((value)=>{
      if (value == "1") {
        this.setState({isLoggedIn:true})
        Actions.root()
      }
    })
    this._setupGoogleSignin();
  }

  async _setupGoogleSignin() {
   try {
     await GoogleSignin.hasPlayServices({ autoResolve: true });
     await GoogleSignin.configure({
       iosClientId: '401658717205-ddc9nq37vd7ismtuosg4bk7cpi7q2eet.apps.googleusercontent.com',
       webClienId:'401658717205-ddc9nq37vd7ismtuosg4bk7cpi7q2eet.apps.googleusercontent.com'
     });

     const user = await GoogleSignin.currentUserAsync();
     this.setState({user});
   }
   catch(err) {

   }
 }

   _signIn() {
      GoogleSignin.signIn()
      .then((user) => {
        this.setState({user: user});
        if (this.validateEmail(user.email)) {
          this.attemptFirebaseLogin(user.idToken,user.accessToken);
        }else{
          alert("Only accessible to drivezy account")
        }

      })
      .catch((err) => {

      })
      .done();
    }

    validateEmail(email) {
      var string = email,
      substring = '@gmail.com';
      if (string.indexOf(substring) !== -1) {
        return true
      }else{
        return false
      }
    }

  attemptFirebaseLogin=(token,secret)=>{
    const credential = {
      token:token,
      secret:secret,
      provider: 'google',
      providerId: 'google',
    };

    firebase.auth().signInWithCredential(credential)
      .then((user) => {

        AsyncStorage.setItem("is_logged_in", "1");
        firebase.database()
        .ref('User/'+user.uid)
        .update({
          id: user.uid,
          name: user.displayName
        });

        Actions.root()
      })
      .catch((err) => {

      });
  }

  render() {
    return (
      <View style = {{flex:1,alignItems:'center',backgroundColor:'white'}}>

        <Image
          style={{position:'absolute',top:0,left:0,right:0,bottom:0}}
          source={require('../images/samosa.png')}
          resizeMode={'contain'}
        />

        <Text style={{fontSize:45,fontWeight:'500',color:'#F8F8F8',fontFamily:'HelveticaNeue', top:200, backgroundColor:'transparent'}}>Samosa</Text>

        {this.state.isLoggedIn ?(
          null
        ):(
          <GoogleSigninButton
            ref={this.props.generateTestHook('Login.button')}
            style={{width: 280, height: 48, position:'absolute',bottom:80}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn.bind(this)}
          />
        )}

      </View>
    );
  }
}

const TestableScene = hook(Login);
export default TestableScene;
