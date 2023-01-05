import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";

const ModalRateComment = (props) => {
  const BACKEND_URL = useSelector((state) => state.constants.value.BACKENDURL);
  const user = useSelector((state) => state.user.value);

  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");

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

  const handleAddComment = () => {
    fetch(`${BACKEND_URL}/users/addComment`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        email: user.email,
        ownerID: props.borneInfos.ownerId,
        comment: comment,
        rating: rate,
        chargerId: props.borneInfos.charger,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        props.setModalRateVisible(!props.modalRateVisible);
        props.setModalRateCommentVisible(!props.modalRateCommentVisible);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.commentContainer}>
        <View style={styles.titleCommentStyle}>
          <Text style={styles.commentTitle}>Commentaire</Text>
        </View>
        <View style={styles.line}></View>
        <TextInput
          onChangeText={(text) => setComment(text)}
          style={styles.comment}
          multiline={true}
          numberOfLines={4}
          returnKeyType="done"
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
        />

        <View style={styles.line}></View>

        <View style={styles.rateContainer}>
          <View style={styles.titleRateStyle}>
            <Text style={styles.commentTitle}>Note</Text>
          </View>
          <View style={styles.iconsStars}>{iconsStars}</View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.btnComment}
        onPress={() => handleAddComment()}
      >
        <Text style={styles.btnCommentTxt}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121F3A",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 10,
  },

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
    width: "100%",
    backgroundColor: "#EDE8E8",
    borderRadius: 10,
    alignItems: "center",
  },

  iconsStars: {
    flexDirection: "row",
    justifyContent: "center",
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

export default ModalRateComment;
