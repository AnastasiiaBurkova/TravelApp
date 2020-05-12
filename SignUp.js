import React, { useState, useEffect } from "react";
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

export default function SignUp(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const { navigate } = props.navigation;

  const signUpUser = () => {
    Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => navigate("Links"))
      .catch((error) => setAuthError(error.message));
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
          <TextInput
            style={styles.textInputs}
            placeholder="Enter a password"
            label="PASSWORD"
            onChangeText={(password) => setPassword(password)}
            value={password}
            secureTextEntry
          />
          <Button style={styles.button} onPress={signUpUser}>
            <Text style={styles.buttonText}>SignUp</Text>
          </Button>

          <TouchableOpacity onPress={() => navigate("Login")}>
            <Text style={styles.alreadyAccount}>
              Already have an account? Login
            </Text>
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
  alreadyAccount: {
    color: "#E5E5E5",
    alignItems: "flex-end",
    fontSize: 13,
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
