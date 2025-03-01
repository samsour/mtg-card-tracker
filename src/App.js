// src/App.js
import React, { useState, useEffect } from 'react';
import AutocompleteInput from './components/AutocompleteInput';
import CardGrid from './components/CardGrid';
import { addCard, getAllCards, removeCard } from './db';

function App() {
  const [cards, setCards] = useState([]);

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
    <div>
      <h1>Magic: The Gathering Card Tracker</h1>
      <AutocompleteInput onCardSelect={handleCardSelect} />
      <CardGrid cards={cards} onAddCard={handleAddCard} onRemoveCard={handleRemoveCard} />
    </div>
  );
}

export default App;