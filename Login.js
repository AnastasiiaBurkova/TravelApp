import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Text, Button, Input } from "react-native-elements";
import {
  RectButton,
  ScrollView,
  TextInput,
} from "react-native-gesture-handler";
import Firebase from "firebase";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const { navigate } = props.navigation;

  const userLogin = () => {
    console.log("email", email);
    console.log("password,", password);
    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => navigate("Links"))
      .catch((error) => setAuthError(error.message));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
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
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Enter an email"
          label="EMAIL"
          onChangeText={(email) => setEmail(email)}
          value={email}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Enter a password"
          label="PASSWORD"
          onChangeText={(password) => setPassword(password)}
          value={password}
        />
      </View>
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={userLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigate("SignUp")}>
        <Text style={styles.loginText}>SignUp</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C3DBE3",
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
  inputView: {
    width: "80%",
    backgroundColor: "#E5DED4",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: "#ededed",
  },
  inputText: {
    height: 50,
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: "flex-start",
    marginTop: 1,
  },
  forgot: {
    color: "#354356",
    fontSize: 11,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#59606D",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  loginText: {
    color: "#354356",
  },
});
