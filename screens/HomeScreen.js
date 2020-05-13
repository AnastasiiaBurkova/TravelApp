import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, View, Dimensions } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { Title, Card, Subtitle, Screen, NavigationBar, Text, TouchableOpacity, GridRow, Image, Caption } from '@shoutem/ui';
import Firebase from "firebase";


export default function HomeScreen(props) {
const [withFlag, setWithFlag] = useState(true);
const [countryCode, setCountryCode] = useState('');
const [country, setCountry] = useState(null);
const [withCountryNameButton, setWithCountryNameButton] = useState(false);
const [withCloseButton, setWithCloseButton] = useState(false);
const [withFilter, setWithFilter] = useState(true);
const [postList, setPostList] = useState([]);
const [selectedPostList, setSelectedPostList] = useState([]);
const { navigate } = props.navigation;



useEffect(() => {

Firebase.database()
  .ref("blogPostdb/")
  .on("value", snapshot => {

    var array = []
    snapshot.forEach(childSnapshot => {

      const childData = childSnapshot.val();
      array = array.concat(Object.values(childData));
      setPostList(array);
  
    })

  });
}, []);


const onSelect = (country) => {

  setCountryCode(country.cca2);
  setCountry(country);
  for (const [i, v] of postList.entries()) {
    if (postList[i].country == country.name) {
        var test = selectedPostList.push(postList[i]);
    }
  }
 
};

const onOpen = () => {
   setSelectedPostList([])
   setCountryCode('');
   setCountry(null);
}

const keyExtractor = item => {

  return item;
};


const renderRow = ({item}) => {

    const cellViews = item.map((k, id) => {

        return (
          <TouchableOpacity key={id} styleName="flexible" onPress={() => navigate('SinglePost', {item: k})} >
            
            <Card style={{backgroundColor: "#52E4C4"}} styleName="flexible">
              <Image
                styleName="medium-wide"
                source={{uri: k.imageUri}}
              />
              <View styleName="content">
                <Subtitle style={styles.titleText} numberOfLines={3}>{k.title}</Subtitle>
                <View styleName="horizontal">
                  <Caption styleName="collapsible" style={styles.locationText} numberOfLines={2}>{k.location}</Caption>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        );
        
      });

    return (
        <GridRow columns={2}>
          {cellViews}
        </GridRow>
      );
}

    let isFirstArticle = true;
    const groupedData = GridRow.groupByRows(selectedPostList, 2, () => {
      if (isFirstArticle) {
        isFirstArticle = false;
        return 2;
      }
      return 1;
    });



  
  return (

    <Screen styleName="paper"> 
      <NavigationBar
        styleName="inline"
        centerComponent={<Title style={styles.header}>Explore</Title>}
      />
      <CountryPicker
        {...{
          countryCode,
          withFilter,
          withFlag,
          withCountryNameButton,
          withCloseButton,
          onSelect,
          onOpen
        }}
        visible
      />
      <Text style={styles.buttonText}>Press on the flag to select a country</Text>
      <FlatList 
            keyExtractor={keyExtractor}
            renderItem={renderRow}
            data={groupedData}
          />
    </Screen>
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
    fontSize: 20,
    color: "#286759",
  },
  textInputs: {
    height: 55,
    width: Dimensions.get("window").width,
    borderRadius: 30,
    borderColor: "#E5E5E5",
    borderWidth: 2,
    marginBottom: 8,
  },
  textAreaStyle: {
    borderRadius: 30,
    borderColor: "#E5E5E5",
    borderWidth: 2,
    marginBottom: 8,
    height: 150,
  },
  inputTitles: {
    fontFamily: "Sansation",
    fontSize: 18,
    color: "#286759",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#52E4C4",
    borderRadius: 27.5,
    height: 55,
    width: 253,
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
  locationText: {
    color: "#286759",
    alignItems: "flex-end",
    fontSize: 12,
    fontFamily: "Sansation",
  },
  titleText: {
    color: "#286759",
    alignItems: "flex-end",
    fontSize: 16,
    fontFamily: "Sansation",
  },
  cancelButton: {
    fontSize: 16,
    fontFamily: "Sansation",
  },
});
