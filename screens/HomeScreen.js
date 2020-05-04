import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, View, AsyncStorage } from 'react-native';
import { Text, Button, Card } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView, TextInput } from 'react-native-gesture-handler';
import Firebase from "firebase";
import Load from "../Load";


export default function HomeScreen(props) {
const [postList, setPostList] = useState([]);
const { navigate } = props.navigation;



useEffect(() => {
  Firebase.database()
    .ref("blogPostdb/")
    .on("value", snapshot => {
      console.log("SNAPSHOT", snapshot);
      const data = snapshot.val();
     
      console.log("data", data);
      const prods = Object.values(data);
   
      console.log("prods in home" + prods);

      

  

        if (prods!=null) {
      setPostList(prods);
    }

    });
}, []);





const keyExtractor = item => {
  console.log("YTEM", item.id);
  return item;
};

const renderItem = ({ item }) => (


<Card
  title={item.title}
  image={{ uri: item.imageUri }}>
  <Text style={{marginBottom: 10}}>
  {item.description}
  </Text>
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
