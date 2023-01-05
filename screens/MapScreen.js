import {
  Modal,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Switch,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPlace } from "../reducers/user";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { updateReservation } from "../reducers/reservation";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ModalBorneReservation from "./ModalBorneReservation";

export default function MapScreen({ navigation }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const [chargersData, setChargersData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newPlace, setNewPlace] = useState("");
  // CALENDAR DATE PICKER
  const [date, setDate] = useState(new Date());
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState(new Date());

  const [address, setAddress] = useState(null);
  const BACKENDURL = useSelector((state) => state.constants.value.BACKENDURL);
  const [searchPosition, setSearchPosition] = useState({});

  const [modalReservationVisible, setModalReservationVisible] = useState(false);
  const [borneClicked, setBorneClicked] = useState(null);
  const [favoritesVisible, setFavoritesVisible] = useState(false);

  const [from, setFrom] = useState("Date et heure de début ");
  const [to, setTo] = useState("Heure de fin");

  useEffect(() => {
    getChargersData();
  }, [user.reservations, user.chargers]);

  const getChargersData = async () => {
    const response = await fetch(`${BACKENDURL}/chargers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        email: user.email,
      }),
    });

    const data = await response.json();

    if (data.result) {
      setChargersData(data.chargers);
    } else {
      alert(data.error);
    }
  };

  const makeAReservation = async () => {
    let datestr = moment(date).format("YYYY-MM-DD");
    let timestr = moment(time).format("HH:mm");
    const startingTime = `${datestr} ${timestr}`;
    const durationstr = moment(duration).format("HH:mm");
    const endingTime = `${datestr} ${durationstr}`;
    setFrom(startingTime);
    setTo(endingTime);

    const response = await fetch(`${BACKENDURL}/chargers/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        email: user.email,
        from: startingTime,
        to: endingTime,
      }),
    });

    const data = await response.json();
    if (data.result) {
      setChargersData(data.chargers);
    } else {
      alert(data.error);
    }
  };

  useEffect(() => {
    //RECHERCHE DE LA POSITION DE LUTILISATEUR
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        Location.watchPositionAsync(
          { distanceInterval: 10 },
          async (location) => {
            // SET DE LETAT AVEC TOUT LOBJET COORDS
            setCurrentPosition(location.coords);
            await getChargersData();
          }
        );
      }
    })();
  }, [user.AllReservation]);

  const stations = chargersData.map((data) => {
    const iconName = data.available
      ? require("../assets/station-location-full-large-green.png")
      : require("../assets/station-location-full-large-red.png");
    return (
      <Marker
        key={data._id}
        coordinate={{ latitude: data.latitude, longitude: data.longitude }}
        title={`${data.pricePerHour} €/h`}
        description={`${data.power} kW`}
        onCalloutPress={() => {
          handleCalloutPress(data._id);
          setBorneClicked(data);
          setModalReservationVisible(!modalReservationVisible);
        }}
      >
        <Image
          source={iconName}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />
      </Marker>
    );
  });

  const handleCalloutPress = (chargerID) => {
    let datestr = moment(date).format("YYYY-MM-DD");
    let timestr = moment(time).format("HH:mm");
    const startingTime = `${datestr} ${timestr}`;
    const durationstr = moment(duration).format("HH:mm");
    const endingTime = `${datestr} ${durationstr}`;
    setFrom(startingTime);
    setTo(endingTime);

    dispatch(updateReservation({ chargerID, from, to }));
    navigation.navigate("TabNavigator", { screen: "Reservation" });
  };

  const closeCalendar = () => {
    setDateTimePickerVisible(false);
    setTimePickerVisible(false);
  };

  const handleEndEditing = async () => {
    const response = await fetch(`${BACKENDURL}/cityCoord/${address}`);
    const data = await response.json();

    if (data.result) {
      setSearchPosition({
        latitude: data.latitude,
        longitude: data.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const renderFavorites = async () => {
    setFavoritesVisible(!favoritesVisible);
    if (favoritesVisible) {
      const response = await fetch(`${BACKENDURL}/users/favoriteChargers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: user.token,
          email: user.email,
        }),
      });
      const data = await response.json();

      const favoriteChargers = data.favorites.map((c) => c._id);
      setChargersData(
        chargersData.filter((st) => favoriteChargers.includes(st._id))
      );
    } else {
      getChargersData();
    }
  };

  const modalCalendar = (
    <Modal visible={dateTimePickerVisible} animationType="fade" transparent>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.iconRetour}
            onPress={() => closeCalendar()}
          >
            <MaterialIcons name="keyboard-arrow-left" size={40} color="white" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>
            Choisissez une date et un horaire pour votre réservation
          </Text>

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            <View>
              <Text style={styles.modalTxt}>Date</Text>
              <DateTimePicker
                value={date}
                minimumDate={new Date()}
                onChange={(e, selectedDate) => {
                  const currentDate = selectedDate || date;
                  setDate(currentDate);
                }}
              ></DateTimePicker>
            </View>

            <View>
              <Text style={styles.modalTxt}>Début</Text>
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                onChange={(e, selectedTime) => {
                  const currentTime = selectedTime || time;
                  setTime(currentTime);
                }}
              ></DateTimePicker>
            </View>

            <View>
              <Text style={styles.modalTxt}>Fin</Text>
              <DateTimePicker
                value={duration}
                mode="time"
                is24Hour={true}
                onChange={(e, selectedTime) => {
                  const currentDuration = selectedTime || time;
                  setDuration(currentDuration);
                }}
              ></DateTimePicker>
            </View>
          </View>

          <TouchableOpacity
            style={styles.btnContinueModal}
            onPress={() => {
              closeCalendar();
              makeAReservation();
            }}
          >
            <Text style={styles.btnTxt}>Rechercher les bornes disponibles</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (modalReservationVisible) {
    return (
      <ModalBorneReservation
        modalReservationVisible={modalReservationVisible}
        setModalReservationVisible={setModalReservationVisible}
        borneClicked={borneClicked}
        from={from}
        to={to}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        {currentPosition === null ? (
          <MapView mapType="hybrid" style={styles.map} showsUserLocation>
            {stations}
          </MapView>
        ) : (
          <MapView
            mapType="hybrid"
            style={styles.map}
            region={{
              latitude: searchPosition.latitude
                ? searchPosition.latitude
                : currentPosition.latitude,
              longitude: searchPosition.longitude
                ? searchPosition.longitude
                : currentPosition.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation
          >
            {stations}
          </MapView>
        )}
        <View style={styles.topBar}>
          <TextInput
            style={styles.inputAdress}
            placeholder="Rechercher une adresse"
            onChangeText={(place) => setAddress(place)}
            onEndEditing={handleEndEditing}
            value={address}
            returnKeyType="search"
          />

          {modalCalendar}

          <TouchableOpacity
            style={styles.searchButton}
            title="Press"
            onPress={() => {
              setDateTimePickerVisible(true);
            }}
          >
            <FontAwesome name="search" size={25} color="#00D369" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.heartButton}
          title="Press"
          onPress={() => renderFavorites()}
        >
          <FontAwesome name="heart" size={25} color="#00D369" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#4FB8FF",
    opacity: 0.6,
    width: "55%",
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

  container: {
    flex: 1,
    backgroundColor: "white",
  },

  map: {
    flex: 1,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    width: "85%",
    justifyContent: "space-between",
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

  iconRetour: { position: "absolute", left: 10, top: 10 },

  modalTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
    marginTop: 30,
    textAlign: "center",
    marginBottom: 40,
  },

  modalTxt: { color: "white", textAlign: "center", marginBottom: 5 },

  btnContinueModal: {
    height: 40,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00D369",
    padding: 10,
    marginTop: 50,
  },

  btnTxt: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },

  input: {
    width: 150,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    fontSize: 16,
  },

  button: {
    width: 150,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: "#ec6e5b",
    borderRadius: 10,
  },

  textButton: {
    color: "#ffffff",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },

  activate: {
    flex: 0.08,
    backgroundColor: "#E9E9E9",
    marginTop: "4%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginLeft: "5%",
    borderRadius: "10px",
  },

  textActivate: {
    marginLeft: "5%",
  },

  inputAdress: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 10,
    height: "100%",
    textAlign: "center",
  },

  searchButton: {
    width: "13%",
    backgroundColor: "white",
    borderRadius: 10,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  calendar: {
    width: "13%",
    backgroundColor: "white",
    borderRadius: 10,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  topBar: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    left: "2%",
    top: "6%",
    height: "6%",
    width: "95%",
  },

  heartButton: {
    position: "absolute",
    bottom: 120,
    left: "80%",
    width: "15%",
    backgroundColor: "white",
    borderRadius: 10,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  dateTimePickerContainer: {
    height: 120,
    width: 130,
    backgroundColor: "white",
    borderRadius: 20,
  },

  dateView: {
    position: "absolute",
    top: "50%",
    left: "46%",
  },

  timeView: {
    top: "15%",
    left: "60%",
  },

  dateTimePickerText: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
