import "./App.css";
import Etusivu from "./components/Etusivu";
import Tarkastuskohdat from "./components/Tarkastuskohdat";
import { Routes, Route } from 'react-router-dom';
import CreateNewRaport from "./components/CreateNewRaport";

function App() {
  return (
  <Routes>
    <Route path="/" element={<Etusivu/>}></Route>
    <Route path="/tarkastuskohdat" element={<Tarkastuskohdat/>}></Route>
    <Route path="/luo_uusi_raportti" element={<CreateNewRaport/>}></Route>
  </Routes>
  );
}

export default App;

