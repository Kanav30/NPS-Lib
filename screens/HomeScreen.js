import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, Alert, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import firebase from 'firebase';
import db from '../config';

export default class HomeScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scannedData: '',
      buttonState: 'normal',
      scanBookID: '',
      scanStudentID: '',
      transactionMessage: '' 
    }
  }
  getCameraPermissions = async(id)=>{
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermissions: status === "granted", 
    buttonState: id,
    scanned: false
  })
  }
  handleBarCodeScan = async({type,data})=>{
   const {buttonState} = this.state
   if(buttonState === "BookID"){
    this.setState({scanned: true, scanBookID: data, buttonState: 'normal'})
   }
   else  if(buttonState === "StudentID"){
    this.setState({scanned: true, scanStudentID: data, buttonState: 'normal'})
   }
  }

initiateBookIssue = async()=>{
  //adding transactions
  db.collection("transactions").add({
    'studentID' : this.state.scanStudentID,
    'bookId' : this.state.scanBookID,
   //'date' : firebase.firestore.Timestamp.now().toDate(),
   'transactionType' : "Issue" 
  })
  db.collection("books").doc(this.state.scanBookID).update({
    'availability' : false
  })
  db.collection("students").doc(this.state.scanStudentID).update({
    'booksIssued' : firebase.firestore.FieldValue.increment(1)
  })
  Alert.alert("Book Issued")
  this.setState({
    scanBookID: '',
    scanStudentID: ''
  })
}

initiateBookReturn = async()=>{
  //adding transactions
  db.collection("transactions").add({
    'studentID' : this.state.scanStudentID,
    'bookId' : this.state.scanBookID,
   //'date' : firebase.firestore.Timestamp.now().toDate(),
   'transactionType' : "Return" 
  })
  db.collection("books").doc(this.state.scanBookID).update({
    'availability' : true
  })
  db.collection("students").doc(this.state.scanStudentID).update({
    'booksIssued' : firebase.firestore.FieldValue.increment(-1)
  })
  Alert.alert("Book Returned")
  this.setState({
    scanBookID: '',
    scanStudentID: ''
  })
}

handleTransaction = async()=>{
  var transactionMessage = null
  db.collection("books").doc(this.state.scanBookID).get()
  .then((doc)=>{
  //console.log(doc.data())
  var book = doc.data()
  if(book.availability){
    this.initiateBookIssue()
    transactionMessage = "bookIssued"
    ToastAndroid.show(transactionMessage, ToastAndroid.SHORT)
  }
  else{
    this.initiateBookReturn()
    transactionMessage = "BookReturned"
    ToastAndroid.show(transactionMessage, ToastAndroid.SHORT)
  }
})
this.setState({transactionMessage : transactionMessage})
}

  render(){
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;
    if(buttonState !== 'normal' && hasCameraPermissions){
      return(
        <BarCodeScanner 
        onBarCodeScanned = {scanned ? undefined : this.handleBarCodeScan}
        style={StyleSheet.absoluteFillObject}
        />
      )
    }
    else if(buttonState === 'normal'){
   return (
    <KeyboardAvoidingView behavior = "padding" enabled>
    <View>
      <Image source={require("../assets/booklogo.jpg")} />
      <Text
      style={styles.text1}>
       NPS School Library
      </Text>
    
    <TextInput
    style = {styles.input1}
    placeholder = 'BookID'
    value = {this.state.scanBookID}
    onChangeText = {text =>
      this.setState({
        scanBookID: text
      })}

    ></TextInput>
  
    <TouchableOpacity
    style={styles.button}
    onPress={()=>{
      this.getCameraPermissions("BookID")
    }}
    >
      <Text
      style={styles.buttonText}
      >Scan</Text>
    </TouchableOpacity>

    <View>
    <TextInput
    style={styles.input1}
    placeholder='Student ID'
    value={this.state.scanStudentID}
    onChangeText = {text =>
      this.setState({
        scanStudentID: text
      })}
    ></TextInput>
    <TouchableOpacity
    style={styles.button}
    onPress={()=>{
      this.getCameraPermissions("StudentID")
    }}
    >
      <Text
      style={styles.buttonText}
      >Scan</Text>
    </TouchableOpacity>

    <TouchableOpacity
    style = {{height: 30, backgroundColor: '#d70b77'}}
    onPress= {async()=>{
      this.handleTransaction()
      this.setState({
        scanBookID: '',
        scanStudentID: ''
      })
    }}
    >
      <Text
      style = {styles.buttonText}>
        Submit</Text>
    </TouchableOpacity>
    </View>
    <Text>
{hasCameraPermissions === true
? this.state.scannedData
: "requestCameraPermissions"
}
</Text>
  
</View>
</KeyboardAvoidingView>
  );
  }
  }
}

const styles = StyleSheet.create({
 text1:{
   justifyContent: 'center',
   alignItems: 'center',
   textAlign: 'center',
   fontSize: 30
},
button:{
  justifyContent : 'center',
  marginLeft: 250,
  marginTop: -25,
  backgroundColor: "#224fd1",
  width: 70,
  height: 30
},
buttonText:{
  color: 'white',
  fontSize: 20,
  textAlign: 'center'
},
input1:{
  width: 200,
  height:30,
  fontSize: 25,
  fontFamily: 'Roboto',
  borderWidth: 1,
  marginLeft: 40
}
});
