import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import ModalComments from "./ModalComments";
import Stars from "react-native-stars";
import {
  FontAwesome,
  FontAwesome5,
  AntDesign,
  Octicons,
  MaterialCommunityIcons,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import { addReservation, payement } from "../reducers/user";

const ModalBorneReservation = (props) => {
  const BACKENDURL = useSelector((state) => state.constants.value.BACKENDURL);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalNotAvailableVisible, setModalNotAvailableVisible] =
    useState(false);

  const [modalChargeurReserved, setModalChargeurReserved] = useState(false);

  const [borneOwner, setBorneOwner] = useState(null);
  const [borneOwnerProfilPic, setBorneOwnerProfilPic] = useState(null);
  const [comments, setComments] = useState(null);
  const [modalCommentsVisible, setModalCommentsVisible] = useState(false);
  const [shoot, setShoot] = useState(false);
  const [soldeVisible, setSoldeVisible] = useState(false);
  const [total, setTotal] = useState(null);
  const [from, setFrom] = useState(props.from);
  const [to, setTo] = useState(props.to);

  ///////////////////////////////////////////////////////////////////////////////
  const [stars, setStars] = useState(null);

  useEffect(() => {
    fetch("https://eevy-backend.vercel.app/chargers/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        email: user.email,
        chargerId: props.borneClicked._id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setBorneOwner(
            data.charger.owner.firstName + " " + data.charger.owner.lastName
          );
          setBorneOwnerProfilPic(data.charger.owner.profilPic);
          setRate(data.charger.owner.rating);
          setStars(
            <Stars
              spacing={1}
              display={data.charger.owner.rating}
              count={5}
              fullStar={
                <FontAwesome
                  name="star"
                  size={15}
                  style={{ color: "#00D369" }}
                />
              }
              emptyStar={
                <FontAwesome
                  name="star-o"
                  size={15}
                  style={{ color: "#00D369" }}
                />
              }
              halfStar={
                <FontAwesome
                  name="star-half-empty"
                  size={15}
                  style={{ color: "#00D369" }}
                />
              }
            />
          );
          setComments(data.charger.chargerComments);
        }
      });
  }, []);

  let profilPic;
  if (borneOwnerProfilPic !== "../assets/eevy-logo-2.png") {
    profilPic = (
      <Image
        source={{ uri: `${borneOwnerProfilPic}` }}
        style={{
          width: 80,
          height: 80,
          borderWidth: 1,
          borderColor: "white",
          borderRadius: 40,
        }}
      />
    );
  } else {
    profilPic = (
      <Image
        source={require("../assets/eevy-logo-2.png")}
        style={{
          width: 80,
          height: 80,
          borderWidth: 1,
          borderColor: "white",
          borderRadius: 40,
        }}
      />
    );
  }

  useEffect(() => {
    CalculatePrice();
  }, [to, from]);

  const handleRating = () => {
    setModalCommentsVisible(!modalCommentsVisible);
  };

  const handlePress = () => {
    //To fire the cannon again
    setShoot(false);
    setTimeout(() => {
      setShoot(true);
    }, 500);
  };

  const handleBook = () => {
    if (props.borneClicked.available === true) {
      fetch(`${BACKENDURL}/reservations/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: user.token,
          email: user.email,
          chargerId: props.borneClicked._id, // reserved charger
          from,
          to,
          price: total,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(addReservation(data.newReservation));
          dispatch(payement(total));
        });
      handlePress();
      setModalChargeurReserved(true);
    } else {
      setModalNotAvailableVisible();
    }
  };

  const handleBack = () => {
    props.setModalReservationVisible(!props.modalReservationVisible);
  };

  ///////////////////////////////////////////////////////////////////////////////
  //State sent in frontend datepicker visible or not
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  // Recuperation of the start date/time end time
  //State sent in frontend
  const [dateReservation, setDateReservation] = useState(
    props.from ? props.from : "Date et heure de début"
  );
  //State sent in backend
  const [dateReservationDB, setDateReservationDB] = useState("");
  //State sent in frontend
  const [timeReservation, setTimeReservation] = useState(
    props.to ? props.to : "Date et heure de fin"
  );
  //State sent in backend
  const [timeReservationDB, setTimeReservationDB] = useState("");

  //DATETIMEPICKER-------------------------------------------

  const CalculatePrice = () => {
    const Total = Number(
      (props.borneClicked.pricePerHour *
        (moment(to).toDate() - moment(from).toDate())) /
        3600000
    ).toFixed(2);
    setTotal(
      Number(
        (props.borneClicked.pricePerHour *
          (moment(to).toDate() - moment(from).toDate())) /
          3600000
      ).toFixed(2)
    );
  };

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
    setDateReservation(moment(date).format("D MMMM YYYY HH:mm "));
    setDateReservationDB(moment(date).format("YYYY-MM-DD HH:mm"));
    setFrom(moment(date).format("YYYY-MM-DD HH:mm"));
    hideDatePicker();
  };

  const handleConfirmTime = (time) => {
    setTimeReservation(moment(time).format("D MMMM YYYY HH:mm "));
    setTimeReservationDB(moment(time).format("YYYY-MM-DD HH:mm"));
    setTo(moment(time).format("YYYY-MM-DD HH:mm"));
    hideTimePicker();
  };

  const [rate, setRate] = useState(3);

  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddFavorite = async () => {
    setIsFavorite(!isFavorite);
    const response = await fetch(`${BACKENDURL}/users/updateFavorites`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        email: user.email,
        charger: props.borneClicked._id,
      }),
    });
  };
  let iconFav;

  isFavorite ? (iconFav = "heart") : (iconFav = "hearto");

  const [paymentChoose, setPaymentChoose] = useState("Choisir");
  //--------------------------------------------------------------
  if (modalCommentsVisible) {
    return (
      <ModalComments
        borneOwner={borneOwner}
        comments={comments}
        modalCommentsVisible={modalCommentsVisible}
        setModalCommentsVisible={setModalCommentsVisible}
      />
    );
  } else {
    return (
      /* Charger Owner Container--------------------------------------------------- */

      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.containerPage}>
            {shoot ? (
              <ConfettiCannon count={100} origin={{ x: 0, y: 1000 }} />
            ) : null}
            <View style={styles.chargerOwnerContainer}>
              <View style={styles.chargerOwner}>
                {profilPic}
                <Text style={styles.username}>{borneOwner}</Text>
              </View>

              <View style={styles.ratings}>
                <View style={styles.stars}>
                  {stars}
                  <Text style={styles.rateNumber}>{rate}/5</Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleRating()}
                  style={styles.ratingsButton}
                >
                  <Text style={styles.textButtonRating}>Lire les avis</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Charging station Container-------------------------------------------------- */}
            <View style={styles.informationsContainer}>
              <View style={styles.titleInfos}>
                <Text style={styles.titleInfosTxt}>
                  Informations de la borne
                </Text>
              </View>
              <View style={styles.informations}>
                {/* <Image
          name="chargeur"
          source={require("../assets/Chargeur.png")}
          size={16}
          style={styles.chargeurImage}
        /> */}
                <View style={styles.viewIconsBorne}>
                  <View style={styles.favorite}>
                    <TouchableOpacity onPress={() => handleAddFavorite()}>
                      <AntDesign
                        name={iconFav}
                        size={32}
                        color="red"
                        style={{ marginBottom: 20 }}
                      />
                    </TouchableOpacity>
                  </View>
                  <FontAwesome5
                    name="charging-station"
                    size={60}
                    color="#00D369"
                    style={{ marginRight: 10 }}
                  />
                </View>

                <View style={styles.informationchargeur}>
                  <Text style={styles.textInformation}>
                    <Text style={styles.textInformationLabel}>Marque : </Text>
                    {props.borneClicked.brand}
                  </Text>
                  <Text style={styles.textInformation}>
                    <Text style={styles.textInformationLabel}>Adresse : </Text>
                    {props.borneClicked.street}
                  </Text>
                  <Text style={styles.textInformation}>
                    <Text style={styles.textInformationLabel}>Ville : </Text>
                    {props.borneClicked.city}
                  </Text>
                  <Text style={styles.textInformation}>
                    <Text style={styles.textInformationLabel}>Prise : </Text>
                    {props.borneClicked.plugType}
                  </Text>
                  <Text style={styles.textInformation}>
                    <Text style={styles.textInformationLabel}>
                      Puissance :{" "}
                    </Text>
                    {props.borneClicked.power} kW
                  </Text>
                  <Text style={styles.textInformation}>
                    <Text style={styles.textInformationLabel}>Prix : </Text>
                    {props.borneClicked.pricePerHour} €/h
                  </Text>
                </View>
              </View>
            </View>

            {/* Date/Time session Container-------------------------------------------------- */}

            <View style={styles.recap}>
              <View style={styles.dateTimeDuration}>
                <View style={styles.datePicker}>
                  <View style={styles.title}>
                    <Text style={styles.titleSession}>Début</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={showDatePicker}
                  >
                    <Text style={styles.textDateButton}>{dateReservation}</Text>
                  </TouchableOpacity>

                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="datetime"
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePicker}
                  />
                </View>

                <View style={styles.datePicker}>
                  <View style={styles.titleFin}>
                    <Text style={styles.titleSession}>Fin</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={showTimePicker}
                  >
                    <Text style={styles.textDateButton}>{timeReservation}</Text>
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

            <View style={styles.paymentView}>
              <View style={styles.titlePayment}>
                <Text style={styles.titlePaymentTxt}>Mode de paiement</Text>
              </View>

              <View style={styles.centeredView}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalTitle}>
                        Selectionnez un type de paiement
                      </Text>
                      <TouchableOpacity
                        style={styles.btnPaymentMode}
                        onPress={() => {
                          setModalVisible(!modalVisible);
                          setPaymentChoose("Solde EEVY");
                          setSoldeVisible(true);
                        }}
                      >
                        <Text style={styles.textStyle}>Solde EEVY</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.btnPaymentMode}
                        onPress={() => {
                          setModalVisible(!modalVisible);
                          setPaymentChoose("Carte Bancaire");
                          setSoldeVisible(false);
                        }}
                      >
                        <Text style={styles.textStyle}>Carte Bancaire</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
              <View style={styles.payementStyle}>
                <TouchableOpacity
                  style={styles.btnPaymentChoose}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.btnPaymentChooseTxt}>
                    {paymentChoose}
                  </Text>
                </TouchableOpacity>
                {soldeVisible ? (
                  <Text style={styles.textStyleSolde}>
                    {" "}
                    Solde: {Number(user.balance).toFixed(2)}{" "}
                  </Text>
                ) : null}
                <Text style={styles.textStyleTotal}> Total: {total} €</Text>
              </View>
            </View>

            {/* Charger Not Available Modal-------------------------------------------------- */}

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalNotAvailableVisible}
              onRequestClose={() => {
                setModalNotAvailableVisible(!modalNotAvailableVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>
                    La borne de recharge n'est pas disponible à ces horraires 😢
                  </Text>
                  <TouchableOpacity
                    style={styles.btnPaymentMode}
                    onPress={() => {
                      setModalNotAvailableVisible(!modalNotAvailableVisible);
                    }}
                  >
                    <Text style={styles.textStyle}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Reservation done Modal ! -------------------------------------------------- */}

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalChargeurReserved}
              onRequestClose={() => {
                setModalChargeurReserved(!modalChargeurReserved);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>
                    Félicitations ! Votre réservation a bien été effectuée ! 😀
                  </Text>
                  <TouchableOpacity
                    style={styles.btnPaymentMode}
                    onPress={() => {
                      props.setModalReservationVisible(
                        !props.modalReservationVisible
                      );
                      setModalChargeurReserved(!modalChargeurReserved);
                    }}
                  >
                    <Text style={styles.textStyle}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Book/Return  Container-------------------------------------------------- */}

            <View style={styles.viewBtnsActions}>
              <TouchableOpacity
                onPress={() => {
                  handleBack();
                }}
                style={styles.btnsActionsReturn}
              >
                <Text style={styles.btnsActionsTxtReturn}>Retour</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleBook()}
                style={styles.btnsActions}
              >
                <Text style={styles.btnsActionsTxt}>Reserver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

/* StyleSheet-------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },

  containerPage: {
    flex: 1,
    backgroundColor: "#121F3A",
    alignItems: "center",
    justifyContent: "center",
  },

  //Fiche Owner

  chargerOwnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: "20%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: "#121F3A",
    marginTop: 20,
  },

  chargerOwner: {
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },

  profilPicture: {
    width: 60,
    height: 60,
    borderRadius: 20,
    marginTop: 5,
  },

  username: {
    // fontFamily: "Roboto",
    height: 50,
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
    width: "100%",
    textAlign: "center",
    marginTop: 10,
  },

  stars: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  ratings: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
  },

  rateNumber: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },

  ratingsButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00D369",
    borderRadius: 10,
    marginTop: 15,
    width: "100%",
    height: 30,
  },

  textButtonRating: {
    // fontFamily: "Roboto",
    fontWeight: "600",
    fontSize: 16,
    color: "#fff",
  },

  //Page

  titleInfos: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: "70%",
  },

  titleInfosTxt: {
    // fontFamily: "Roboto",
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
  },

  viewIconsBorne: {
    alignItems: "flex-start",
    justifyContent: "space-around",
  },

  informationsContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginTop: -20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#EDE8E8",
    height: "32%",
  },

  informations: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },

  informationchargeur: {
    borderRadius: 10,
    padding: 10,
    width: "70%",
  },

  textInformationLabel: {
    // fontFamily: "Roboto",
    fontWeight: "700",
    fontSize: 16,
    width: "100%",
  },

  textInformation: {
    // fontFamily: "Roboto",
    fontWeight: "500",
    fontSize: 14,
    marginTop: 5,
    width: "100%",
  },

  favorite: { marginLeft: 5 },

  // Datetime

  recap: {
    backgroundColor: "#EDE8E8",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    margin: 20,
    borderRadius: 10,
  },

  dateTimeDuration: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  datePicker: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },

  title: {
    width: 75,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  titleFin: {
    width: 75,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  titleSession: {
    // fontFamily: "Roboto",
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
  },

  dateButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "70%",
    backgroundColor: "#00D369",
    borderRadius: 10,
    padding: 5,
  },

  textDateButton: {
    // fontFamily: "Roboto",
    fontWeight: "600",
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },

  // Paiement

  paymentView: {
    backgroundColor: "#EDE8E8",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    borderRadius: 10,
    padding: 10,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  titlePayment: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },

  titlePaymentTxt: {
    // fontFamily: "Roboto",
    fontWeight: "600",
    fontSize: 18,
  },

  btnPaymentChoose: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    backgroundColor: "#00D369",
    borderRadius: 10,
    padding: 10,
  },

  btnPaymentChooseTxt: {
    // fontFamily: "Roboto",
    fontWeight: "600",
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },

  btnPaymentMode: {
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    backgroundColor: "#00D369",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
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
  payementStyle: {
    flexDirection: "row",
    marginHorizontal: 10,
    alignItems: "center",
    width: "100%",
    justifyContent: "space-evenly",
  },

  textStyleSolde: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },

  textStyleTotal: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },

  // Bouttons

  viewBtnsActions: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 100,
  },

  btnsActions: {
    alignItems: "center",
    width: "40%",
    backgroundColor: "#00D369",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },

  btnsActionsReturn: {
    alignItems: "center",
    width: "40%",
    backgroundColor: "#EDE8E8",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },

  btnsActionsTxtReturn: {
    // fontFamily: "Roboto",
    fontWeight: "700",
    fontSize: 20,
    color: "#000000",
    textAlign: "center",
  },

  btnsActionsTxt: {
    // fontFamily: "Roboto",
    fontWeight: "700",
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },

  //
  //
  //
  //
  //

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

  button: {
    alignItems: "center",
    paddingTop: 8,
    width: "80%",
    backgroundColor: "#00D369",
    borderRadius: 10,
    marginBottom: 10,
  },

  buttonBook: {
    alignItems: "center",
    paddingTop: 4,
    width: "100%",
    height: "40%",
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

  titleInformation: {
    // fontFamily: "Roboto",
    height: 26,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
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

  durationModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 140,
    width: 60,
    height: 80,
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
});

export default ModalBorneReservation;
