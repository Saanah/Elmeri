import React from "react";
import JSONDummyData from "../test.json";
import { Button } from "@mui/material";
import {
  firestoreDb,
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
} from "../firebase";

export default function RaportRawDataFirestore() {
  const raportRawDataCollection = collection(firestoreDb, "raport_raw_data");
  const raportData = JSONDummyData;  //Täytyy tulevaisuudessa vaihtaa inputtien datoihin

  //Tietojen lataus firestoreen
  async function uploadRawRaportDataToFirestore() {
    try {
      const docRef = await addDoc(raportRawDataCollection, raportData);
      const id = docRef.id;
      console.log(`Raport data uploaded successfully with id of ${id}!`);
      await setDoc(doc(firestoreDb, `raport_raw_data/${id}`), { id }, { merge: true }); //generoidun id:n lisääminen dokumenttiin
    }
    catch (error) {
      console.error("Error uploading raport data:", error);
    }
  }

  //Tietojen haku ja loggaus konsoliin (lähinnä testaukseen)
  async function fetchAndLogRaportDataFromFirestore() {
    try {
      const raportRawDataSnapshot = await getDocs(raportRawDataCollection);
      const fetchedRaportData = raportRawDataSnapshot.docs.map((doc) => doc.data());
      console.log("Fetched data:");
      console.log(JSON.stringify(fetchedRaportData, null, 2));
    }
    catch (error) {
      console.error("Error fetching raport data:", error);
    }
  }

  return (
    <div>
      <Button onClick={uploadRawRaportDataToFirestore}>
        Upload raw data to firestore (TEST BUTTON)
      </Button>
      <Button onClick={fetchAndLogRaportDataFromFirestore}>
        Fetch raw data from firestore (TEST BUTTON)
      </Button>
    </div>
  );
}
