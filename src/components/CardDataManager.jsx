import React from "react";
import { exportCards, importCards, getAllCards } from "../db";
import { fetchMultipleCards } from "../services/cardService"; // Import the new function

function CardDataManager({ setCards }) {
  const handleExport = async () => {
    const cards = await exportCards();
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["id", "name", "count", "addedAt", "lastUpdated"].join(",") +
      "\n" +
      cards
        .map(
          (card) =>
            `${card.id},"${card.name.replace(/"/g, '""')}",${card.count},${
              card.addedAt || ""
            },${card.lastUpdated || ""}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const date = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mtg-card-tracker_export_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvContent = e.target.result;
      if (typeof csvContent !== "string") {
        console.error("File content is not a string");
        return;
      }
      const lines = csvContent.split("\n");
      const headers = lines[0].split(",");

      const cardIdentifiers = [];
      const originalCards = []; // Store original card data
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!values) continue;

        const card = {};
        headers.forEach((header, index) => {
          card[header.trim()] = values[index]
            ? values[index].replace(/^"|"$/g, "").replace(/""/g, '"').trim()
            : "";
        });

        if (card.id) {
          cardIdentifiers.push({ id: card.id });
          originalCards.push(card); // Keep the original card data
        }
      }

      // Fetch additional details for all cards by their IDs
      const additionalDetailsList = await fetchMultipleCards(cardIdentifiers);

      // Merge additional details with the original card data
      const cards = additionalDetailsList.map((additionalDetails) => {
        const originalCard = originalCards.find(
          (card) => card.id === additionalDetails.id
        );
        return { ...originalCard, ...additionalDetails };
      });

      // Import all cards at once
      await importCards(cards);

      // Set all cards at once
      const updatedCards = await getAllCards();
      setCards(updatedCards);
    };
    reader.readAsText(file); // Ensure the file is read as text
  };

  return (
    <div>
      <button onClick={handleExport}>Export Cards</button>
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
}

export default CardDataManager;
