import "./App.css";
import Etusivu from "./components/Etusivu";
import RaporttiHistoria from "./components/RaporttiHistoria";
import Ohjeet from "./components/Ohjeet";
import Raportinluonti from './components/Raportinluonti';
import PdfUpload from "./components/PdfUpload";
import Tarkastuskohdat from "./components/Tarkastuskohdat";
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
  <Routes>
    <Route path="/" element={<Etusivu/>}></Route>
    <Route path="/raportit" element={<RaporttiHistoria/>}></Route>
    <Route path="/tarkastuskohdat" element={<Tarkastuskohdat/>}></Route>
    <Route path="/ohjeet" element={<Ohjeet/>}></Route>
    <Route path="/luo_uusi_raportti" element={<Tarkastuskohdat/>}></Route>
  </Routes>
  );
}

export default App;

