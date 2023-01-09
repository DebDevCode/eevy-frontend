import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome, FontAwesome5, AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import ModalRateComment from "./ModalRateComment";

const ModalRateReservation = (props) => {
  const BACKEND_URL = useSelector((state) => state.constants.value.BACKENDURL);
  const user = useSelector((state) => state.user.value);

  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");
  const [modalRateCommentVisible, setModalRateCommentVisible] = useState(false);

  const iconsStars = [];

  for (let i = 0; i < 5; i++) {
    let style = { color: "#00D369" };
    let iconName = "star-o";

    if (i < rate) {
      style = { color: "#00D369" };
      iconName = "star";
    }
    iconsStars.push(
      <FontAwesome
        key={i}
        name={iconName}
        size={24}
        style={style}
        onPress={() => setRate(i + 1)}
      />
    );
  }

  let iconFav;

  props.isFavorite ? (iconFav = "heart") : (iconFav = "hearto");

  if (modalRateCommentVisible) {
    return (
      <ModalRateComment
        modalRateCommentVisible={modalRateCommentVisible}
        setModalRateCommentVisible={setModalRateCommentVisible}
        borneInfos={props.borneInfos}
        setModalRateVisible={props.setModalRateVisible}
        modalRateVisible={props.modalRateVisible}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.infosView}>
          <View style={styles.titleStyle}>
            <Text style={styles.infosTitle}>Information de ma recharge</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.infosContainer}>
            <FontAwesome5 name="charging-station" size={40} color="#00D369" />
            <View style={styles.infos}>
              <Text style={styles.infosTxtTitle}>
                Adresse :{" "}
                <Text style={styles.infosTxt}>{props.borneInfos.address}</Text>
              </Text>
              <Text style={styles.infosTxtTitle}>
                Chargeur :{" "}
                <Text style={styles.infosTxt}>{props.borneInfos.power} Kw</Text>
              </Text>
              <Text style={styles.infosTxtTitle}>
                Durée :{" "}
                <Text style={styles.infosTxt}>{props.borneInfos.duration}</Text>
              </Text>
              <Text style={styles.infosTxtTitle}>
                Prix :{" "}
                <Text style={styles.infosTxt}>{props.borneInfos.price}</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={() => props.handleAddFavorite()}>
              <AntDesign name={iconFav} size={32} color="red" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.btnComment}
          onPress={() => {
            setModalRateCommentVisible(!modalRateCommentVisible);
          }}
        >
          <Text style={styles.btnCommentTxt}>Continuer</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121F3A",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 10,
  },

  iconsStars: {
    flexDirection: "row",
    justifyContent: "center",
  },

  infosView: {
    width: "95%",
    backgroundColor: "#EDE8E8",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },

  infosContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  infosTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },

  infosTxtTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
    // fontFamily: "Roboto-Medium",
  },

  infosTxt: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    // fontFamily: "Roboto-Medium",
  },

  infos: { width: "60%" },

  titleStyle: {
    backgroundColor: "white",
    height: 40,
    width: "90%",
    borderRadius: 15,
    justifyContent: "center",
  },

  titleCommentStyle: {
    backgroundColor: "white",
    height: 40,
    width: "55%",
    borderRadius: 15,
    justifyContent: "center",
  },

  titleRateStyle: {
    backgroundColor: "white",
    height: 40,
    width: "30%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },

  line: {
    marginTop: 20,
    marginBottom: 20,
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },

  infosTxt: {
    fontSize: 16,
    fontWeight: "500",
  },

  commentContainer: {
    width: "95%",
    backgroundColor: "#EDE8E8",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },

  commentTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },

  comment: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 5,
    width: "100%",
    height: 100,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "500",
  },

  rateContainer: {
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#EDE8E8",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    alignItems: "center",
  },

  btnComment: {
    width: "60%",
    height: 40,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00D369",
    marginBottom: 100,
  },

  btnCommentTxt: { fontSize: 20, fontWeight: "600", color: "white" },
});

export default ModalRateReservation;
