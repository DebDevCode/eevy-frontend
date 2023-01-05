import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const ModalHelp = (props) => {
  const user = useSelector((state) => state.user.value);

  const [userName, setUserName] = useState(
    user.firstName + " " + user.lastName
  );
  const [email, setEmail] = useState(user.email);
  const [tel, setTel] = useState(user.tel);
  const [problem, setProblem] = useState(null);

  const [modalRapportConfirmedVisible, setModalRapportConfirmedVisible] =
    useState(false);

  const modal = (
    <Modal
      animationType="fade"
      transparent={false}
      visible={modalRapportConfirmedVisible}
      onRequestClose={() => {
        props.setModalHelpVisible(!props.modalHelpVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Rapport envoyé avec succès !</Text>

          <TouchableOpacity
            style={styles.btnContinueModal}
            onPress={() => props.setModalHelpVisible(!props.modalHelpVisible)}
          >
            <Text style={styles.btnCommentTxt}>Continuer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.myAccount}>
        {modal}
        <TouchableOpacity
          style={styles.iconRetour}
          onPress={() => props.setModalHelpVisible(!props.modalHelpVisible)}
        >
          <MaterialIcons name="keyboard-arrow-left" size={40} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Contacter le support</Text>

        <View style={styles.informationsContainer}>
          <View style={styles.viewInput}>
            <Text style={styles.placeholder}>Votre nom</Text>
            <TextInput
              value={userName}
              onChangeText={(text) => setUserName(text)}
              style={styles.input}
            />
          </View>

          <View style={styles.viewInput}>
            <Text style={styles.placeholder}>Votre e-mail</Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
            />
          </View>

          <View style={styles.viewInput}>
            <Text style={styles.placeholder}>Votre numéro de téléphone</Text>
            <TextInput
              value={tel}
              onChangeText={(text) => setTel(text)}
              style={styles.input}
            />
          </View>

          <View style={styles.viewInput}>
            <Text style={styles.placeholder}>Votre problème</Text>
            <TextInput
              value={problem}
              onChangeText={(text) => setProblem(text)}
              style={styles.inputProblem}
              multiline={true}
              numberOfLines={4}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.btnEnvoyer}
          onPress={() => {
            setModalRapportConfirmedVisible(!modalRapportConfirmedVisible);
          }}
        >
          <Text style={styles.btnEnvoyerTxt}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121F3A",
    alignItems: "center",
    justifyContent: "center",
  },

  myAccount: {
    marginTop: 70,
    width: "95%",
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
  },

  iconRetour: { position: "absolute", left: 10, top: -13 },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
    position: "absolute",
    top: -7,
  },

  informationsContainer: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "space-between",
    width: "95%",
    borderRadius: 10,
    padding: 40,
    flex: 0.6,
    marginBottom: 80,
  },

  viewInput: {
    width: "120%",
  },

  input: {
    backgroundColor: "#4FB8FF",
    opacity: 0.6,
    width: "100%",
    height: 45,
    padding: 10,
    fontWeight: "500",
    fontSize: 16,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginBottom: 30,
  },

  inputProblem: {
    backgroundColor: "#4FB8FF",
    opacity: 0.6,
    width: "100%",
    height: 100,
    padding: 10,
    fontWeight: "500",
    fontSize: 16,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },

  placeholder: {
    position: "absolute",
    top: -20,
    left: 5,
    color: "#00D369",
    fontWeight: "500",
  },

  btnEnvoyer: {
    width: "60%",
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00D369",
  },

  btnEnvoyerTxt: { fontSize: 20, fontWeight: "600", color: "white" },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    width: "85%",
    backgroundColor: "#121F3A",
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 25,
    paddingTop: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },

  btnContinueModal: {
    width: "60%",
    height: 40,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00D369",
  },

  btnCommentTxt: { fontSize: 20, fontWeight: "600", color: "white" },
});

export default ModalHelp;
