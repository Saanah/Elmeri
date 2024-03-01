import React, { useState, useEffect } from 'react';
import Header from './Header';


function GetRaports() {
  const [data, setData] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data when component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Make a fetch request to your database endpoint
      const response = await fetch('https://elmeri-firebase-default-rtdb.europe-west1.firebasedatabase.app/Data.json');

      // Check if the request was successful
      if (response.ok) {
        // Parse the JSON response
        const fetchedData = await response.json();
        // Set the data state with the fetched data
        setData(fetchedData);
        setLoading(false); // Set loading to false when data is fetched
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSelectChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
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
          {selectedDate && (
            <div>
              <h3>Data for Date: {selectedDate}</h3>
              <pre>{JSON.stringify(data[selectedDate], null, 2)}</pre>
            </div>
          )}
        </>
      )}
      {loading && <p>Loading...</p>}
      {!loading && !data && <p>No data available</p>}
    </div>
  );
}

export default GetRaports;