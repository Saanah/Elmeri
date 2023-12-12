import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import {
  storageRef,
  ref,
  deleteObject,
  doc,
  deleteDoc,
  firestoreDb,
} from "../firebase";

export default function Dialogi({ name, id }) {
  const [isOpen, setOpen] = useState(false);
  const filePath = `raports/${name}`;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFirebaseDelete = () => {
    const metadataDocRef = doc(firestoreDb, "raports", id);

    //Poista tiedoston metatiedot Firestoresta
    deleteDoc(metadataDocRef)
      .then(() => {
        console.log("Tiedoston metatiedot poistettu Firestoresta.");

        //Poista tiedosto Firebase storagesta
        const fileRef = ref(storageRef, filePath);
        deleteObject(fileRef)
          .then(() => {
            console.log("Tiedosto poistettu Firebase Storagesta.");
            window.location.reload(); //Would be better as state transition refresh
          })
          .catch((error) => {
            console.log(
              "Poisto Firebase Storagesta ei onnistunut. Error: " + error
            );
          });
      })
      .catch((error) => {
        console.error("Dokumentin poisto epäonnistui. Error: ", error);
      });
  };

  return (
    <div>
      <Button
        className="errorButton"
        variant="contained"
        color="error"
        onClick={handleClickOpen}
      >
        Poista
      </Button>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Haluatko varmasti poistaa raportin?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Poista raportti pysyvästi.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ei</Button>
          <Button
            onClick={() => {
              handleClose();
              handleFirebaseDelete();
            }}
            autoFocus
          >
            Kyllä
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
