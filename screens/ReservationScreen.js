import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  Pressable,
  Button,
  Icon,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Rating, AirbnbRating } from "react-native-ratings";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { setStatusBarStyle } from "expo-status-bar";
import moment from "moment";
import {
  FontAwesome5,
  AntDesign,
  Octicons,
  MaterialCommunityIcons,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";

export default function ReservationScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDurationVisible, setModalDurationVisible] = useState(false);

  const BACKENDURL = 'https://eevy-backend.vercel.app/';

  ///////////////////////////////////////////////////////////////////////////////
  const handleRating = () => {
    fetch(`${"https://eevy-backend.vercel.app"}/chargers/get`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        data.result && dispatch();
      });
  };


  //Utiliser useselector pour récup les informations

  const handleEdit = () => {};

  const handleBook = () => {};

  const handleBack = () => {};

  ///////////////////////////////////////////////////////////////////////////////
  //State sent in frontend datepicker visible or not
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  // Recuperation of the start date/time end time
  //State sent in frontend
  const [dateReservation, setDateReservation] = useState(
    "Date et heure de début"
  );
  //State sent in backend
  const [dateReservationDB, setDateReservationDB] = useState("");
  //State sent in frontend
  const [timeReservation, setTimeReservation] = useState(
    "Modifier l'heure de fin"
  );
  //State sent in backend
  const [timeReservationDB, setTimeReservationDB] = useState("");

  //DATETIMEPICKER-------------------------------------------
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    setDateReservation(moment(date).format("D MMMM YYYY HH:MM "));
    setDateReservationDB(moment(date).format("YYYY-MM-DD HH:MM"));
    console.log("Date début: ", dateReservation);
    //console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  const handleConfirmTime = (time) => {
    setTimeReservation(moment(time).format("D MMMM YYYY HH:MM "));
    setTimeReservationDB(moment(time).format("YYYY-MM-DD HH:MM"));
    console.log("Date de fin: ", timeReservation);
    //console.warn("A  has been picked: ", date);
    hideTimePicker();
  };
  //--------------------------------------------------------------

  return (
    /* Charger Owner Container--------------------------------------------------- */
    <View style={styles.container}>
      <View style={styles.ChargerownerContainer}>
        <View style={styles.chargerowner}>
          <Text style={styles.Username}>Alexandre Bonzi</Text>
          <Image
            name="user"
            source={require("../assets/1640090688917.png")}
            size={10}
            style={styles.profilPicture}
          />
        </View>

        <View style={styles.ratings}>
          <View style={styles.stars}>
            <FontAwesome
              name="star"
              size={15}
              color="#00D369"
              style={styles.starIcon}
            />
            <FontAwesome
              name="star"
              size={15}
              color="#00D369"
              style={styles.starIcon}
            />
            <FontAwesome
              name="star"
              size={15}
              color="#00D369"
              style={styles.starIcon}
            />
            <FontAwesome
              name="star"
              size={15}
              color="#00D369"
              style={styles.starIcon}
            />
            <FontAwesome
              name="star"
              size={15}
              color="#fff"
              style={styles.starIcon}
            />
          </View>
          <TouchableOpacity
            onPress={() => handleRating()}
            style={styles.Ratingsbutton}
            activeOpacity={0.8}
          >
            <Text style={styles.textButtonRating}>Lire les avis</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Charging station Container-------------------------------------------------- */}
      <View style={styles.informations}>
        <Image
          name="chargeur"
          source={require("../assets/Chargeur.png")}
          size={16}
          style={styles.chargeurImage}
        />
        <View style={styles.informationchargeur}>
          <Text style={styles.textInformation}>Borne Schneider Electric</Text>
          <Text style={styles.textInformation}>2 Place du Néron</Text>
          <Text style={styles.textInformation}>Prise type 3</Text>
          <Text style={styles.textInformation}>7,4kW</Text>
        </View>

        <View style={styles.favorite}>
          <TouchableOpacity
            onPress={() => handleEdit()}
            style={styles.buttonFavorite}
            activeOpacity={0.8}
          >
            <FontAwesome
              name="heart"
              size={25}
              color="red"
              style={styles.heartIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Date/Time session Container-------------------------------------------------- */}

      <View style={styles.recap}>
        <View style={styles.datetimeduration}>
          <View style={styles.datepicker}>
            <Text style={styles.titlesession}>DEBUT</Text>
            <TouchableOpacity
              style={styles.datebutton}
              onPress={showDatePicker}
            >
              <Text style={styles.textButton}>{dateReservation}</Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
            />
          </View>

          <View style={styles.datepicker}>
            <Text style={styles.titlesession}>FIN</Text>
            <TouchableOpacity
              style={styles.datebutton}
              onPress={showTimePicker}
            >
              <Text style={styles.textButton}>{timeReservation}</Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={handleConfirmTime}
              onCancel={hideTimePicker}
            />
          </View>
        </View>
      </View>

      {/* Payement Method Container-------------------------------------------------- */}

      <View style={styles.price}>
        <Text style={styles.title}>Mode de paiement</Text>

        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Selectionnez un type de paiement
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Solde EEVY</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Carte Bancaire</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.textStyle}>Solde EEVY</Text>
          </Pressable>
        </View>
      </View>

      {/* Book/Return  Container-------------------------------------------------- */}

      <View style={styles.book}>
        <TouchableOpacity
          onPress={() => handleBook()}
          style={styles.buttonBook}
          activeOpacity={0.5}
        >
          <Text style={styles.textButtonBook}>Reserver</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.back}>
        <TouchableOpacity
          onPress={() => handleBack()}
          style={styles.buttonBack}
          activeOpacity={0.5}
        >
          <Text style={styles.textButtonBack}>Retour</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* StyleSheet-------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  textButton: {
    // fontFamily: "Roboto",
    height: 60,
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  datetimeduration: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginRight: 20,
    height: 80,
  },
  textInformation: {
    // fontFamily: "Roboto",
    height: 26,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    marginTop: 2,
  },
  profilPicture: {
    width: 60,
    height: 60,
    borderRadius: 20,
    marginTop: 5,
  },
  chargeurImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  textButtonBook: {
    // fontFamily: "Roboto",
    height: 40,
    fontWeight: "bold",
    fontSize: 30,
    color: "#fff",
  },
  textButtonBack: {
    // fontFamily: "Roboto",
    height: 40,
    fontWeight: "600",
    fontSize: 20,
    color: "#121F3A",
  },
  textButtonRating: {
    // fontFamily: "Roboto",
    height: 30,
    fontWeight: "600",
    fontSize: 14,
    color: "#fff",
  },
  button: {
    alignItems: "center",
    paddingTop: 8,
    width: "80%",
    backgroundColor: "#00D369",
    borderRadius: 10,
    marginBottom: 10,
  },
  favorite: {
    alignItems: "center",
    marginRight: 16,
    marginLeft: -20,
    marginTop: 80,
  },
  buttonFavorite: {
    alignItems: "center",
  },
  buttonBook: {
    alignItems: "center",
    paddingTop: 4,
    width: "100%",
    height: "40%",
    backgroundColor: "#00D369",
    borderRadius: 10,
  },
  datepicker: {
    alignItems: "center",
    paddingTop: 6,
    width: "80%",
    height: "86%",
    borderRadius: 10,
    color: "#00D369",
    marginRight: -50,
    marginLeft: -30,
  },

  datebutton: {
    flex: 1,
    alignItems: "center",
    paddingTop: 2,
    width: "50%",
    heigth: "80%",
    backgroundColor: "#00D369",
    borderRadius: 10,
  },
  buttonBack: {
    alignItems: "center",
    paddingTop: 10,
    width: "80%",
    height: "40%",
    backgroundColor: "#F5F7F6",
    borderRadius: 10,
  },
  title: {
    // fontFamily: "Roboto",
    height: 30,
    fontWeight: "bold",
    fontSize: 20,
    marginHorizontal: 0,
    color: "#121F3A",
  },
  titlesession: {
    // fontFamily: "Roboto",
    height: 30,
    fontWeight: "bold",
    fontSize: 20,
    marginHorizontal: 0,
    color: "#121F3A",
    marginBottom: 8,
    marginTop: -30,
  },
  debutfin: {
    flexDirection: "row",
    marginRight: 20,
  },
  titleInformation: {
    // fontFamily: "Roboto",
    height: 26,
    fontWeight: "bold",
    fontSize: 16,
  },
  chargerowner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "20%",
    marginTop: 0,
  },
  recap: {
    flex: 1,
    backgroundColor: "#eeeeee",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "50%",
    margin: 20,
    borderRadius: 10,
  },

  price: {
    flex: 1,
    backgroundColor: "#eeeeee",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "50%",
    borderRadius: 10,
  },

  book: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "50%",
    margin: 0,
    borderRadius: 10,
  },
  back: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    height: "40%",
    marginTop: -60,
    borderRadius: 10,
  },

  informations: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "20%",
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#eeeeee",
  },
  ratings: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "20%",
    borderRadius: 10,
    marginTop: 0,
  },
  ChargerownerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "40%",
    borderRadius: 0,
    backgroundColor: "#121F3A",
    marginTop: 50,
  },
  Ratingsbutton: {
    alignItems: "center",
    paddingTop: 8,
    width: "60%",
    backgroundColor: "#00D369",
    borderRadius: 10,
    marginTop: 15,
  },
  stars: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  Username: {
    // fontFamily: "Roboto",
    height: 30,
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  durationModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 140,
    width: 60,
    height: 80,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
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
  buttonOpen: {
    alignItems: "center",
    paddingTop: 8,
    width: 100,
    height: "40%",
    backgroundColor: "#00D369",
    borderRadius: 10,
  },
  buttonOpenDuration: {
    alignItems: "center",
    paddingTop: 8,
    width: 160,
    height: "54%",
    backgroundColor: "#00D369",
    borderRadius: 10,
    marginTop: 18,
    marginLeft: 10,
  },
  buttonClose: {
    backgroundColor: "#00D369",
    margin: 20,
    width: 200,
    paddingTop: 19,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
  },
});
