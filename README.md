# ELMERI - TARKISTUSKIERROKSET

Nettisivu, jonka tarkoituksena on helpottaa OAMKin labrojen tarkistuskierrosten suorittamista ja tulosten analysointia. Tehty osana OAMKin yritysprojektikurssia.

## Toiminta

Nettisivulla voidaan luoda uusia raportteja digitaalisesti. Suoritetuista tarkastuskierroksista tallennetaan sekä PDF-muotoinen raportti että raportin raakadata Firebaseen. Tehtyjä raportteja voidaan myös selata nettisivulta päivämäärän mukaan.

## Käytetyt teknologiat

Frontend: React-kirjasto. <br> Backend: Firebase Realtime Database.

## Sovelluksen käyttöönotto.

Sovelluksen saat käyttöön kun lataat tiedoston (Git Clone tai Download Zip) ja tiedoston sisällä teet npm install tämän jälkeen voit käynnistää sovelluksen käyttämällä komentoa npm start.

## Sovellukseen tehty database

Sovelluksen datan lähettäminen Firebaseen on tehty esimerkillä käyttäen URL-toimintoa, tämä muokataan niin, että Queryt toimivat Firebase SDK avulla.
Firebase SDK-toteutukseen löytyy malli Firebase-branchista Firebase.js tiedostosta.
