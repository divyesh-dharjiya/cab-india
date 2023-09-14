"use client";
import React, { useState } from 'react';
import CardComponent from '../components/card/card';
import dynamic from 'next/dynamic';
import LeafletAutoComplete from '../leafletAPI/leaflet-autocomplete';
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("../components/map-box/map"), { ssr: false });
const TextBox = dynamic(() => import("../components/input/input.jsx"), { ssr: false });
const Button = dynamic(() => import("../components/button/button.jsx"), { ssr: false });


let data = [];

const Home = () => {
  const [item, setItem] = useState([]);
  const [inputOne, setInputOne] = useState({});
  const [inputTwo, setInputTwo] = useState({});
  const router = useRouter();

  const getSelectedValOne = (value) => {
    console.log(value);
    const filterOne = data.filter((item) => item.label === value);
    setInputOne(prevVal => [filterOne[0].y, filterOne[0].x]);
  };

  const getSelectedValtwo = (value) => {
    console.log(value);
    const filtertwo = data.filter((item) => item.label === value);
    setInputTwo(prevVal => [filtertwo[0].y, filtertwo[0].x]);
  };

  const getChanges = async (value) => {
    data = await LeafletAutoComplete(value);
    const responseData = data.map((items) => items.label);
    setItem(prevVal => responseData);
  };

  const resetData = () => {
   window.location.reload();
  }

  return (
    <div className="md:flex h-[85vh]">
      <div className="md:basis-2/5">
        <CardComponent heading="Taxi Booking" textAlign="center">
          {/* <TextBox placeholder="Where From ?" />
          <TextBox placeholder="Where To ?" /> */}

          <TextBox
            label="Enter Where From Address : "
            pholder="Where From ?"
            data={item}
            onSelected={getSelectedValOne}
            onChange={getChanges}
          />

          <TextBox
            label="Enter Where To Address : "
            pholder="Where To ?"
            data={item}
            onSelected={getSelectedValtwo}
            onChange={getChanges}
          />
          <Button handleChange={resetData}/>
        </CardComponent>
        <CardComponent heading="Select CAB" textAlign="center">

        </CardComponent>
      </div>
      <div className='md:basis-3/5'>
        <CardComponent heading="Map" textAlign="left">
          <Map markerOne={inputOne} markerTwo={inputTwo} />
        </CardComponent>
      </div>
    </div>
  )
}

export default Home;