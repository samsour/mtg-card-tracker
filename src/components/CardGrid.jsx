import React, { useState } from "react";

const CardGrid = ({ cards, onAddCard, onRemoveCard }) => {
  const [lastRemovedCard, setLastRemovedCard] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("lastUpdated");

  const handleRemoveCard = (card) => {
    setLastRemovedCard(card);
    setShowUndo(true);
    onRemoveCard(card.id);
  };

  const handleUndo = () => {
    if (lastRemovedCard) {
      onAddCard(lastRemovedCard);
      setLastRemovedCard(null);
      setShowUndo(false);
    }
  };

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  const sortedCards = [...cards].sort((a, b) => {
    if (sortCriteria === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortCriteria === "addedAt") {
      return new Date(b.addedAt) - new Date(a.addedAt);
    } else if (sortCriteria === "lastUpdated") {
      return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    }
    return 0;
  });

  // Calculate statistics
  const totalCardCount = cards.reduce((sum, card) => sum + card.count, 0);
  const uniqueCardCount = cards.length;
  const totalCardPrice = cards.reduce(
    (sum, card) => sum + (card.prices?.eur || 0) * card.count,
    0
  );

  return (
    <div className="p-4">
      {showUndo && (
        <div className="mb-4 p-3 bg-yellow-300 rounded-md">
          <span>Removed card {lastRemovedCard.name}. </span>
          <button
            onClick={handleUndo}
            className="px-3 py-1 bg-green-600 text-white rounded-md"
          >
            Undo
          </button>
        </div>
      )}
      <div className="mb-4">
        <div className="mb-2">
          <strong>Total Cards (including duplicates):</strong> {totalCardCount}
        </div>
        <div className="mb-2">
          <strong>Unique Cards:</strong> {uniqueCardCount}
        </div>
        <div className="mb-2">
          <strong>Total Price:</strong> {totalCardPrice.toFixed(2)}€
        </div>
        <label htmlFor="sortCriteria" className="mr-2">
          Sort by:
        </label>
        <select
          id="sortCriteria"
          value={sortCriteria}
          onChange={handleSortChange}
          className="p-2 rounded-md border border-gray-300"
        >
          <option value="name">Name</option>
          <option value="addedAt">Date Added</option>
          <option value="lastUpdated">Last Updated</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedCards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col border border-gray-300 rounded-md overflow-hidden shadow-lg"
          >
            <img
              src={card.image_uris?.normal}
              alt={card.name}
              className="w-full h-auto"
            />
            <div className="flex-1 p-3 bg-gray-100">
              <h3 className="m-0 mb-2 text-lg text-gray-800">{card.name}</h3>
              <p className="m-0 text-sm text-gray-600">{card.type_line}</p>
              <p className="m-0 text-sm text-gray-600">{card.set_name}</p>
              <p className="m-0 text-sm text-gray-600">Count: {card.count}</p>
              {card.prices?.eur && (
                <p className="m-0 text-sm text-gray-600">
                  Price: {card.prices.eur}€
                </p>
              )}
              {card.addedAt && (
                <p className="m-0 text-xs text-gray-500">
                  Added: {new Date(card.addedAt).toLocaleString("de-DE")}
                </p>
              )}
              {card.lastUpdated && (
                <p className="m-0 text-xs text-gray-500">
                  Updated: {new Date(card.lastUpdated).toLocaleString("de-DE")}
                </p>
              )}
            </div>
            <div className="p-3 bg-gray-100 flex justify-between">
              <button
                onClick={() => onAddCard(card)}
                className="px-3 py-1 bg-green-600 text-white rounded-md"
              >
                Add
              </button>
              <button
                onClick={() => handleRemoveCard(card)}
                className="px-3 py-1 bg-red-500 text-white rounded-md"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardGrid;
