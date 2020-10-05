import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import HomeScreen from './screens/HomeScreen';
import Availability from './screens/Availability';

export default class App extends React.Component {
  render(){
  return (
    <AppContainer />
  );
  }

}

const TabNavigator = createBottomTabNavigator({
  HomeScreen: {screen:HomeScreen},
  Availability : {screen:Availability}
},
{
  defaultNavigationOptions: ({navigation})=>({
    tabBarIcon: ({})=>{
      const routeName = navigation.state.routeName
      if(routeName === 'HomeScreen'){
        return(
          <Image source = {require('./assets/book.png')} 
          style= {{width: 40, height: 40}} 
          />
        )
      } 
      else if(routeName === 'Availability'){
          return(
            <Image source = {require('./assets/searchingbook.png')} 
          style= {{width: 40, height: 40}} 
          />
          )
      }
    }
  })
}
)
const AppContainer = createAppContainer(TabNavigator);