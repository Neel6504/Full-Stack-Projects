import React, { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",           // full screen height
        backgroundColor: "#f5f5f5" // optional soft background
      }}
    >
      <div style={{ 
        textAlign: "center", 
        fontFamily: "Arial",
        padding: "40px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "500px"
      }}>
        <h2 style={{ margin: "0 0 20px 0" }}>Count: {count}</h2>
        <div style={{ marginBottom: "30px" }}>
          <button onClick={() => setCount(0)} style={{ margin: "5px", padding: "8px 16px" }}>Reset</button>
          <button onClick={() => setCount(count + 1)} style={{ margin: "5px", padding: "8px 16px" }}>Increment</button>
          <button onClick={() => setCount(count - 1)} style={{ margin: "5px", padding: "8px 16px" }}>Decrement</button>
          <button onClick={() => setCount(count + 5)} style={{ margin: "5px", padding: "8px 16px" }}>Increment 5</button>
        </div>

        <h1 style={{ margin: "20px 0", color: "#333" }}>Welcome to CHARUSAT!!!</h1>

        <div style={{ marginTop: "30px" }}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <span>First Name:</span>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <span>Last Name:</span>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </label>
          </div>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h3 style={{ margin: "10px 0", color: "#555" }}>First Name: {firstName}</h3>
          <h3 style={{ margin: "10px 0", color: "#555" }}>Last Name: {lastName}</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
