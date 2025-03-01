// src/components/AutocompleteInput.js
import React, { useState, useCallback } from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import { debounce } from '../utils/debounce';

const AutocompleteInput = ({ onCardSelect }) => {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const fetchSuggestions = async (input) => {
        if (input.trim() === '') {
            setSuggestions([]);
            return;
        }
        try {
            const response = await axios.get(`https://api.scryfall.com/cards/search`, {
                params: {
                    q: input,
                    unique: 'cards',
                    order: 'name',
                    dir: 'asc',
                },
            });
            setSuggestions(response.data.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

    const onSuggestionsFetchRequested = ({ value }) => {
        debouncedFetchSuggestions(value);
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const getSuggestionValue = (suggestion) => suggestion.name;

    const renderSuggestion = (suggestion) => (
        <div>
            {suggestion.name}
        </div>
    );

    const onSuggestionSelected = (event, { suggestion }) => {
        onCardSelect(suggestion);
        setValue(''); // Clear the input field
    };

    return (
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={{
                placeholder: 'Type a card name and press Enter to add it to your collection',
                value,
                onChange: (e, { newValue }) => setValue(newValue),
            }}
            onSuggestionSelected={onSuggestionSelected}
        />
    );
};

export default AutocompleteInput;