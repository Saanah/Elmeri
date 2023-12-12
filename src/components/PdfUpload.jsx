import React, { useState } from "react";
import {
  firestoreDb,
  storageRef,
  getDownloadURL,
  ref,
  uploadBytes,
} from "../firebase";
import { addDoc, collection, Timestamp, setDoc, doc } from "firebase/firestore";

export default function PdfUpload() {
  const currentDate = Timestamp.now();
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let date = `${day}.${month}.${year}`;
  let fileName = `elmeri_${date}`;

  const [selectedFile, setSelectedFile] = useState(null);

  // Tietyn raportin sijainti Firebase storagessa
  const raportRef = ref(storageRef, `/raports/${fileName}`);
  const raportsCollection = collection(firestoreDb, "raports");

  // Hae ja valitse tiedosto
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Tarkista, jos tiedosto löytyy jo Firebase storagesta
  const checkDuplicateFiles = async () => {
    try {
      // Onko kyseistä latauslinkkiä olemassa
      const url = await getDownloadURL(raportRef);
      console.log(
        "Tiedosto on jo olemassa. Ei voida lisätä Firebase storageen."
      );
      return { exists: true, url };
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        console.log(
          "Tiedostoa ei ole olemassa. Voidaan lisätä Firebase storageen."
        );
        return { exists: false, url: null };
      } else {
        console.log("Jotain meni pieleen. Error: ", error);
        throw error;
      }
    }
  };

  // Lataa tiedosto Firebase storageen
  const handleFileUploadToStorage = async () => {
    if (selectedFile) {
      // Tsekataan duplikaattien olemassaolo
      try {
        const result = await checkDuplicateFiles();
        // Tiedosto on jo olemassa, estetään duplikaatin lataus
        if (result.exists) {
          console.log(
            "Tiedosto on jo olemassa Firebase storagessa. Tiedostolinkki: ",
            result.url
          );
        } else {
          // Tiedostoa ei ole olemassa, ladataan tiedosto
          const snapshot = await uploadBytes(raportRef, selectedFile);
          console.log(
            "Tiedosto ladattu onnistuneesti Firebase storageen!",
            snapshot
          );
          const url = await getDownloadURL(raportRef);
          saveFileMetadataToFirestore(url);
        }
      } catch (error) {
        console.log(
          "Tiedoston lataus Firebase storageen epäonnistui. Error: ",
          error
        );
      }
    }
  };

  // Lisää tiedoston metadata, mm. linkki tiedostoon
  const saveFileMetadataToFirestore = async (url) => {
    const fileMetadata = {
      name: fileName,
      url: url,
      room: "Hybridilabra",
      date_created: currentDate,
    };

    try {
      const docRef = await addDoc(raportsCollection, fileMetadata);
      const id = docRef.id;
      console.log("File metadata saved to Firestore with ID: ", id);
      await setDoc(doc(firestoreDb, `raports/${id}`), { id }, { merge: true });
      window.location.reload(); // Would be better as a state transition refresh
    } catch (error) {
      console.error("Error saving metadata: ", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUploadToStorage}>Upload File</button>
    </div>
  );
}
