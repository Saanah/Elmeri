import React, { useState, useEffect } from "react";
import RaporttiKortti from "./RaporttiKortti";
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlineHome,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  firestoreDb,
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from "../firebase";

//Sivu, joka näyttää tehdyt raportit
export default function RaporttiHistoria() {
  const [isArrowDown, setArrowState] = useState(true);
  const [textValue, setTextValue] = useState("");
  const [raportMetadata, setRaportMetadata] = useState([]);

  //Etsi raporttia nimeltä (Täysin sama string, sorge)
  async function searchRaports() {
    const raportCollectionRef = collection(firestoreDb, "raports");

    try {
      const raportMetadataSnapshot = await getDocs(
        query(
          raportCollectionRef,
          where("name", "==", textValue.toLocaleLowerCase())
        )
      );

      const matchedDocuments = raportMetadataSnapshot.docs.map((doc) =>
        doc.data()
      );

      setRaportMetadata(matchedDocuments);
    } catch (error) {
      console.log("Error fetching documents: ", error);
    }
  }

  //Hae raporttien Firebase storage metadata Firestoresta päivämäärällä lajiteltuna
  async function fetchReportsByDate() {
    //Firestore raportti kokoelma, jossa metatiedot PDF-tiedostoista
    const raportCollectionRef = collection(firestoreDb, "raports");

    if (isArrowDown) {
      try {
        const raportMetadataSnapshot = await getDocs(
          query(raportCollectionRef, orderBy("date_created", "desc")) // Lajittelu uusimmasta vanhimpaan Raports-kokoelmasta
        );

        //Jono haettuja raporttiobjekteja
        const newRaportMetadata = raportMetadataSnapshot.docs.map((doc) =>
          doc.data()
        );
        //Päivitä raportMetaData state -jono raporttien metadatalla
        setRaportMetadata(newRaportMetadata);
      } catch (error) {
        console.log(
          "Firestore-dokumenttien haku ei onnistunut. Error: ",
          error
        );
      }
    } else {
      try {
        const raportMetadataSnapshot = await getDocs(
          query(raportCollectionRef, orderBy("date_created", "asc")) // Lajittelu vanhimmasta uusimpaan Raports-kokoelmasta
        );

        const newRaportMetadata = raportMetadataSnapshot.docs.map((doc) =>
          doc.data()
        );

        setRaportMetadata(newRaportMetadata);
      } catch (error) {
        console.log(
          "Firestore-dokumenttien haku ei onnistunut. Error: ",
          error
        );
      }
    }
  }

  useEffect(() => {
    fetchReportsByDate();
    if (textValue !== "" || null) searchRaports();
  }, [isArrowDown, textValue]); //Suorittaa itsensä komponentin rakentuessa

  return (
    <div className="Raporttihistoria-container">
      <div className="Header">
        <p>Raportit</p>
        <Link to="/">
          <AiOutlineHome size={28} style={{ marginTop: "30%" }} />
        </Link>
      </div>
      <input
          placeholder="Hae raporttia nimellä..."
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        ></input>
      <div className="Raportti-sorting">
        {isArrowDown ? (
          <AiOutlineArrowDown
            size={24}
            onClick={() => setArrowState(!isArrowDown)}
          />
        ) : (
          <AiOutlineArrowUp
            size={24}
            onClick={() => setArrowState(!isArrowDown)}
          />
        )}
       {/* <RaportSortDropdown />*/}
      </div>
      <div>
        {raportMetadata.map((raport) => (
          <RaporttiKortti raportData={raport} key={raport.url} />
        ))}
      </div>
    </div>
  );
}
