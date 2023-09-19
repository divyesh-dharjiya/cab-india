import { CardBody, Heading, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import CardComponent from '../card/card';
import Image from 'next/image';

const carData = [
    { id: 1, carType: 'Micro', price: 12, imageUrl: 'data:image/jpeg;base64,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' },
    { id: 1, carType: 'Hatchback', price: 13, imageUrl: 'https://cdn-icons-png.flaticon.com/512/55/55308.png' },
    { id: 3, carType: 'Sedan', price: 15, imageUrl: 'https://cdn-icons-png.flaticon.com/512/55/55283.png' },
    { id: 4, carType: 'SUV', price: 17.5, imageUrl: 'https://cdn-icons-png.flaticon.com/512/55/55280.png' },
    { id: 5, carType: 'MPV', price: 20, imageUrl: 'data:image/png;base64,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' },
]

const CarList = ({totalKm}) => {
    return (
        <>
            {
                carData.map((item) => {
                    return (
                        <div key={item.id} className='lg:inline-flex lg:flex-col lg:w-1/2 xl:w-1/3 lg:justify-center md:inline-flex md:justify-center text-center'>
                            <CardComponent className="lg:m-auto" margin={0}>
                                <Stack m='0' spacing='3'>
                                    <Image className='md: m-auto' src={item.imageUrl} height={150} width={150} alt={item.carType}/>
                                    <Heading size='md'>{item.carType}</Heading>
                                    <Text color='blue.600' className="font-bold">₹ {(item.price * totalKm).toFixed(2)}</Text>
                                </Stack>
                            </CardComponent>
                        </div>
                    )
                })
            }
        </>
    )
}

export default CarList;