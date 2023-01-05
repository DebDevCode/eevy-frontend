import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBorne } from "../../reducers/user";
import { Switch } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import AddressAutocomplete from "react-native-address-autocomplete";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";

const ModalAddBorne = (props) => {
  // const searchAddress = async (city) => {
  //   if (city === "") {
  //     return;
  //   }
  //   const suggestions = await AddressAutocomplete.getAddressSuggestions(city);
  //   console.log(suggestions);
  // };

  const dispatch = useDispatch();
  const BACKEND_URL = useSelector((state) => state.constants.value.BACKENDURL);
  const user = useSelector((state) => state.user.value);

  const [modalAddBorneConfirmedVisible, setModalAddBorneConfirmedVisible] =
    useState(false);

  const handleAddBorne = () => {
    fetch(`${BACKEND_URL}/chargers/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        token: user.token,
        num,
        street,
        zipCode,
        city,
        brand,
        power,
        plugType,
        pricePerHour,
        available,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch(addBorne(data.newCharger));
      });
  };

  const [num, setNum] = useState("");
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [brand, setBrand] = useState("");
  const [power, setPower] = useState("");
  const [plugType, setPlugType] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [available, setAvailable] = useState(false);

  const modal = (
    <Modal
      animationType="fade"
      transparent={false}
      visible={modalAddBorneConfirmedVisible}
      onRequestClose={() => {
        props.setModalAddBorneVisible(!props.modalAddBorneVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Borne ajoutée avec succès !</Text>

          <TouchableOpacity
            style={styles.btnContinueModal}
            onPress={() =>
              props.setModalAddBorneVisible(!props.modalAddBorneVisible)
            }
          >
            <Text style={styles.btnCommentTxt}>Continuer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {modal}

      <TouchableOpacity
        style={styles.iconRetour}
        onPress={() =>
          props.setModalAddBorneVisible(!props.modalAddBorneVisible)
        }
      >
        <MaterialIcons name="keyboard-arrow-left" size={40} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Ajouter une borne</Text>

      <View style={styles.informationsContainer}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "15%" }}>
            <Text style={styles.placeholder}>N° rue</Text>
            <TextInput
              value={num}
              onChangeText={(text) => setNum(text)}
              style={styles.input}
            />
          </View>

          <View style={{ width: "80%" }}>
            <Text style={styles.placeholder}>Adresse de la borne</Text>
            <TextInput
              value={street}
              onChangeText={(text) => setStreet(text)}
              style={styles.input}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.viewInputAddressNumero}>
            <Text style={styles.placeholder}>Code postal</Text>
            <TextInput
              value={zipCode}
              onChangeText={(text) => setZipCode(text)}
              style={styles.input}
            />
          </View>

          <View style={styles.viewInputAddress}>
            <Text style={styles.placeholder}>Ville</Text>
            <TextInput
              value={city}
              onChangeText={(text) => setCity(text)}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Marque</Text>
          <TextInput
            value={brand}
            onChangeText={(text) => setBrand(text)}
            style={styles.input}
          />
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Puissance en Kw</Text>
          <TextInput
            value={power}
            onChangeText={(text) => setPower(text)}
            style={styles.input}
          />
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Type de prise</Text>
          <TextInput
            value={plugType}
            onChangeText={(text) => setPlugType(text)}
            style={styles.input}
          />
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Prix par heure</Text>
          <TextInput
            value={pricePerHour}
            onChangeText={(text) => setPricePerHour(text)}
            style={styles.lastInput}
          />
        </View>

        <Text style={{ marginBottom: 10 }}>Rendre votre borne active ?</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#00D369" }}
          thumbColor={available ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setAvailable(!available)}
          value={available}
        />
      </View>

      <TouchableOpacity
        style={styles.btnComment}
        onPress={() => {
          handleAddBorne();
          setModalAddBorneConfirmedVisible(!modalAddBorneConfirmedVisible);
        }}
      >
        <Text style={styles.btnCommentTxt}>Ajouter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121F3A",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  iconRetour: { position: "absolute", left: 10, top: 54 },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
    position: "absolute",
    top: 60,
  },

  informationsContainer: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "space-around",
    width: "95%",
    borderRadius: 10,
    padding: 10,
    paddingTop: 40,
    marginBottom: 30,
  },

  viewInput: {
    width: "100%",
  },

  viewInputAddressNumero: { width: "24%" },

  viewInputAddress: { width: "73%" },

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

  lastInput: {
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
    marginBottom: 10,
  },

  placeholder: {
    position: "absolute",
    top: -20,
    left: 2,
    color: "#00D369",
    fontWeight: "500",
  },

  btnComment: {
    width: "60%",
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00D369",
    marginBottom: 110,
  },

  btnCommentTxt: { fontSize: 20, fontWeight: "600", color: "white" },

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
    marginBottom: 40,
  },
});

export default ModalAddBorne;
