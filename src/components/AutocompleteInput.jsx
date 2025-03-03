import React, { useState, useCallback } from "react";
import Autosuggest from "react-autosuggest";
import { debounce } from "../utils/debounce";
import { searchCards } from "../services/cardService";

const AutocompleteInput = ({ onCardSelect, isMultilingual }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (input) => {
    if (input.trim() === "") {
      setSuggestions([]);
      return;
    }
    try {
      const suggestions = await searchCards(input, isMultilingual);
      setSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    []
  );

  const onSuggestionsFetchRequested = ({ value }) => {
    debouncedFetchSuggestions(value);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

  const onSuggestionSelected = (event, { suggestion }) => {
    onCardSelect(suggestion);
    setValue(""); // Clear the input field
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={{
        placeholder:
          "Type a card name and press Enter to add it to your collection",
        value,
        onChange: (e, { newValue }) => setValue(newValue),
      }}
      onSuggestionSelected={onSuggestionSelected}
    />
  );
};

export default AutocompleteInput;
