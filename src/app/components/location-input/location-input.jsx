"use client";
import { useEffect, useId, useRef, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  List,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { searchPlaces } from "../../lib/geocoding";

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 450;

const LocationInput = ({ label, placeholder, value, onSelect, markerColor, markerLabel }) => {
  const id = useId();
  const listId = `${id}-list`;
  const [query, setQuery] = useState(value?.label ?? "");
  const [isDirty, setIsDirty] = useState(false);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  // Last value this input reported, so outside changes (swap, current location) can be told apart.
  const lastEmitted = useRef(value);

  useEffect(() => {
    if (value === lastEmitted.current) return;
    lastEmitted.current = value;
    setQuery(value?.label ?? "");
    setIsDirty(false);
    setResults([]);
    setStatus("idle");
  }, [value]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!isDirty || trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setStatus("idle");
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setStatus("loading");
      try {
        const places = await searchPlaces(trimmed, controller.signal);
        setResults(places);
        setActiveIndex(places.length ? 0 : -1);
        setStatus("done");
      } catch (error) {
        if (error.name !== "AbortError") {
          setResults([]);
          setStatus("error");
        }
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, isDirty]);

  const emit = (place) => {
    lastEmitted.current = place;
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
    setResults([]);
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

  const showList = isOpen && isDirty && query.trim().length >= MIN_QUERY_LENGTH && status !== "idle";

  return (
    <FormControl position="relative">
      <FormLabel htmlFor={id} fontSize="sm" color="gray.600" mb={1}>
        {label}
      </FormLabel>
      <InputGroup size="lg">
        <InputLeftElement pointerEvents="none">
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
        </InputLeftElement>
        <Input
          id={id}
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
          focusBorderColor="brand.400"
          fontSize="md"
          pr={12}
        />
        <InputRightElement>
          {status === "loading" ? (
            <Spinner size="sm" color="brand.500" />
          ) : (
            query && (
              <IconButton
                size="xs"
                variant="ghost"
                colorScheme="gray"
                icon={<CloseIcon w={2.5} h={2.5} />}
                aria-label={`Clear ${label.toLowerCase()}`}
                onClick={clear}
              />
            )
          )}
        </InputRightElement>
      </InputGroup>

      {showList && (
        <List
          id={listId}
          role="listbox"
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={1}
          zIndex={1000}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          rounded="lg"
          boxShadow="lg"
          maxH="300px"
          overflowY="auto"
          py={1}
        >
          {status === "loading" && !results.length && (
            <ListItem px={4} py={3} color="gray.500" fontSize="sm">Searching…</ListItem>
          )}
          {status === "error" && (
            <ListItem px={4} py={3} color="red.500" fontSize="sm">
              Couldn&apos;t search right now. Please try again.
            </ListItem>
          )}
          {status === "done" && !results.length && (
            <ListItem px={4} py={3} color="gray.500" fontSize="sm">
              No places in India match &ldquo;{query.trim()}&rdquo;.
            </ListItem>
          )}
          {results.map((place, index) => (
            <ListItem
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
              <Text fontWeight={600} noOfLines={1}>{place.name}</Text>
              {place.address && (
                <Text fontSize="sm" color="gray.500" noOfLines={1}>{place.address}</Text>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </FormControl>
  );
};

export default LocationInput;
