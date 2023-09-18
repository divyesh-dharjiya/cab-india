"use client";
import React, { useState } from 'react';
import CardComponent from '../components/card/card';
import dynamic from 'next/dynamic';
import LeafletAutoComplete from '../leafletAPI/leaflet-autocomplete';
import { Stack, Text } from '@chakra-ui/react';
import convertIntoTime from '../leafletAPI/convertIntoTime';

const Map = dynamic(() => import("../components/map-box/map"), { ssr: false });
const TextBox = dynamic(() => import("../components/input/input.jsx"), { ssr: false });
const Button = dynamic(() => import("../components/button/button.jsx"), { ssr: false });


let data = [];

const Home = () => {
  const [item, setItem] = useState([]);
  const [inputOne, setInputOne] = useState({});
  const [inputTwo, setInputTwo] = useState({});
  const [timer, setTimer] = useState(null);
  const [routeDetail, setRouteDetail] = useState({});

  const getSelectedValOne = (value) => {
    const filterOne = data.filter((item) => item.label === value);
    setInputOne(prevVal => [filterOne[0].y, filterOne[0].x]);
  };

  const getSelectedValtwo = (value) => {
    const filtertwo = data.filter((item) => item.label === value);
    setInputTwo(prevVal => [filtertwo[0].y, filtertwo[0].x]);
  };

  const getChanges = async (value) => {

    clearTimeout(timer)

    const newTimer = setTimeout(async () => {
      data = await LeafletAutoComplete(value);
      const responseData = data.map((items) => items.label);
      setItem(prevVal => responseData);
    }, 500)

    setTimer(newTimer)
  };

  const resetData = () => {
    setInputOne({});
    setInputTwo({});
    setItem([]);
  }

  return (
    <div className="md:flex min-h">
      <div className="md:basis-2/5">
        <CardComponent heading="Taxi Booking" textAlign="center">

          <TextBox
            label="Enter Where From Address : "
            pholder="Where From ?"
            data={item}
            onSelected={getSelectedValOne}
            onChange={getChanges}
            value={inputOne}
          />

          <TextBox
            label="Enter Where To Address : "
            pholder="Where To ?"
            data={item}
            onSelected={getSelectedValtwo}
            onChange={getChanges}
            value={inputTwo}
          />
          <div className='flex justify-center'>
            <Button color="red" name="Reset" handleChange={resetData} />
            <Button color="blue" name="Book" />
          </div>
          <Stack spacing={3}>
            <Text mt={5} fontSize='md' fontWeight={'700'} textAlign={'center'} >
              [Note: For Autocomplete address press <span className="font-bold text-red-500">Down Key(↓)</span> after entering the address]
            </Text>
          </Stack>
        </CardComponent>

        {
          routeDetail.totalDistance && routeDetail.totalTime &&
          (
            <CardComponent heading="Select CAB" textAlign="center" p={0}>
              <Text mt={1} fontSize='md' fontWeight={'700'} textAlign={'center'} >
                Total Distance : <span className='text-red-400 font-bold'>{(routeDetail.totalDistance / 1000).toFixed(2)} Kilometers</span>

              </Text><Text mt={1} fontSize='md' fontWeight={'700'} textAlign={'center'} >
                Total Time : <span className='text-red-400 font-bold'>{convertIntoTime(routeDetail.totalTime)}</span>
              </Text>
            </CardComponent>
          )
        }

      </div>
      <div className='md:basis-3/5'>
        <CardComponent heading="Map" textAlign="left">
          <Map markerOne={inputOne} markerTwo={inputTwo} onMarkerSelected={(control) => {
            console.log(`onMarkerSelected ---- `, control);
            setRouteDetail((prev) => control)
          }} />
        </CardComponent>
      </div>
    </div>
  )
}

export default Home;