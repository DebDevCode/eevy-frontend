import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBorne } from "../../reducers/user";
import { Switch } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";

const ModalAdBorne = (props) => {
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

  const [stepNbr, setStepNbr] = useState(0);
  const [num, setNum] = useState("");
  const [street, setStreet] = useState("");
  const streetRef = useRef();
  const [zipCode, setZipCode] = useState("");
  const ziCodeRef = useRef();
  const [city, setCity] = useState("");
  const cityRef = useRef();
  const [brand, setBrand] = useState("");
  const [power, setPower] = useState("");
  const powerRef = useRef();
  const [plugType, setPlugType] = useState("");
  const plugTypeRef = useRef();
  const [pricePerHour, setPricePerHour] = useState("");
  const [available, setAvailable] = useState(false);
  const [error, setError] = useState("");

  const stepInc = () => {
    if (stepNbr === 0) {
      if (num === "" || street === "" || zipCode === "" || city === "") {
        setError("Veuillez remplir tous les champs");
      } else {
        setError("");
        setStepNbr(stepNbr + 1);
      }
    } else if (stepNbr === 1) {
      if (brand === "" || power === "" || plugType === "") {
        setError("Veuillez remplir tous les champs");
      } else {
        setError("");
        setStepNbr(stepNbr + 1);
      }
    } else if (stepNbr === 2) {
      if (pricePerHour === "") {
        setError("Veuillez définir un prix");
      } else {
        setError("");
        handleAddBorne();
        setModalAddBorneConfirmedVisible(!modalAddBorneConfirmedVisible);
      }
    }
  };

  const stepDec = () => {
    if (stepNbr === 0) {
      props.setModalAddBorneVisible(!props.modalAddBorneVisible);
    } else {
      setStepNbr(stepNbr - 1);
    }
  };

  const errorText = error ? (
    <Text style={{ color: "red" }}>{error}</Text>
  ) : null;

  let progressBar;

  let stepTxt;

  let input;

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

  if (stepNbr === 0) {
    progressBar = 0.25;
    stepTxt = "Ajoutez l'adresse de la borne";
    input = (
      <View style={styles.inputAddressContainer}>
        <View
          style={{
            flexDirection: "row",
            width: "90%",
            justifyContent: "space-between",
            marginBottom: 50,
          }}
        >
          <View style={{ width: "15%" }}>
            <Text style={styles.placeholder}>N° rue</Text>
            <TextInput
              value={num}
              onChangeText={(text) => setNum(text)}
              style={styles.input}
              keyboardType="numbers-and-punctuation"
              returnKeyType="next"
              onSubmitEditing={() => {
                streetRef.current.focus();
              }}
            />
          </View>

          <View style={{ width: "80%" }}>
            <Text style={styles.placeholder}>Adresse de la borne</Text>
            <TextInput
              value={street}
              onChangeText={(text) => setStreet(text)}
              style={styles.input}
              ref={streetRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                ziCodeRef.current.focus();
              }}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "90%",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.viewInputAddressNumero}>
            <Text style={styles.placeholder}>Code postal</Text>
            <TextInput
              value={zipCode}
              onChangeText={(text) => setZipCode(text)}
              style={styles.input}
              ref={ziCodeRef}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={() => {
                cityRef.current.focus();
              }}
            />
          </View>

          <View style={styles.viewInputAddress}>
            <Text style={styles.placeholder}>Ville</Text>
            <TextInput
              value={city}
              onChangeText={(text) => setCity(text)}
              style={styles.input}
              ref={cityRef}
              returnKeyType="done"
              onSubmitEditing={() => stepInc()}
            />
          </View>
        </View>
      </View>
    );
  } else if (stepNbr === 1) {
    progressBar = 0.5;
    stepTxt = "Puis ajoutez les informations de votre borne";
    input = (
      <View style={styles.inputContainer}>
        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Marque</Text>
          <TextInput
            value={brand}
            onChangeText={(text) => setBrand(text)}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => {
              powerRef.current.focus();
            }}
          />
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Puissance en Kw</Text>
          <TextInput
            value={power}
            onChangeText={(text) => setPower(text)}
            style={styles.input}
            ref={powerRef}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={() => {
              plugTypeRef.current.focus();
            }}
          />
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Type de prise</Text>
          <TextInput
            value={plugType}
            onChangeText={(text) => setPlugType(text)}
            style={styles.input}
            ref={plugTypeRef}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={() => stepInc()}
          />
        </View>
      </View>
    );
  } else if (stepNbr === 2) {
    progressBar = 0.75;
    stepTxt =
      "Enfin choisissez un prix par heure et définissez si vous souhaitez rendre votre borne active dès maintenant";
    input = (
      <View style={styles.inputContainer}>
        <View style={styles.viewInputPrice}>
          <Text style={styles.placeholder}>Prix par heure</Text>
          <TextInput
            value={pricePerHour}
            onChangeText={(text) => setPricePerHour(text)}
            style={styles.input}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>

        <Text style={{ marginBottom: -40, color: "white" }}>
          Rendre votre borne active ?
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#00D369" }}
          thumbColor={available ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setAvailable(!available)}
          value={available}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {modal}
      <TouchableOpacity style={styles.iconRetour} onPress={() => stepDec()}>
        <MaterialIcons name="keyboard-arrow-left" size={40} color="white" />
      </TouchableOpacity>
      <Progress.Bar
        progress={progressBar}
        width={400}
        style={styles.progress}
        color={"#00D369"}
      />
      <View style={{ width: "90%" }}>
        <Text style={styles.stepTxt}>{stepTxt}</Text>
      </View>

      {input}

      {errorText}

      <TouchableOpacity style={styles.btnContinue} onPress={() => stepInc()}>
        <Text style={styles.btnTxt}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121F3A",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  iconRetour: { position: "absolute", left: 10, top: 54 },

  progress: { width: "90%", position: "absolute", top: 120 },

  stepTxt: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    position: "absolute",
    top: -50,
  },

  inputContainer: {
    width: "90%",
    height: "30%",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 100,
  },

  inputAddressContainer: {
    width: "100%",
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
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

  viewInputPrice: { width: "100%", marginTop: 50 },

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
  },

  placeholder: {
    position: "absolute",
    top: -20,
    left: 2,
    color: "#00D369",
    fontWeight: "500",
  },

  btnContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    borderColor: "white",
    borderWidth: 2,
  },

  btnContinue: {
    backgroundColor: "#00D369",
    width: "90%",
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 110,
  },

  btnTxt: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },

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

export default ModalAdBorne;
