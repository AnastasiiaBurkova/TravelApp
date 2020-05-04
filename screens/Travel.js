import React, { useState, useEffect, Component } from "react";
import { StyleSheet, View, Image, Alert, Button, DatePickerIOS, FlatList, Text } from 'react-native';
import { RectButton, ScrollView, TextInput } from 'react-native-gesture-handler';
import { Card } from "react-native-elements";

export default function Travel(props) {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [startDate, setStartDate] = useState("");
    //const [endDate, setEndDate] = useState("");
    const [carriers, setCarriers] = useState([]);
    const [quotes, setQuotes] = useState([]);
    const [places, setPlaces] = useState([]);
    
    const { navigate } = props.navigation;


const getFlights = () => {
    const url = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/" +
    from + "/" + to + "/" + startDate;
    fetch(url, { method: "GET", headers: 
    {"x-rapidapi-host" : "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com", 
     "x-rapidapi-key" : "e5275bb1e1msh36b5c1d2b90846ep1a749fjsn44be7b633117"} })
      .then(response => response.json())
      .then(responseJson => {
       //console.log("Quotes ", Object.values(responseJson.Quotes));
       //console.log("Places ", Object.values(responseJson.Places));
       console.log("Carriers ", Object.values(responseJson.Carriers));
       setQuotes(Object.values(responseJson.Quotes));
       setPlaces(Object.values(responseJson.Places));
       setCarriers(Object.values(responseJson.Carriers));

    

       





      }).catch(error => {
        console.log("Error", error);
      });
 
}

const updateFlights = () => {
    getFlights();
    <Card></Card>
}

const keyExtractor = item => {
    getFlights();
    //console.log("item.OutboundLeg.OriginId",item.OutboundLeg.OriginId);
    //console.log("places.PlaceId", places);
    var depart = places.find(p => 
        p.PlaceId == item.OutboundLeg.OriginId);
    var destination = places.find(p => 
            p.PlaceId == item.OutboundLeg.DestinationId);
            
    //var departAirline = carriers.find(c => c.CarrierId == item.OutboundLeg.CarrierIds[0]);  
    //var returnAirline = carriers.find(c => c.CarrierId == item.InboundLeg.CarrierIds[0]); 
  
 
    //console.log("departAirline ",departAirline)  
    //console.log("departAirline NAME ",departAirline)  
    
    //console.log("returnAirline ",returnAirline.Name)    

    //console.log("depart "+ depart);
    //console.log("destination "+ destination);
    //console.log("item.QuoteId", item);
    return item.QuoteId.toString();
  };


  
  const renderItem = ({ item }) => (
  
  
  <Card>

<Text style={{marginBottom: 10}}>
  Direct: {item.Direct}
  </Text>
  <Text style={{marginBottom: 10}}>
  {item.Direct}
  </Text>
    
  </Card>
  
  );

return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
  
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Country, city or airport"
          label="From"
          onChangeText={(from) => setFrom(from)}
          value={from}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Country, city or airport"
          label="To"
          onChangeText={(to) => setTo(to)}
          value={to}
        />
        </View>
        <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Start date"
          label="Start date "
          onChangeText={(startDate) => setStartDate(startDate)}
          value={startDate}
        />
      </View>

 
    <Button title="Search" onPress={updateFlights} />

    <FlatList contentContainerStyle={{
            flexDirection:'row',
            flexWrap:'wrap',
            alignContent: 'stretch',
            flex: 0.5
          }}
            style={{ marginTop: 10 }}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            data={quotes}
          />

    
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
      marginTop: 20,
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
      height: 50
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