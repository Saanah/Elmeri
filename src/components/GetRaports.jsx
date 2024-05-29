import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, child } from 'firebase/database';
import Header from './Header';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import './GetRaports.css';

function GetRaports() {
  const [data, setData] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [inspectors, setInspectors] = useState([]);

  useEffect(() => {
    fetchData();
    fetchInspectors();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const database = getDatabase();
      const databaseRef = ref(database);
      const snapshot = await get(databaseRef);

      if (snapshot.exists()) {
        let fetchedData = snapshot.val();

        // Exclude "Inspectors" data
        if (fetchedData.hasOwnProperty('Inspectors')) {
          delete fetchedData['Inspectors'];
        }

        if (selectedDate) {
          for (let date in fetchedData) {
            if (date !== selectedDate) {
              delete fetchedData[date];
            }
          }
        }
        setData(fetchedData);
        setLoading(false);
      } else {
        console.error('No data available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchInspectors = async () => {
    try {
      const database = getDatabase();
      const databaseRef = ref(database, `Inspectors/${selectedDate}`);
      const snapshot = await get(databaseRef);

      if (snapshot.exists()) {
        const fetchedInspectors = snapshot.val();
        setInspectors(fetchedInspectors);
      } else {
        console.error('No inspectors data available for this date');
      }
    } catch (error) {
      console.error('Error fetching inspectors data:', error);
    }
  };


  const handleSelectChange = (e) => {
    const { value } = e.target;
    setSelectedDate(value); // Update selected date
  };


  const calculateInOrderValues = (data, observationNames) => {
    const inOrderValues = {};

    // Initialize inOrderValues with observation names
    observationNames.forEach(name => {
      inOrderValues[name] = { values: [], sum: 0 };
    });

    for (const dateKey in data) {
      if (data.hasOwnProperty(dateKey)) {
        const dateData = data[dateKey];
        for (const idKey in dateData) {
          if (dateData.hasOwnProperty(idKey)) {
            const rooms = dateData[idKey].rooms;
            if (rooms) {
              rooms.forEach(room => {
                const categories = room.categories;
                if (categories) {
                  categories.forEach(category => {
                    const observations = category.observations;
                    if (observations) {
                      observations.forEach(observation => {
                        if (observationNames.includes(observation.name) && observation.inOrder !== 0) {
                          inOrderValues[observation.name].values.push(observation.inOrder);
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        }
      }
    }

    // Calculate the sum of the inOrder values for each observation name
    for (const name in inOrderValues) {
      if (inOrderValues.hasOwnProperty(name)) {
        const sum = inOrderValues[name].values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        inOrderValues[name].sum = sum;
      }
    }

    return inOrderValues;
  }


  const observationNames = [
    "Suojaimet, vaatetus, riskinotto",
    "Fyysinen kuormitus",
    "Työpisteen ja välineiden ergonomia",
    "Koneiden kunto ja suojalaitteet",
    "Koneiden hallintalaitteet ja merkintä",
    "Kulkuteiden ja lattian rakenne, putoamissuojaus",
    "Poistumistiet",
    "Kulkuteiden ja lattioiden järjestys",
    "Pöydät, päällyset, hyllyt",
    "Jäteastiat",
    "Melu",
    "Valaistus",
    "Lämpöolosuhteet",
    "Ilman puhtaus ja käsiteltävät aineet"
  ];


  const calculateNotInOrderValues = (data, observationNames) => {
    const notInOrderValues = {};

    observationNames.forEach(name => {
      notInOrderValues[name] = { values: [], sum: 0 };
    });

    for (const dateKey in data) {
      if (data.hasOwnProperty(dateKey)) {
        const dateData = data[dateKey];
        for (const idKey in dateData) {
          if (dateData.hasOwnProperty(idKey)) {
            const rooms = dateData[idKey].rooms;
            if (rooms) {
              rooms.forEach(room => {
                const categories = room.categories;
                if (categories) {
                  categories.forEach(category => {
                    const observations = category.observations;
                    if (observations) {
                      observations.forEach(observation => {
                        if (observationNames.includes(observation.name) && observation.notInOrder !== 0) {
                          notInOrderValues[observation.name].values.push(observation.notInOrder);
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        }
      }
    }

    // Calculate the sum of the inOrder values for each observation name
    for (const name in notInOrderValues) {
      if (notInOrderValues.hasOwnProperty(name)) {
        const sum = notInOrderValues[name].values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        notInOrderValues[name].sum = sum;
      }
    }

    return notInOrderValues;
  }

  const inOrderValues = calculateInOrderValues(data, observationNames);
  const notInOrderValues = calculateNotInOrderValues(data, observationNames);


  const BoxContainer = () => (
    <div class="outer-container">
      <div class="box-container">
        <div class="box">
          <h2>Havaintokohteet</h2>
        </div>
        <div class="box">
          <h2>Kunnossa</h2>
        </div>
        <div class="box">
          <h2>yhteensä</h2>
        </div>
        <div class="box">
          <h2>Ei kunnossa</h2>
        </div>
        <div class="box">
          <h2>yhteensä</h2>
        </div>
      </div>
      <div class="box-container">
        <div class="box">
          <h2>Työskentely</h2>
          <p>1. Riskinotto, suojaimet, vaatetus <span class="nested-content"></span></p>
        </div>
        <div class="box">
          <p>{(inOrderValues["Suojaimet, vaatetus, riskinotto"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{inOrderValues["Suojaimet, vaatetus, riskinotto"]?.sum || 0}</p>
        </div>
        <div class="box">
          <p>{(notInOrderValues["Suojaimet, vaatetus, riskinotto"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{notInOrderValues["Suojaimet, vaatetus, riskinotto"]?.sum || 0}</p>
        </div>
      </div>
      <div class="box-container">
        <div class="box">
          <h2>Ergonomia</h2>
          <p>2. Fyysinen kuormitus<span class="nested-content"></span></p>
        </div>
        <div class="box">
          <p>{(inOrderValues["Fyysinen kuormitus"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{inOrderValues["Fyysinen kuormitus"]?.sum || 0}</p>
        </div>
        <div class="box">
          <p>{(notInOrderValues["Fyysinen kuormitus"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{notInOrderValues["Fyysinen kuormitus"]?.sum || 0}</p>
        </div>
      </div>
      <div class="box-container">
        <div class="box">
          <p>3. Työpisteiden ja -välinen
            ergonomia<span class="nested-content"></span></p>
        </div>
        <div class="box">
          <p>{(inOrderValues["Työpisteen ja välineiden ergonomia"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{inOrderValues["Työpisteen ja välineiden ergonomia"]?.sum || 0}</p>
        </div>
        <div class="box">
          <p>{(notInOrderValues["Työpisteen ja välineiden ergonomia"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{notInOrderValues["Työpisteen ja välineiden ergonomia"]?.sum || 0}</p>
        </div>
      </div>
      <div class="box-container">
        <div class="box">
          <h2>Kone- ja laiteturvallisuus</h2>
          <p>4. Koneiden kunto ja
            suojalaitteet
            <span class="nested-content"></span></p>
        </div>
        <div class="box">
          <p>{(inOrderValues["Koneiden kunto ja suojalaitteet"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{inOrderValues["Koneiden kunto ja suojalaitteet"]?.sum || 0}</p>
        </div>
        <div class="box">
          <p>{(notInOrderValues["Koneiden kunto ja suojalaitteet"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{notInOrderValues["Koneiden kunto ja suojalaitteet"]?.sum || 0}</p>
        </div>
      </div>
      <div class="box-container">
        <div class="box">
          <p>5. Koneiden hallintalaitteet ja
            merkinnät
            <span class="nested-content"></span></p>
        </div>
        <div class="box">
          <p>{(inOrderValues["Koneiden hallintalaitteet ja merkintä"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{inOrderValues["Koneiden hallintalaitteet ja merkintä"]?.sum || 0}</p>
        </div>
        <div class="box">
          <p>{(notInOrderValues["Koneiden hallintalaitteet ja merkintä"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{notInOrderValues["Koneiden hallintalaitteet ja merkintä"]?.sum || 0}</p>
        </div>
      </div>
      <div class="box-container">
        <div class="box">
          <h2>Liikkumistur
            vallisuus</h2>
          <p>6. Kulkuteiden ja lattioiden
            rakenne, putoamissuojaus
            <span class="nested-content"></span></p>
        </div>
        <div class="box">
          <p>{(inOrderValues["Kulkuteiden ja lattian rakenne, putoamissuojaus"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{inOrderValues["Kulkuteiden ja lattian rakenne, putoamissuojaus"]?.sum || 0}</p>
        </div>
        <div class="box">
          <p>{(notInOrderValues["Kulkuteiden ja lattian rakenne, putoamissuojaus"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{notInOrderValues["Kulkuteiden ja lattian rakenne, putoamissuojaus"]?.sum || 0}</p>
        </div>
      </div>
      <div class="box-container">
        <div class="box">
          <p>7. Poistumistiet
            <span class="nested-content"></span></p>
        </div>
        <div class="box">
          <p>{(inOrderValues["Poistumistiet"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{inOrderValues["Poistumistiet"]?.sum || 0}</p>
        </div>
        <div class="box">
          <p>{(notInOrderValues["Poistumistiet"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{notInOrderValues["Poistumistiet"]?.sum || 0}</p>
        </div>
      </div>
      <div class="box-container">
        <div class="box">
          <h2>Järjestys</h2>
          <p>8. Kulkuteiden ja lattioiden
            järjestys

            <span class="nested-content"></span></p>
        </div>
        <div class="box">
          <p>{(inOrderValues["Kulkuteiden ja lattioiden järjestys"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{inOrderValues["Kulkuteiden ja lattioiden järjestys"]?.sum || 0}</p>
        </div>
        <div class="box">
          <p>{(notInOrderValues["Kulkuteiden ja lattioiden järjestys"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{notInOrderValues["Kulkuteiden ja lattioiden järjestys"]?.sum || 0}</p>
        </div>
      </div>
      <div class="box-container">
        <div class="box">
          <p>9. Pöydät, päälliset ja hyllyt
            <span class="nested-content"></span></p>
        </div>
        <div class="box">
          <p>{(inOrderValues["Pöydät, päällyset, hyllyt"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{inOrderValues["Pöydät, päällyset, hyllyt"]?.sum || 0}</p>
        </div>
        <div class="box">
          <p>{(notInOrderValues["Pöydät, päällyset, hyllyt"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{notInOrderValues["Pöydät, päällyset, hyllyt"]?.sum || 0}</p>
        </div>
      </div>
      <div class="box-container">
        <div class="box">
          <p>10. Jäteastiat
            <span class="nested-content"></span></p>
        </div>
        <div class="box">
          <p>{(inOrderValues["Jäteastiat"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{inOrderValues["Jäteastiat"]?.sum || 0}</p>
        </div>
        <div class="box">
          <p>{(notInOrderValues["Jäteastiat"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{notInOrderValues["Jäteastiat"]?.sum || 0}</p>
        </div>
      </div>
      <div class="box-container">
        <div class="box">
          <h2>Työympäristö
            tekijät</h2>
          <p>11. Melu
            <span class="nested-content"></span></p>
        </div>
        <div class="box">
          <p>{(inOrderValues["Melu"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{inOrderValues["Melu"]?.sum || 0}</p>
        </div>
        <div class="box">
          <p>{(notInOrderValues["Melu"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{notInOrderValues["Melu"]?.sum || 0}</p>
        </div>
      </div>
      <div class="box-container">
        <div class="box">
          <p>12. Valaistus
            <span class="nested-content"></span></p>
        </div>
        <div class="box">
          <p>{(inOrderValues["Valaistus"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{inOrderValues["Valaistus"]?.sum || 0}</p>
        </div>
        <div class="box">
          <p>{(notInOrderValues["Valaistus"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{notInOrderValues["Valaistus"]?.sum || 0}</p>
        </div>
      </div>
      <div class="box-container">
        <div class="box">
          <p>13. Lämpöolosuhteet
            <span class="nested-content"></span></p>
        </div>
        <div class="box">
          <p>{(inOrderValues["Lämpöolosuhteet"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{inOrderValues["Lämpöolosuhteet"]?.sum || 0}</p>
        </div>
        <div class="box">
          <p>{(notInOrderValues["Lämpöolosuhteet"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{notInOrderValues["Lämpöolosuhteet"]?.sum || 0}</p>
        </div>
      </div>
      <div class="box-container">
        <div class="box">
          <p>14. Ilman puhtaus ja käsiteltävät
            aineet

            <span class="nested-content"></span></p>
        </div>
        <div class="box">
          <p>{(inOrderValues["Ilman puhtaus ja käsiteltävät aineet"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{inOrderValues["Ilman puhtaus ja käsiteltävät aineet"]?.sum || 0}</p>
        </div>
        <div class="box">
          <p>{(notInOrderValues["Ilman puhtaus ja käsiteltävät aineet"]?.values || []).join('+')}</p>
        </div>
        <div class="box">
          <p>{notInOrderValues["Ilman puhtaus ja käsiteltävät aineet"]?.sum || 0}</p>
        </div>
      </div>
    </div>
  );

  const BoxContainerExpections = () => {
    console.log("Initial data:", data);

    const dataArray = Object.entries(data).flatMap(([date, value]) =>
      Object.values(value).flatMap(item =>
        item.rooms?.flatMap(room =>
          room.categories?.flatMap(category =>
            category.observations?.flatMap(observation =>
              observation.exceptions?.map(exception => ({
                date,
                ongelma: exception.ongelma,
                vastuutaho: exception.vastuu,
                kiireellisyys: exception.urgency,
                name: room.name
              })) ?? []
            ) ?? []
          ) ?? []
        ) ?? []
      ) ?? []
    );

    console.log("Final dataArray:", dataArray);

    return (
      <div className="outer-container">
        <div className="box-container">
          <div className="boxExpection">
            <p>Tilan numero ja havaittu poikkeama ja toimenpiteet</p>
          </div>
          <div className="box">
            <p>vastuutaho</p>
          </div>
          <div className="box">
            <p>kiireellisyys</p>
          </div>
        </div>
        {dataArray.map((classData, index) => (
          <div key={index} className="box-container">
            <div className="boxExpection">
              <p>{classData.name} / {classData.ongelma}</p>
            </div>
            <div className="box">
              <p>{classData.vastuutaho}</p>
            </div>
            <div className="box">
              <p>{classData.kiireellisyys}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };



  return (
    <div>
      {selectedDate ? (
        // This will be displayed when a date is selected
        <>
          <div className="a4-container">
            <div className="image-container">
              <img src="oamk.png" alt="My Image" className="centered-image" />
            </div>
            <h3 className="left-header">Havainnoitsijat: {Array.isArray(inspectors) ? inspectors.join(',') : ''}</h3>
            <div className="header-container">
              <h3 className="left-heading">Elmeri havaintolomake     /2</h3>
              <h3 className="right-heading">Päiväys {selectedDate}</h3>
            </div>
            <BoxContainer></BoxContainer>


          </div>
          <div className="a4-container">
            <div className="image-container">
              <img src="oamk.png" alt="My Image" className="centered-image" />
            </div>
            <h3 className="left-header">Havainnoitsijat: {Array.isArray(inspectors) ? inspectors.join(',') : ''}</h3>
            <div className="header-container">
              <h3 className="left-heading">Elmeri havaintolomake     /2</h3>
              <h3 className="right-heading">Päiväys {selectedDate}</h3>
            </div>
            <BoxContainerExpections></BoxContainerExpections>
          </div>
        </>
      ) : (
        <div>
          <Header />
          <h2>Raports</h2>
          {!loading && data && Object.keys(data).length > 0 && (
            <>
              <select value={selectedDate} onChange={handleSelectChange}>
                <option value="">Select a Date</option>
                {Object.keys(data).map((date) => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </>
          )}
          {loading && <p>Loading...</p>}
          {!loading && !data && <p>No data available</p>}
        </div>
      )}
    </div>
  );
}

export default GetRaports;
