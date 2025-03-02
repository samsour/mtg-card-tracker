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
    <div>
      {showUndo && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#ffeb3b",
            borderRadius: "4px",
          }}
        >
          <span>Removed card {lastRemovedCard.name}. </span>
          <button
            onClick={handleUndo}
            style={{
              padding: "5px 10px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Undo
          </button>
        </div>
      )}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <strong>Total Cards (including duplicates):</strong> {totalCardCount}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Unique Cards:</strong> {uniqueCardCount}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Total Price:</strong> {totalCardPrice.toFixed(2)}€
        </div>
        <label htmlFor="sortCriteria" style={{ marginRight: "10px" }}>
          Sort by:
        </label>
        <select
          id="sortCriteria"
          value={sortCriteria}
          onChange={handleSortChange}
          style={{ padding: "5px", borderRadius: "4px" }}
        >
          <option value="name">Name</option>
          <option value="addedAt">Date Added</option>
          <option value="lastUpdated">Last Updated</option>
        </select>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
        {sortedCards.map((card) => (
          <div
            key={card.id}
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img
              src={card.image_uris?.normal}
              alt={card.name}
              style={{ width: "100%", height: "auto" }}
            />
            <div
              style={{ flex: "1", padding: "10px", backgroundColor: "#f8f8f8" }}
            >
              <h3
                style={{ margin: "0 0 10px", fontSize: "1.2em", color: "#333" }}
              >
                {card.name}
              </h3>
              <p style={{ margin: "0", fontSize: "0.9em", color: "#666" }}>
                {card.type_line}
              </p>
              <p style={{ margin: "0", fontSize: "0.9em", color: "#666" }}>
                {card.set_name}
              </p>
              <p style={{ margin: "0", fontSize: "0.9em", color: "#666" }}>
                Count: {card.count}
              </p>
              {card.prices?.eur && (
                <p style={{ margin: "0", fontSize: "0.9em", color: "#666" }}>
                  Price: {card.prices.eur}€
                </p>
              )}
              {card.addedAt && (
                <p style={{ margin: "0", fontSize: "0.7em", color: "#999" }}>
                  Added: {new Date(card.addedAt).toLocaleString("de-DE")}
                </p>
              )}
              {card.lastUpdated && (
                <p style={{ margin: "0", fontSize: "0.7em", color: "#999" }}>
                  Updated: {new Date(card.lastUpdated).toLocaleString("de-DE")}
                </p>
              )}
            </div>
            <div
              style={{
                padding: "10px",
                backgroundColor: "#f8f8f8",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={() => onAddCard(card)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
              <button
                onClick={() => handleRemoveCard(card)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#ff4d4d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
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
