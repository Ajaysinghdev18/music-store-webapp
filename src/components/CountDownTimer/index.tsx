import { Flex, Stack } from '@chakra-ui/core';
import React, { useState, useEffect } from 'react';

export const CountdownTimer = (time: any) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Clear the interval when the component is unmounted
        return () => clearInterval(timerInterval);
    }, []);

    function calculateTimeLeft() {
        const endTime = new Date("January 18, 2024 23:59:59").getTime();
        const now = new Date().getTime();
        const distance = endTime - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    }

    return (
        <Stack justifyContent={'space-between'}>
             <p className='text-heading3'>{timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s</p>
             <p className='text-body3'>Time Remaining</p>
        </Stack>
    );
};

export default CountdownTimer;