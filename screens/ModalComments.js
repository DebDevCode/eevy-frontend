import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React from "react";
import moment from "moment";
import { FontAwesome } from "@expo/vector-icons";

const ModalComments = (props) => {
  const comments = props.comments.map((comment, i) => {
    const iconsStars = [];

    for (let i = 0; i < 5; i++) {
      let style = { color: "#00D369" };
      let iconName = "star-o";

      if (i < comment.rating) {
        style = { color: "#00D369" };
        iconName = "star";
      }
      iconsStars.push(
        <FontAwesome name={iconName} size={20} style={style} key={i} />
      );
    }
    return (
      <View style={styles.comments} key={i}>
        <Text style={styles.commentTxt}>
          De <Text style={styles.fromTxt}>{comment.from}</Text>
        </Text>
        <Text style={styles.commentTxt}>
          Le {moment(comment.date).format("DD MMM YYYY [à] h:mm:ss a")}
        </Text>
        <Text style={styles.commentTxt}>Commentaire : {comment.comment}</Text>
        <View style={styles.viewRate}>
          <Text style={styles.commentTxt}>Note :</Text>
          {iconsStars}
        </View>
      </View>
    );
  });

  if (props.comments.length > 0) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.containerCom}>
          <View style={styles.title}>
            <Text style={styles.titleTxt}>Les avis de {props.borneOwner}</Text>
          </View>
          <View style={styles.commentsContainer}>{comments}</View>
          <TouchableOpacity
            style={styles.btnComment}
            onPress={() =>
              props.setModalCommentsVisible(!props.modalCommentsVisible)
            }
          >
            <Text style={styles.btnCommentTxt}>Retour</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View style={styles.containerCom}>
        <View style={styles.titleNoComments}>
          <Text style={styles.titleNoCommentTxt}>
            {props.borneOwner} n'a pas encore d'avis n'hésitez pas à lui en
            laisser un si vous rechargez chez lui ! 😇
          </Text>
        </View>
        <TouchableOpacity
          style={styles.btnNoComment}
          onPress={() =>
            props.setModalCommentsVisible(!props.modalCommentsVisible)
          }
        >
          <Text style={styles.btnCommentTxt}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    paddingTop: StatusBar.currentHeight,
  },

  containerCom: {
    height: "100%",
    backgroundColor: "#121F3A",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 400,
  },

  title: {
    backgroundColor: "white",
    height: 40,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 20,
  },

  titleTxt: {
    fontSize: 18,
    fontWeight: "600",
    // fontFamily: "Roboto"
  },

  titleNoCommentTxt: { fontSize: 18, fontWeight: "600", color: "white" },

  titleNoComments: {
    backgroundColor: "#121F3A",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 20,
  },

  commentsContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginTop: 20,
  },

  comments: {
    width: "100%",
    backgroundColor: "#EDE8E8",
    borderRadius: 10,
    marginBottom: 10,
    padding: 20,
  },

  commentTxt: { margin: 5 },

  fromTxt: { fontSize: 16, fontWeight: "600" },

  viewRate: {
    flexDirection: "row",
    alignItems: "center",
  },

  line: {
    marginTop: 20,
    marginBottom: 20,
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },

  btnComment: {
    width: "70%",
    height: 40,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00D369",
    marginBottom: 40,
  },

  btnNoComment: {
    width: "70%",
    height: 40,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00D369",
    position: "absolute",
    bottom: 110,
  },

  btnCommentTxt: { fontSize: 20, fontWeight: "600", color: "white" },
});

export default ModalComments;
