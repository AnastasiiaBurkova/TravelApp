import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, Alert } from "react-native";
import { Icon } from "react-native-elements";
import Swipeout from "react-native-swipeout";
import {
  ImageBackground,
  Title,
  Subtitle,
  Tile,
  Divider,
  Screen,
  NavigationBar,
  Button,
} from "@shoutem/ui";
import { TouchableOpacity } from "react-native-gesture-handler";
import Firebase from "firebase";

export default function LinksScreen(props) {
  const [postList, setPostList] = useState([]);
  const [userID, setUserID] = useState("");
  const { navigate } = props.navigation;

  useEffect(() => {
    const userID = Firebase.auth().currentUser.uid.toString();
    setUserID(userID);
    Firebase.database()
      .ref("blogPostdb/" + userID + "/")
      .on("value", (snapshot) => {
        const data = snapshot.val();
        const prods = Object.values(data);
        const keyArray = Object.keys(data);

        for (const [i, v] of prods.entries()) {
          prods[i].key = keyArray[i];
        }
        if (prods != null) {
          setPostList(prods);
        }
      });
  }, []);

  const deleteItem = (item) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        { text: "No", onPress: () => console.log("No is Pressed") },
        {
          text: "Yes",
          onPress: () => {
            try {
              Firebase.database()
                .ref("blogPostdb/" + userID + "/" + item.key)
                .remove();
              Firebase.storage().ref().child(item.imageId).delete();
            } catch (error) {
              console.log("Error deleting item from database", error);
              Alert.alert("Error on deleting item");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const signOutUser = async () => {
    try {
      await Firebase.auth().signOut();
      navigate("Login");
    } catch (error) {
      console.log("Sign user out error", error);
      Alert.alert("Couldn't sign out the user");
    }
  };

  const keyExtractor = (item) => {
    return item.id.toString();
  };

  const renderRow = ({ item }) => {
    if (!item) {
      return null;
    }

    let swipe = [
      {
        text: "Edit",
        color: "#286759",
        backgroundColor: "#52E4C4",
        onPress: () => navigate("EditPost", { item, item }),
      },
    ];

    return (
      <Swipeout right={swipe} autoClose={true} backgroundColor="transparent">
        <TouchableOpacity
          onLongPress={() => deleteItem(item)}
          onPress={() => navigate("SinglePost", { item: item })}
        >
          <ImageBackground
            styleName="large-banner"
            source={{ uri: item.imageUri }}
          >
            <Tile>
              <Title styleName="md-gutter-bottom">{item.title}</Title>
              <Subtitle styleName="sm-gutter-horizontal">
                {item.location}
              </Subtitle>
            </Tile>
          </ImageBackground>
          <Divider styleName="line" />
        </TouchableOpacity>
      </Swipeout>
    );
  };

  return (
    <Screen>
      <NavigationBar
        styleName="inline"
        leftComponent={
          <Button onPress={() => navigate("AddBlogPost")}>
            <Icon name="add-circle-outline" />
          </Button>
        }
        centerComponent={<Title style={styles.header}>BloGs</Title>}
        rightComponent={
          <Button onPress={signOutUser}>
            <Icon name="exit-to-app" />
          </Button>
        }
      />
      <FlatList
        keyExtractor={keyExtractor}
        data={postList}
        renderItem={renderRow}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    fontFamily: "Sansation",
    fontSize: 22,
    color: "#286759",
  },
});
