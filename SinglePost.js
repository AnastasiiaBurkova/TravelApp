import React from "react";
import { StyleSheet } from "react-native";
import {
  Title,
  Tile,
  Screen,
  NavigationBar,
  Button,
  Text,
  Image,
} from "@shoutem/ui";
import { ScrollView } from "react-native-gesture-handler";

export default function SinglePost(props) {
  const { navigate } = props.navigation;
  const { item } = props.route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Screen styleName="paper">
        <NavigationBar
          styleName="inline"
          styles={{ backgroundColor: "#C3DBE3" }}
          leftComponent={
            <Button onPress={() => navigate("Links")}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </Button>
          }
          centerComponent={<Title style={styles.header}>{item.title}</Title>}
        />

        <Image styleName="large-square" source={{ uri: item.imageUri }} />

        <Tile>
          <Text style={styles.mainText}>{item.description}</Text>
        </Tile>
      </Screen>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#52E4C4",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#52E4C4",
  },
  header: {
    fontFamily: "Sansation",
    fontSize: 20,
    color: "#286759",
  },
  mainText: {
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
