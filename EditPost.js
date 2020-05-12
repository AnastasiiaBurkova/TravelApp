import React, { useState } from "react";
import { StyleSheet, Dimensions, Alert } from "react-native";
import {
  ImageBackground,
  Title,
  TextInput,
  Screen,
  NavigationBar,
  Button,
  Text,
  View,
} from "@shoutem/ui";
import { ScrollView } from "react-native-gesture-handler";
import Firebase from "firebase";

export default function EditPost(props) {
  const { navigate } = props.navigation;
  const { item } = props.route.params;
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);

  const updateSingleData = () => {
    const userID = Firebase.auth().currentUser.uid.toString();
    try {
      Firebase.database()
        .ref("blogPostdb/" + userID + "/" + item.key)
        .update({
          title: title,
          description: description,
        });
      navigate("Links");
    } catch (error) {
      console.log("Error on updating the data", error);
      Alert.alert("Error on updating the data.");
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
          centerComponent={<Title style={styles.header}>Update Post</Title>}
        />

        <ImageBackground
          style={styles.windowProp}
          source={{
            uri:
              "https://superstarblogging.nomadicmatt.com/wp-content/uploads/2018/11/makemoney1a.jpg",
          }}
        >
          <View style={{ marginTop: -480 }}>
            <Text style={styles.inputTitles}>Title</Text>
            <TextInput
              style={styles.textInputs}
              placeholder="Enter a title"
              autoCorrect
              onChangeText={(title) => setTitle(title)}
              value={title}
            />
            <Text style={styles.inputTitles}>Description</Text>
            <TextInput
              style={styles.textAreaStyle}
              placeholder="Enter a description"
              autoCorrect
              onChangeText={(description) => setDescription(description)}
              value={description}
              multiline
              numberOfLines={60}
            />
            <Button style={styles.button} onPress={updateSingleData}>
              <Text style={styles.buttonText}>Save</Text>
            </Button>
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
    fontSize: 20,
    color: "#286759",
  },
  textInputs: {
    height: 55,
    width: Dimensions.get("window").width,
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
