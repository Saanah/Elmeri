# ELMERI - TARKISTUSKIERROKSET

Nettisivu, jonka tarkoituksena on helpottaa OAMKin labrojen tarkistuskierrosten suorittamista ja tulosten analysointia. Tehty osana OAMKin yritysprojektikurssia.

## Toiminta

Nettisivulla voidaan luoda uusia raportteja digitaalisesti. Suoritetuista tarkastuskierroksista tallennetaan raakadata Firebaseen ja haetusta datasta muodostetaan PDF-dokumentti clientissa tarvittaessa. Tehtyjen raporttien JSON-dataa voidaan myös selata nettisivulta päivämäärän mukaan.

## Käytetyt teknologiat

Frontend: React-kirjasto. <br> Backend: Firebase Realtime Database.

## Sovelluksen käyttöönotto.

Sovelluksen saat käyttöön, kun lataat tiedoston (Git Clone tai Download Zip) ja tiedoston sisällä teet npm install (tarvittaessa lisää --legacy-peer-deps). Tämän jälkeen voit käynnistää sovelluksen käyttämällä komentoa npm start.

## Sovellukseen tehty database

Sovelluksen datan lähettäminen Firebaseen on tehty esimerkillä käyttäen URL-toimintoa, tämä muokataan niin, että Queryt toimivat Firebase SDK avulla.
Firebase SDK-toteutukseen löytyy malli Firebase-branchista Firebase.js tiedostosta.

## KORJATTAVAA
Projektissa on ylimääräisiä dependencyjä. Turhat dependencyt täytyy etsiä ja poistaa. (good luck)
<br>
<br>
Käytössäolevat depsit:
<br>
React useState, useEffect, React Router
<br>
Material UI MUI -komponentit
<br>
Firebase
