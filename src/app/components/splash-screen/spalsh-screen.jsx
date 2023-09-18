"use client";
import React, { useEffect, useState } from "react";
import anime from "animejs";
import Image from "next/image";
import Logo from "../../../../public/car.png";

const SplashScreen = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeOut = setTimeout(() => setIsMounted(true), 2100);
    animation();
    return () => clearTimeout(timeOut);
  });

  const animation = () => {
    const loader = anime.timeline({
      complete: () => finishLoading(),
    });

    loader
      .add({
        targets: "#logo",
        delay: 0,
        scale: 1.5,
        duration: 350,
        easing:'easeInOutExpo'
      }).add({
        targets: "#logo",
        delay: 0,
        scale: 1.75,
        duration: 350,
        easing:'easeInOutExpo',
      }).add({
        targets: "#logo",
        delay: 0,
        scale: 2,
        duration: 350,
        easing:'easeInOutExpo'
      }).add({
        targets: "#logo",
        delay: 0,
        scale: 2.25,
        duration: 350,
        easing:'easeInOutExpo',
        rotate: 360
      }).add({
        targets: "#logo",
        delay: 0,
        scale: 2,
        duration: 350,
        easing:'easeInOutExpo'
      }).add({
        targets: "#logo",
        delay: 0,
        scale: 1.75,
        duration: 350,
        easing:'easeInOutExpo'
      }).add({
        targets: "#logo",
        delay: 0,
        scale: 1.5,
        duration: 350,
        easing:'easeInOutExpo'
      })
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div>
      <Image id="logo" height={125} width={135} alt="demo" src={Logo} />
      </div>
      <p className="text-xl font-bold mt-12">Cab India</p>
    </div>
  );
};

export default SplashScreen;
