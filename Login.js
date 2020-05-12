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

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const { navigate } = props.navigation;

  const userLogin = () => {
    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        var u = Firebase.auth().currentUser;
        if (u.emailVerified === false) {
          setAuthError("Email is not verified!");
        } else {
          console.log("Email is verified");
          navigate("Root");
        }
      })
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
          <TouchableOpacity onPress={() => navigate("ForgotPassword")}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
          <Button style={styles.button} onPress={userLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Button>

          <TouchableOpacity onPress={() => navigate("SignUp")}>
            <Text style={styles.signUpButton}>SignUp</Text>
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
  forgot: {
    color: "#E5E5E5",
    alignItems: "flex-end",
    fontSize: 11,
    fontFamily: "Sansation",
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
