import React, { useState, useEffect, AsyncStorage } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Firebase from "firebase";

export default function Load(props) {
    const { navigate } = props.navigation;

    useEffect(() => {
        Firebase.auth().onAuthStateChanged(user => {
          //console.log("IMPORTAnT usser", user);

        navigate(user ? 'Root' : 'Login');
           // navigate('Root', { test: user })

        })
     }, []);




     return (
        <View style={styles.container}>
          <Text>Loading</Text>
          <ActivityIndicator size="large" />
        </View>
      )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fafafa',
    },
  });