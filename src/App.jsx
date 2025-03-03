// src/App.js
import React, { useState, useEffect } from "react";
import AutocompleteInput from "./components/AutocompleteInput";
import CardGrid from "./components/CardGrid";
import CardDataManager from "./components/CardDataManager";
import { addCard, getAllCards, removeCard } from "./db";

function App() {
  const [cards, setCards] = useState([]);
  const [isMultilingual, setIsMultilingual] = useState(false); // Default multilingual set to false

  useEffect(() => {
    const fetchCards = async () => {
      const storedCards = await getAllCards();
      setCards(storedCards);
    };
    fetchCards();
  }, []);

  const handleCardSelect = async (card) => {
    await addCard(card);
    const updatedCards = await getAllCards();
    setCards(updatedCards);
  };

  const handleAddCard = async (card) => {
    await addCard(card);
    const updatedCards = await getAllCards();
    setCards(updatedCards);
  };

  const handleRemoveCard = async (cardId) => {
    await removeCard(cardId);
    const updatedCards = await getAllCards();
    setCards(updatedCards);
  };

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-6">
        Magic: The Gathering Card Tracker
      </h1>
      <div className="mb-4">
        <label htmlFor="multilingual-checkbox" className="mr-2">
          Multilingual:
        </label>
        <input
          type="checkbox"
          id="multilingual-checkbox"
          checked={isMultilingual}
          onChange={(e) => setIsMultilingual(e.target.checked)}
          className="border p-2"
        />
        <span className="ml-2">{isMultilingual ? "Enabled" : "Disabled"}</span>
      </div>
      <CardDataManager setCards={setCards} />
      <AutocompleteInput
        onCardSelect={handleCardSelect}
        isMultilingual={isMultilingual}
      />
      <CardGrid
        cards={cards}
        onAddCard={handleAddCard}
        onRemoveCard={handleRemoveCard}
      />
    </div>
  );
}

export default App;
