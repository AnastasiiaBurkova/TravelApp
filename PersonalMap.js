import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Icon } from "react-native-elements";
import { Screen, Button, Text, NavigationBar, Title } from "@shoutem/ui";
import Firebase from "firebase";

export default function PersonalMap(props) {
  const { navigate } = props.navigation;
  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  });
  const [regionArray, setRegionArray] = useState([]);
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    const userID = Firebase.auth().currentUser.uid.toString();
    Firebase.database()
      .ref("blogPostdb/" + userID + "/")
      .on("value", (snapshot) => {
        const data = snapshot.val();
        if (data == null) {
          return null;
        }
        const prods = Object.values(data);

        if (prods != null) {
          setPostList(prods);
        }

        getData(prods);
      });
  }, []);
  const getData = (obj) => {
    for (const [i, v] of obj.entries()) {
      const url =
        "http://www.mapquestapi.com/geocoding/v1/address?key=XXBVccYSp03WjOpc82Wm5V16W4Deix9s&location=" +
        obj[i].location;
      fetch(url, { method: "GET" })
        .then((response) => response.json())
        .then((responseJson) => {
          const data = responseJson.results[0].locations[0];
          let r = {
            latitude: data.latLng.lat,
            longitude: data.latLng.lng,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0221,
            title:
              data.adminArea1 +
              " " +
              data.adminArea5 +
              " " +
              data.adminArea6 +
              " " +
              data.postalCode +
              " " +
              data.street,
          };
          setRegion({
            latitude: data.latLng.lat,
            longitude: data.latLng.lng,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0221,
          });
          var test = regionArray.push(r);
          setRegionArray(...test, test);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const showOnMap = () => {
    getData(postList);
  };

  return (
    <Screen>
      <NavigationBar
        styleName="inline"
        leftComponent={
          <Button onPress={() => navigate("Links")}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </Button>
        }
        centerComponent={<Title style={styles.header}>Map</Title>}
        rightComponent={
          <Button onPress={showOnMap}>
            <Icon name="refresh" />
          </Button>
        }
      />
      <View style={styles.mapStyle}>
        <MapView style={styles.mapCont} region={region}>
          {regionArray.map((marker) => (
            <Marker
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
            />
          ))}
        </MapView>
      </View>
      <View>
        <Button style={styles.button} onPress={showOnMap}>
          <Text style={styles.buttonText}>Where was I?</Text>
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapCont: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  mapStyle: {
    flex: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontFamily: "Sansation",
    fontSize: 22,
    color: "#286759",
  },
  button: {
    backgroundColor: "#52E4C4",
    borderRadius: 10,
    borderColor: "#52E4C4",
    fontFamily: "Sansation",
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
