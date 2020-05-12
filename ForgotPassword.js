import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import {
  ImageBackground,
  Button,
  Screen,
  TextInput,
  Text,
  Image,
} from "@shoutem/ui";
import { ScrollView } from "react-native-gesture-handler";
import Firebase from "firebase";

export default function ForgotPassword(props) {
  const [authError, setAuthError] = useState(null);
  const [email, setEmail] = useState("");
  const { navigate } = props.navigation;

  const passwordReset = () => {
    Firebase.auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        navigate("Login");
      })
      .catch((error) => {
        setAuthError(error);
      });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Screen>
        <ImageBackground
          style={styles.windowProp}
          source={{
            uri:
              "https://superstarblogging.nomadicmatt.com/wp-content/uploads/2018/11/makemoney1a.jpg",
          }}
        >
          <Image
            source={
              __DEV__
                ? require("./assets/images/logo.png")
                : require("./assets/images/logo.png")
            }
            style={styles.logo}
          />

          {authError && <Text style={{ color: "red" }}>{authError}</Text>}
          <TextInput
            style={styles.textInputs}
            placeholder="Enter an email"
            label="EMAIL"
            onChangeText={(email) => setEmail(email)}
            value={email}
          />

          <Button style={styles.button} onPress={passwordReset}>
            <Text style={styles.buttonText}>Reset</Text>
          </Button>
          <TouchableOpacity onPress={() => navigate("Login")}>
            <Text style={styles.signUpButton}>Back To Login</Text>
          </TouchableOpacity>
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
  logo: {
    width: 350,
    height: 280,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10,
  },
  signUpButton: {
    color: "#E5E5E5",
    alignItems: "flex-end",
    fontSize: 14,
    fontFamily: "Sansation",
  },
  windowProp: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  textInputs: {
    height: 55,
    width: 260,
    borderRadius: 30,
    borderColor: "#E5E5E5",
    borderWidth: 2,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#52E4C4",
    borderRadius: 27.5,
    height: 55,
    width: 200,
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
});
