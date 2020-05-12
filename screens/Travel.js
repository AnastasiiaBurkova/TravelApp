import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, FlatList, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Card, CardItem, Left, Right, DatePicker, Picker } from "native-base";
import { Icon } from "react-native-elements";
import getSymbolFromCurrency from "currency-symbol-map";
import {
  TextInput,
  Title,
  ImageBackground,
  Text,
  NavigationBar,
  Button,
  Screen,
  TouchableOpacity,
  View,
} from "@shoutem/ui";

export default function Travel(props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [currencyName, setCurrencyName] = useState("");
  const [currency, setCurrency] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [places, setPlaces] = useState([]);
  const [departure, setDeparture] = useState({});
  const [arrival, setArrival] = useState({});
  const [departureArline, setDepartureAirline] = useState({});
  const [departureBack, setDepartureBack] = useState({});
  const [arrivalBack, setArrivalBack] = useState({});
  const [returnAirline, setReturnAirline] = useState({});
  const [loading, setLoading] = useState(true);
  const [updateIsMade, setUpdate] = useState(false);
  const [displaySearchButton, setSearchButton] = useState(true);
  const [displayClearButton, setClearButton] = useState(false);

  useEffect(() => {
    getCurrencyData();
  }, []);

  getCurrencyData = () => {
    fetch(
      "http://data.fixer.io/api/latest?access_key=ff5f035ca46c832f5b94d5d58df5efe4"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setCurrency(Object.keys(responseJson.rates));
      })
      .catch((error) => {
        console.log("Error on fetching currency: ", error);
        Alert.alert("Error on fetching currency");
      });
  };

  const getFlights = () => {
    var url = null;
    var formattedDepartDate = departDate.toISOString().split("T")[0];
    if (returnDate !== null && returnDate !== "") {
      var formattedReturnDate = returnDate.toISOString().split("T")[0];
      url =
        "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/FI/" +
        currencyName +
        "/en-US/" +
        from +
        "/" +
        to +
        "/" +
        formattedDepartDate +
        "/" +
        formattedReturnDate;
    } else {
      url =
        "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/FI/" +
        currencyName +
        "/en-US/" +
        from +
        "/" +
        to +
        "/" +
        formattedDepartDate;
    }

    fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host":
          "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        "x-rapidapi-key": "e5275bb1e1msh36b5c1d2b90846ep1a749fjsn44be7b633117",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.Quotes == null || responseJson.Quotes == "") {
          Alert.alert("No flights found!");
          clearFlightsData();
        } else {
          setQuotes(Object.values(responseJson.Quotes));
          setPlaces(Object.values(responseJson.Places));
          setCarriers(Object.values(responseJson.Carriers));
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log("Error on fetching flights data", error);
        Alert.alert("Error on fetching flights data");
      });
  };

  const updateFlights = () => {
    getFlights();
    setUpdate(true);
    setSearchButton(false);
    setClearButton(true);
  };

  const clearFlightsData = () => {
    setFrom("");
    setTo("");
    setDepartDate("");
    setReturnDate("");
    setCurrencyName("");
    setCurrencyName("");
    setCarriers("");
    setQuotes("");
    setPlaces("");
    setDeparture({});
    setArrival({});
    setDepartureAirline({});
    setReturnAirline({});
    setDepartureBack({});
    setArrivalBack({});
    setLoading(true);
    setUpdate(false);
    setClearButton(false);
    setSearchButton(true);
  };

  const keyExtractor = (item) => {
    return item.QuoteId.toString();
    //return item;
  };

  const renderItem = ({ item }) => {
    var dDate = item.OutboundLeg.DepartureDate.split("T")[0];
    setDeparture(places.find((p) => p.PlaceId == item.OutboundLeg.OriginId));
    setArrival(places.find((p) => p.PlaceId == item.OutboundLeg.DestinationId));
    setDepartureAirline(
      carriers.find((c) => c.CarrierId == item.OutboundLeg.CarrierIds[0])
    );

    if (item.InboundLeg) {
      var rDate = item.InboundLeg.DepartureDate.split("T")[0];
      setDepartureBack(
        places.find((p) => p.PlaceId == item.InboundLeg.OriginId)
      );
      setArrivalBack(
        places.find((p) => p.PlaceId == item.InboundLeg.DestinationId)
      );
      setReturnAirline(
        carriers.find((c) => c.CarrierId == item.InboundLeg.CarrierIds[0])
      );
    }

    return (
      <TouchableOpacity>
        <Card>
          <CardItem>
            <Button styleName="clear"></Button>
          </CardItem>
          <Left>
            <CardItem>
              <Icon name="flight-takeoff" size={30} />
              <Text>
                {departure.CityName} - {arrival.CityName} (
                {departureArline.Name}){"\n"} {dDate}
              </Text>
            </CardItem>
            {returnDate ? (
              <View>
                <CardItem>
                  <Icon name="flight-land" size={30} />
                  <Text>
                    {departureBack.CityName} - {arrivalBack.CityName} (
                    {returnAirline.Name}){"\n"} {rDate}
                  </Text>
                </CardItem>
              </View>
            ) : null}
          </Left>
          <CardItem>
            <Right>
              <Text>
                {item.MinPrice} {getSymbolFromCurrency(currencyName)}
              </Text>
            </Right>
          </CardItem>
        </Card>
      </TouchableOpacity>
    );
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
            displayClearButton ? (
              <Button onPress={clearFlightsData}>
                <Title style={styles.cancelButton}>Cancel</Title>
              </Button>
            ) : null
          }
          centerComponent={<Title style={styles.header}>Travel</Title>}
          rightComponent={
            <Picker
              placeholder="Currency"
              placeholderStyle={{
                fontFamily: "Sansation",
                fontSize: 13,
                color: "#286759",
              }}
              selectedValue={currencyName}
              onValueChange={(currencyName) => setCurrencyName(currencyName)}
            >
              {currency.map((item, key) => {
                return <Picker.Item value={item} label={item} key={key} />;
              })}
            </Picker>
          }
        />
        <ImageBackground
          style={styles.windowProp}
          source={{
            uri:
              "https://superstarblogging.nomadicmatt.com/wp-content/uploads/2018/11/makemoney1a.jpg",
          }}
        >
          {displaySearchButton ? (
            <View style={{ marginTop: -380 }}>
              <Title style={styles.mainText}>
                Enjoy your travel experince and find new inspirations by
                discovering best routes to your favourite destinations!
              </Title>
              <View>
                <Text style={styles.inputTitles}>Departure</Text>
                <TextInput
                  style={styles.textInputs}
                  placeholder="Country, city or airport"
                  label="From"
                  onChangeText={(from) => setFrom(from)}
                  value={from}
                />
                <Text style={styles.inputTitles}>Arrival</Text>
                <TextInput
                  style={styles.textInputs}
                  placeholder="Country, city or airport"
                  label="To"
                  onChangeText={(to) => setTo(to)}
                  value={to}
                />
                <View styleName="horizontal">
                  <DatePicker
                    defaultDate={new Date()}
                    minimumDate={new Date()}
                    locale={"en"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    placeHolderText="Depart date"
                    placeHolderTextStyle={styles.pickerTitles}
                    onDateChange={(departDate) => setDepartDate(departDate)}
                    disabled={false}
                  />
                  <DatePicker
                    defaultDate={new Date()}
                    minimumDate={new Date()}
                    locale={"en"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    placeHolderText="Return date"
                    placeHolderTextStyle={styles.pickerTitles}
                    onDateChange={(returnDate) => setReturnDate(returnDate)}
                    disabled={false}
                  />
                </View>

                <Button style={styles.button} onPress={updateFlights}>
                  <Title style={styles.buttonText}>Search</Title>
                </Button>
              </View>
            </View>
          ) : null}

          {!loading && updateIsMade ? (
            <FlatList
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              data={quotes}
            />
          ) : null}
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
    fontSize: 22,
    color: "#286759",
  },
  mainText: {
    marginBottom: 15,
    fontFamily: "Sansation",
    color: "#FFFFFF",
    fontSize: 19,
  },
  textInputs: {
    height: 55,
    borderRadius: 30,
    borderColor: "#E5E5E5",
    borderWidth: 2,
    marginBottom: 8,
  },
  inputTitles: {
    fontFamily: "Sansation",
    fontSize: 18,
    color: "#286759",
    marginTop: 8,
  },
  pickerTitles: {
    fontFamily: "Sansation",
    fontSize: 15,
    color: "#286759",
  },
  button: {
    backgroundColor: "#52E4C4",
    borderRadius: 27.5,
    height: 55,
    width: 253,
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
