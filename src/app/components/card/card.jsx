"use client";
import { Box, Card, CardBody, CardHeader, Heading, Stack, StackDivider, Text } from '@chakra-ui/react';
import React from 'react'

const CardComponent = ({ children, heading, textAlign }) => {
    return (
        <div>
            <Card px={5} py={5} margin={2}>
                <CardHeader p={0} textAlign={textAlign}>
                    <Heading size='md'>{heading}</Heading>
                </CardHeader>
                <CardBody p={0}>
                    {children}
                </CardBody>
            </Card>
        </div>
    )
}

export default CardComponent;