import "./App.css";
import Etusivu from "./components/Etusivu";
import Tarkastuskohdat from "./components/Tarkastuskohdat";
import { Routes, Route } from 'react-router-dom';
import CreateNewRaport from "./components/CreateNewRaport";
import RaporttiHistoria from "./components/RaporttiHistoria";

function App() {
  return (
  <Routes>
    <Route path="/" element={<Etusivu/>}></Route>
    <Route path="/tarkastuskohdat" element={<Tarkastuskohdat/>}></Route>
    <Route path="/luo_uusi_raportti" element={<CreateNewRaport/>}></Route>
    <Route path="/raportit" element={<RaporttiHistoria/>}></Route>
  </Routes>
  );
}

export default App;

