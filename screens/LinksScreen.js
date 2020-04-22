import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, View } from 'react-native';
import { Text, Button, Card } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView, TextInput } from 'react-native-gesture-handler';
import Firebase from "firebase";
import Load from "../Load";


export default function LinksScreen(props) {
const [postList, setPostList] = useState([]);
//const [user, setUser] = useState({});
const { navigate } = props.navigation;


useEffect(() => {

//console.log("PROPS", props);
 // console.log("USER GET", params);
//setUser(Firebase.auth().currentUser);


  Firebase.database()
    .ref("blogPostdb/")
    .on("value", snapshot => {
      const data = snapshot.val();
      const prods = Object.values(data);
      console.log("prods", prods);
      setPostList(prods);
    });
}, []);

const getUser = async () => {
  const user = Firebase.auth().currentUser;
 return user;
}




const signOutUser = async () => {
  try {
      await Firebase.auth().signOut();
      navigate('Login');
  } catch (e) {
      console.log(e);
  }
}

const deleteItem = (id) => {

 //console.log("KEY",  Firebase.database().ref("blogPostdb/").key)
     // var list = Firebase.database().ref("blogPostdb/").orderByValue();
      //console.log("list", list);
      console.log("delete isn't working");

  }

const keyExtractor = item => {
  return item.id.toString();
};

const renderItem = ({ item }) => (


<Card
  
  title={item.title}
  image={{ uri: item.imageUri }}>
  <Text style={{marginBottom: 10}}>
  {item.description}
  </Text>
  <Button
    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
    onPress={() => deleteItem(item.id)}
    title='Delete' />
</Card>

);



  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      
    
          <FlatList contentContainerStyle={{
            flexDirection:'row',
            flexWrap:'wrap',
            alignContent: 'stretch',
            flex: 0.5
          }}
            style={{ marginTop: 10 }}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            data={postList}
          />
        
     
        <View>
        <Button title="Logout" onPress={signOutUser} />
        <Button onPress={() => navigate('AddBlogPost' )} title="Add POST"/>
        </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: "#C3DBE3",
  },
  contentContainer: {
    //flexGrow: 1,
    //justifyContent: "center",
    //alignItems: "center",
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  listcontainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center"
  },
});
