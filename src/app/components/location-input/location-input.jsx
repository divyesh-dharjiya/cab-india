"use client";
import { useEffect, useId, useState } from "react";
import { Box, Field, IconButton, Input, InputGroup, Spinner, Text } from "@chakra-ui/react";
import { X } from "lucide-react";
import { searchPlaces } from "../../lib/geocoding";

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 450;
const EMPTY_SEARCH = { query: "", results: [], status: "idle" };

const LocationInput = ({ label, placeholder, value, onSelect, markerColor, markerLabel }) => {
  const id = useId();
  const listId = `${id}-list`;
  const [query, setQuery] = useState(value?.label ?? "");
  const [isDirty, setIsDirty] = useState(false);
  const [search, setSearch] = useState(EMPTY_SEARCH); // last finished search
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  // The value this input last saw or reported. A different `value` prop means it was
  // changed from outside (swap, current location), so the text has to follow it.
  const [knownValue, setKnownValue] = useState(value);

  if (value !== knownValue) {
    setKnownValue(value);
    setQuery(value?.label ?? "");
    setIsDirty(false);
  }

  const trimmed = query.trim();
  const isSearching = isDirty && trimmed.length >= MIN_QUERY_LENGTH;
  const isSettled = search.query === trimmed;
  const results = isSearching && isSettled ? search.results : [];
  const status = !isSearching ? "idle" : isSettled ? search.status : "loading";

  useEffect(() => {
    if (!isSearching) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      searchPlaces(trimmed, controller.signal)
        .then((places) => {
          setSearch({ query: trimmed, results: places, status: "done" });
          setActiveIndex(places.length ? 0 : -1);
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            setSearch({ query: trimmed, results: [], status: "error" });
          }
        });
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [trimmed, isSearching]);

  const emit = (place) => {
    setKnownValue(place);
    onSelect(place);
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
    setIsDirty(true);
    setIsOpen(true);
    if (value) emit(null);
  };

  const choose = (place) => {
    setQuery(place.label);
    setIsDirty(false);
    setIsOpen(false);
    emit(place);
  };

  const clear = () => {
    setQuery("");
    setIsDirty(false);
    setIsOpen(false);
    emit(null);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }
    if (!results.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter" && isOpen && activeIndex >= 0) {
      event.preventDefault();
      choose(results[activeIndex]);
    }
  };

  const showList = isOpen && status !== "idle";

  const marker = (
    <Box
      w={6}
      h={6}
      rounded="full"
      bg={markerColor}
      color="white"
      fontSize="xs"
      fontWeight={700}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {markerLabel}
    </Box>
  );

  const endElement =
    status === "loading" ? (
      <Spinner size="sm" color="brand.500" />
    ) : query ? (
      <IconButton size="xs" variant="ghost" aria-label={`Clear ${label.toLowerCase()}`} onClick={clear}>
        <X />
      </IconButton>
    ) : null;

  return (
    <Field.Root position="relative">
      <Field.Label htmlFor={id} srOnly>
        {label}
      </Field.Label>
      <InputGroup startElement={marker} startElementProps={{ pointerEvents: "none" }} endElement={endElement}>
        <Input
          id={id}
          size="lg"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          bg="gray.50"
          borderColor="gray.200"
          rounded="xl"
          colorPalette="brand"
          fontSize="md"
          fontWeight={500}
          _focus={{ bg: "white" }}
        />
      </InputGroup>

      {showList && (
        <Box
          as="ul"
          id={listId}
          role="listbox"
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={1}
          zIndex={1000}
          bg="white"
          borderWidth="1px"
          borderColor="gray.200"
          rounded="lg"
          boxShadow="lg"
          maxH="300px"
          overflowY="auto"
          py={1}
          listStyleType="none"
        >
          {status === "loading" && (
            <Box as="li" px={4} py={3} color="gray.500" fontSize="sm">Searching…</Box>
          )}
          {status === "error" && (
            <Box as="li" px={4} py={3} color="red.500" fontSize="sm">
              Couldn&apos;t search right now. Please try again.
            </Box>
          )}
          {status === "done" && !results.length && (
            <Box as="li" px={4} py={3} color="gray.500" fontSize="sm">
              No places in India match &ldquo;{trimmed}&rdquo;.
            </Box>
          )}
          {results.map((place, index) => (
            <Box
              as="li"
              key={place.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              px={4}
              py={2}
              cursor="pointer"
              bg={index === activeIndex ? "brand.50" : "transparent"}
              onMouseEnter={() => setActiveIndex(index)}
              // Keep focus in the input so onBlur doesn't close the list before the click lands.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(place)}
            >
              <Text fontWeight={600} lineClamp={1}>{place.name}</Text>
              {place.address && (
                <Text fontSize="sm" color="gray.500" lineClamp={1}>{place.address}</Text>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Field.Root>
  );
};

export default LocationInput;
