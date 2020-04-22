import React, { useState, useEffect, Component } from "react";
import { StyleSheet, View, Image, Alert } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImagePicker  from 'expo-image-picker';
import Firebase from "firebase";
import 'firebase/storage';
import uuid from 'react-native-uuid';



const firebaseConfig = {
    apiKey: "AIzaSyBiEWAAHHyfQcimt-ivSA3gEnAUzmFuEH0",
    authDomain: "travelapp-272619.firebaseapp.com",
    databaseURL: "https://travelapp-272619.firebaseio.com",
    projectId: "travelapp-272619",
    storageBucket: "travelapp-272619.appspot.com",
    messagingSenderId: "993946094520",
    appId: "1:993946094520:web:81f9458ec2ef6d23dcdd4d",
    measurementId: "G-CFBDFQ4NFZ"
  };

const db = Firebase.initializeApp(firebaseConfig);



export default function AddBlogPost(props) {
const [itemId, setItemId] = useState(uuid.v4());
const [title, setTitle] = useState("");
const [location, setLocation] = useState("");
const [description, setDescription] = useState("");
const [imageUri, setImageUri] = useState("");
const [displayImage, setDisplayImage] = useState(false);
const [displayAddButton, setDisplayAddButton] = useState(true);
const [imageId, setImageId] = useState("");
//const [pushKey, setPushKey] = useState("");
const { navigate } = props.navigation;

//const { params } = props.navigation.state;

const saveItem = () => {
    
    if (imageId!==null && imageId!=="") {
        console.log("ID" + imageId);

    //var push = 
    db.database()
      .ref("blogPostdb/")
      .push({ id: itemId, title: title, location: location, description: description, imageUri: imageUri });
       //setPushKey(push.key);
       navigate('Links');
    }
    else {
        Alert.alert("Please upload an image");
    }
  };
  
 

  useEffect(() => {
    getPermissionAsync();
}, []);

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  const _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
          console.log("result", result.uri);
          setImageUri(await readData(result.uri));
          setDisplayAddButton(false);
          setDisplayImage(true);
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  const readData = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function(e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      let specialID = uuid.v4();
      console.log("specialID" , specialID);
      setImageId(specialID);
    
      const ref = Firebase
        .storage()
        .ref()
        .child(specialID);
      const snapshot = await ref.put(blob);
    
      // We're done with the blob, close and release it
      blob.close();
    
      return await snapshot.ref.getDownloadURL();
    }

    const deleteImage = () => {
        console.log("id" , imageId);

        try {
        var ref = Firebase.storage().ref().child(imageId);
          ref.delete();
          console.log("Deleted successfully");
          setDisplayImage(false);
          setDisplayAddButton(true);
        }     
          catch(error) {
              console.log(error);
          }
  // Uh-oh, an error occurred!
};
    

return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View>
        <Input
          placeholder="Enter a title"
          label="TITLE"
          autoCorrect
          onChangeText={title => setTitle(title)}
          value={title}
        />
        <Input
        placeholder="Enter location"
        label="LOCATION"
        autoCorrect
        onChangeText={location => setLocation(location)}
        value={location}
        />
        <Input
        placeholder="Enter a description"
        label="DESCRIPTION"
        autoCorrect
        onChangeText={description => setDescription(description)}
        value={description}
        />
        {displayAddButton ? (
        <Button title="Add image" onPress={_pickImage} />
        ) : null}
        {displayImage ? (
            <View>
        <Image
              style={{ width: 50, height: 50 }}
              source={{ uri: imageUri }}
            />
        <Button title="Delete Image" onPress={deleteImage} />    
        </View>
            ) : null}
        <Button title="SAVE" onPress={saveItem } />
      </View>
    </ScrollView>
  );

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fafafa',
    },
    contentContainer: {
      paddingTop: 15,
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
  });