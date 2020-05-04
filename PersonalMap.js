import React, { useState, useEffect } from "react";

import { StyleSheet, FlatList, View, AsyncStorage, Alert, Button } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import Firebase from "firebase";

export default function PersonalMap(props) {
    const { navigate } = props.navigation;
    const [title, setTitle] = useState([]);
    const [region, setRegion] = useState({
      latitude: null,
      longitude: null,
      latitudeDelta: 0.0322,
      longitudeDelta: 0.0221
  });
    const [regionArray, setRegionArray] = useState([]);
    const [location, setLocation] = useState("");
    const [locationArray, setLocationArray] = useState([]);

  useEffect(() => {
    Firebase.database()
      .ref("blogPostdb/")
      .on("value", snapshot => {
        const data = snapshot.val();
        const prods = Object.values(data);

        /*for (const [i, v] of prods.entries()) {
            //console.log("prods here ", prods[i].location)
            setLocation(prods[i].location);
            console.log("prods[i].location ", prods[i].location);
            var pol = [...pol, prods[i].location];
            setLocationArray(pol);
            console.log("pol", pol);
            
          }*/
          
        getData(prods);
       
       
      });
  }, []);
  const getData = (obj) => {
      for (const [i, v] of obj.entries()) {
    const url =
      "http://www.mapquestapi.com/geocoding/v1/address?key=XXBVccYSp03WjOpc82Wm5V16W4Deix9s&location=" +
      obj[i].location;
    fetch(url, { method: "GET" })
      .then(response => response.json())
      .then(responseJson => {
        const data = responseJson.results[0].locations[0];
        let p = {
            latitude: data.latLng.lat,
            longitude: data.latLng.lng,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0221
          }
          setRegion(p);

          var test = regionArray.push(p);
          setRegionArray(...test, test);
        setTitle(
          data.adminArea1 +
            " " +
            data.adminArea5 +
            " " +
            data.adminArea6 +
            " " +
            data.postalCode +
            " " +
            data.street
        );
      })
      .catch(error => {
        console.log("Error", error);
      });
    }
  };

  const regionA = () => {
      console.log("regionArray", regionArray);
      console.log("region", region);
  }




  
  console.log(" Important regionArray", regionArray);
  return (
    <View style={styles.container}>
      <View style={styles.mapStyle}>
        <MapView style={styles.mapCont} region={region} onRegionChange={getData}>

            {regionArray.map((marker) =>  (
          <Marker
              coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude
            }}
            //title={loc.title}
          />
          ))}
        </MapView>
      </View>
      <View>
        <Button title="SHOW" onPress={getData} />
        <Button title="TEST" onPress={regionA} />
      </View>
    </View>
  );



}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center"
    },
    mapCont: {
      position: "absolute",
      width: "100%",
      height: "100%"
    },
    mapStyle: {
      flex: 8,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center"
    }
  });