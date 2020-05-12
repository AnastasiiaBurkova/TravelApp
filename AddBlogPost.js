import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Dimensions } from "react-native";
import {
  ImageBackground,
  Title,
  Button,
  Screen,
  NavigationBar,
  TextInput,
  Text,
  Image,
} from "@shoutem/ui";
import { ScrollView } from "react-native-gesture-handler";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Firebase from "firebase";
import "firebase/storage";
import uuid from "react-native-uuid";

const firebaseConfig = {
  apiKey: "AIzaSyBiEWAAHHyfQcimt-ivSA3gEnAUzmFuEH0",
  authDomain: "travelapp-272619.firebaseapp.com",
  databaseURL: "https://travelapp-272619.firebaseio.com",
  projectId: "travelapp-272619",
  storageBucket: "travelapp-272619.appspot.com",
  messagingSenderId: "993946094520",
  appId: "1:993946094520:web:81f9458ec2ef6d23dcdd4d",
  measurementId: "G-CFBDFQ4NFZ",
};

const db = Firebase.initializeApp(firebaseConfig);

export default function AddBlogPost(props) {
  const [itemId, setItemId] = useState(uuid.v4());
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [displayImage, setDisplayImage] = useState(false);
  const [displayAddButton, setDisplayAddButton] = useState(true);
  const [imageId, setImageId] = useState("");
  const { navigate } = props.navigation;

  const saveItem = () => {
    if (imageId !== null && imageId !== "") {
      const userID = Firebase.auth().currentUser.uid.toString();
      db.database()
        .ref("blogPostdb/" + userID + "/")
        .push({
          id: itemId,
          imageId: imageId,
          title: title,
          location: location,
          country: country,
          description: description,
          imageUri: imageUri,
        });
      navigate("Links");
    } else {
      Alert.alert("Please upload an image");
    }
  };

  useEffect(() => {
    getPermissionAsync();
  }, []);

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
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
        setImageUri(await readData(result.uri));
        setDisplayAddButton(false);
        setDisplayImage(true);
      }
    } catch (error) {
      console.log("Error on picking the image: ", error);
      Alert.alert("Error on picking the image.");
    }
  };

  const readData = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    let specialID = uuid.v4();
    setImageId(specialID);

    const ref = Firebase.storage().ref().child(specialID);
    const snapshot = await ref.put(blob);
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  const deleteImage = () => {
    try {
      var ref = Firebase.storage().ref().child(imageId);
      ref.delete();
      setDisplayImage(false);
      setDisplayAddButton(true);
    } catch (error) {
      console.log("Error on deleting an image: ", error);
      Alert.alert("Error on deleting an image.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Screen>
        <NavigationBar
          styleName="inline"
          leftComponent={
            <Button onPress={() => navigate("Links")}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </Button>
          }
          centerComponent={<Title style={styles.header}>New Post</Title>}
          rightComponent={
            <Button onPress={saveItem}>
              <Text style={styles.cancelButton}>Save</Text>
            </Button>
          }
        />
        <ImageBackground
          style={styles.windowProp}
          source={{
            uri:
              "https://superstarblogging.nomadicmatt.com/wp-content/uploads/2018/11/makemoney1a.jpg",
          }}
        >
          <View style={styles.windowProp}>
            <View>
              <Text style={styles.inputTitles}>Title</Text>
              <TextInput
                style={styles.textInputs}
                placeholder="Enter a title"
                label="TITLE"
                autoCorrect
                onChangeText={(title) => setTitle(title)}
                value={title}
              />
              <Text style={styles.inputTitles}>Location</Text>
              <TextInput
                style={styles.textInputs}
                placeholder="Enter a street or a city"
                label="LOCATION"
                autoCorrect
                onChangeText={(location) => setLocation(location)}
                value={location}
              />
              <Text style={styles.inputTitles}>Country</Text>
              <TextInput
                style={styles.textInputs}
                placeholder="Enter a country"
                label="COUNTRY"
                autoCorrect
                onChangeText={(country) => setCountry(country)}
                value={country}
              />
              <Text style={styles.inputTitles}>Description</Text>
              <TextInput
                style={styles.textAreaStyle}
                placeholder="Enter a description"
                label="DESCRIPTION"
                autoCorrect
                onChangeText={(description) => setDescription(description)}
                value={description}
                multiline
                numberOfLines={60}
              />
            </View>
            {displayAddButton ? (
              <Button style={styles.button} onPress={_pickImage}>
                <Text style={styles.buttonText}>Add image</Text>
              </Button>
            ) : null}
            {displayImage ? (
              <View>
                <Button style={styles.button} onPress={deleteImage}>
                  <Text style={styles.buttonText}>Delete Image</Text>
                </Button>
                <Image
                  source={{ uri: imageUri }}
                  styleName="medium"
                  style={{ marginTop: 8, alignSelf: "center" }}
                />
              </View>
            ) : null}
          </View>
        </ImageBackground>
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E5E5",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  windowProp: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  header: {
    fontFamily: "Sansation",
    fontSize: 22,
    color: "#286759",
  },
  textInputs: {
    height: 55,
    borderRadius: 30,
    borderColor: "#E5E5E5",
    borderWidth: 2,
    marginBottom: 8,
  },
  textAreaStyle: {
    borderRadius: 30,
    borderColor: "#E5E5E5",
    borderWidth: 2,
    marginBottom: 8,
    height: 150,
  },
  inputTitles: {
    fontFamily: "Sansation",
    fontSize: 18,
    color: "#286759",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#52E4C4",
    borderRadius: 27.5,
    height: 55,
    width: 253,
    borderColor: "#52E4C4",
    fontFamily: "Sansation",
    alignSelf: "center",
  },
  buttonText: {
    color: "#286759",
    alignItems: "flex-end",
    fontSize: 14,
    fontFamily: "Sansation",
  },
  cancelButton: {
    fontSize: 16,
    fontFamily: "Sansation",
  },
});
