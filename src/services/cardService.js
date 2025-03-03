// src/services/cardService.js
import axios from 'axios';

// Function to fetch multiple card details by their IDs
export const fetchMultipleCards = async (cardIdentifiers) => {
    try {
        const response = await axios.post('https://api.scryfall.com/cards/collection', {
            identifiers: cardIdentifiers
        });
        return response.data.data; // Return the array of card objects
    } catch (error) {
        console.error('Error fetching multiple cards:', error);
        return [];
    }
};

// Function to search for cards by a query
export const searchCards = async (query, isMultilingual) => {
    console.log(`Searching for cards: ${query} (multilingual: ${isMultilingual})`);
    try {
        const response = await axios.get(`https://api.scryfall.com/cards/search`, {
            params: { q: query, include_multilingual: isMultilingual }
        });
        return response.data.data; // Return the array of card suggestions
    } catch (error) {
        console.error('Error searching for cards:', error);
        return [];
    }
};

// Function to fetch card details by ID
export const fetchCardDetailsById = async (cardId) => {
    try {
        const response = await axios.get(`https://api.scryfall.com/cards/${cardId}`);
        return response.data; // Return the card details
    } catch (error) {
        console.error('Error fetching card details by ID:', error);
        return null;
    }
};