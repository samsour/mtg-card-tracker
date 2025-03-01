// src/components/CardGrid.js
import React from 'react';

const CardGrid = ({ cards, onAddCard, onRemoveCard }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', padding: '20px' }}>
            {cards.map((card) => (
                <div key={card.id} style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <img src={card.image_uris?.normal} alt={card.name} style={{ width: '100%', height: 'auto' }} />
                    <div style={{ padding: '10px', backgroundColor: '#f8f8f8' }}>
                        <h3 style={{ margin: '0 0 10px', fontSize: '1.2em', color: '#333' }}>{card.name}</h3>
                        <p style={{ margin: '0', fontSize: '0.9em', color: '#666' }}>{card.type_line}</p>
                        <p style={{ margin: '0', fontSize: '0.9em', color: '#666' }}>{card.set_name}</p>
                        <p style={{ margin: '0', fontSize: '0.9em', color: '#666' }}>Count: {card.count}</p>
                        <button onClick={() => onAddCard(card)} style={{ marginTop: '10px', marginRight: '5px', padding: '5px 10px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Add
                        </button>
                        <button onClick={() => onRemoveCard(card.id)} style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Remove
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardGrid;