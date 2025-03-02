// src/services/cardService.js
import axios from 'axios';

// Function to search for cards by a query
export const searchCards = async (query) => {
    try {
        const response = await axios.get(`https://api.scryfall.com/cards/search`, {
            params: { q: query }
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