// src/db.js
import { openDB } from 'idb';

const dbPromise = openDB('mtg-card-db', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('cards')) {
            db.createObjectStore('cards', { keyPath: 'id' });
        }
    },
});

export const addCard = async (card) => {
    const db = await dbPromise;
    const existingCard = await db.get('cards', card.id);
    const timestamp = new Date().toISOString(); // Create a timestamp

    if (existingCard) {
        existingCard.count = (existingCard.count || 1) + 1;
        existingCard.lastUpdated = timestamp; // Update timestamp
        await db.put('cards', existingCard);
    } else {
        card.count = 1;
        card.addedAt = timestamp; // Add timestamp
        await db.put('cards', card);
    }
};

export const getAllCards = async () => {
    const db = await dbPromise;
    return await db.getAll('cards');
};

export const removeCard = async (cardId) => {
    const db = await dbPromise;
    const card = await db.get('cards', cardId);
    if (card) {
        if (card.count > 1) {
            card.count -= 1;
            await db.put('cards', card);
        } else {
            await db.delete('cards', cardId);
        }
    }
};