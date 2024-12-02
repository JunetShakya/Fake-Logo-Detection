'use client';
import React, { useState } from "react";
import "./home.css"; 

export const HomeComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if a file is selected
    if (!selectedFile) {
      alert("Please upload a logo image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile); // Ensure this matches the key in the Flask app

    try {
      const response = await fetch('http://127.0.0.1:5000/test', { // Update to your Flask API URL
        method: 'POST',
        body: formData,
      });

      // Check if response is okay
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from server:", errorText);
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const data = await response.json();
      console.log(data);

      // Display predicted class and probabilities
      if (data.error) {
        setResult(`Error: ${data.error}`);
      } else {
        setResult(`Predicted class: ${data.predicted_class}, Probabilities: Fake: ${data.probabilities.Fake.toFixed(4)}, Genuine: ${data.probabilities.Genuine.toFixed(4)}`);
      }
    } catch (error) {
      console.error("Error detecting logo:", error);
      setResult("Error detecting logo");
    }
  };

  return (
    <div className="container">
      <h1>Fake Logo Detector</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Detect Logo</button>
      </form>
      {selectedFile && (
        <div>
          <h3>Uploaded Image:</h3>
          <img
            src={URL.createObjectURL(selectedFile)} // Create a URL for the uploaded image
            alt="Uploaded Preview"
            style={{ width: "300px", height: "auto", marginTop: "10px" }} // Adjust styling as needed
          />
        </div>
      )}
      {result && <p>Detection Result: {result}</p>}
    </div>
  );
};
