import React from 'react';
import { exportCards, importCards, getAllCards } from '../db';
import { fetchCardDetailsById } from '../services/cardService';

function CardDataManager({ setCards }) {
    const handleExport = async () => {
        const cards = await exportCards();
        const csvContent = "data:text/csv;charset=utf-8,"
            + ["id,name,count,addedAt,lastUpdated"].join(",") + "\n"
            + cards.map(card =>
                `${card.id},${card.name},${card.count},${card.addedAt || ''},${card.lastUpdated || ''}`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "cards.csv");
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
            if (typeof csvContent !== 'string') {
                console.error('File content is not a string');
                return;
            }
            const lines = csvContent.split('\n');
            const headers = lines[0].split(',');

            const cards = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',');
                if (values.length !== headers.length) continue;

                const card = {};
                headers.forEach((header, index) => {
                    card[header.trim()] = values[index].trim();
                });

                if (card.id) {
                    // Fetch additional details for the card by ID
                    const additionalDetails = await fetchCardDetailsById(card.id);
                    if (additionalDetails) {
                        Object.assign(card, additionalDetails);
                    }
                    cards.push(card);
                }
            }

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