import React, { useState, useEffect } from "react";

function App() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer); // cleanup
  }, []);

  const dateString = dateTime.toLocaleDateString();
  const timeString = dateTime.toLocaleTimeString();

  return (
    <div style={{ marginTop: "50px", fontFamily: "Arial" }}>
      <h1>Welcome to CHARUSAT!!!!</h1>
      <h2>It is {dateString}</h2>
      <h2>It is {timeString}</h2>
    </div>
  );
}

export default App;
