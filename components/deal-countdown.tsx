"use client";

import { useState, useEffect } from "react";

import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  MILLISECONDS_IN_A_DAY,
  MILLISECONDS_IN_A_MINUTE, MILLISECONDS_IN_A_SECOND,
  MILLISECONDS_IN_AN_HOUR,
} from "@/lib/constants";

const TARGET_DATE = new Date("2045-06-25T00:00:00");

const calcTimeRemaining = (targetData: Date) => {
  const currentTime = new Date();
  const timeDiff = Math.max(Number(targetData) - Number(currentTime), 0);
  return {
    days: Math.floor(timeDiff / MILLISECONDS_IN_A_DAY),
    hours: Math.floor((timeDiff % MILLISECONDS_IN_A_DAY) / MILLISECONDS_IN_AN_HOUR),
    minutes: Math.floor((timeDiff % MILLISECONDS_IN_AN_HOUR) / MILLISECONDS_IN_A_MINUTE),
    seconds: Math.floor((timeDiff % MILLISECONDS_IN_A_MINUTE) / MILLISECONDS_IN_A_SECOND),
  };
}

const DealCountdown = () => {
  const [time, setTime] = useState<ReturnType<typeof calcTimeRemaining>>();

  useEffect(() => {
      setTime(calcTimeRemaining(TARGET_DATE));
      const timerInterval = setInterval(() => {
        const newTime = calcTimeRemaining(TARGET_DATE);
        setTime(newTime);

        if (newTime.days === 0 && newTime.hours === 0 && newTime.minutes === 0 && newTime.seconds === 0) {
          clearInterval(timerInterval);
        }

        return () => clearInterval(timerInterval);
      }, MILLISECONDS_IN_A_SECOND);
    },
    []);

  if (!time) {
    return (
      <section className="grid grid-cols-1 ms:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Loading Countdown...</h3>
        </div>
      </section>
    );
  }

  if (time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
    return (
      <section className='grid grid-cols-1 md:grid-cols-2 my-20'>
        <div className='flex flex-col gap-2 justify-center'>
          <h3 className='text-3xl font-bold'>Deal Has Ended</h3>
          <p>
            This deal is no longer available.
          </p>
          <div className='text-center'>
            <Button asChild>
              <Link href='/search'>View Products</Link>
            </Button>
          </div>
        </div>
        <div className='flex justify-center'>
          <Image
            src='/images/promo.jpg'
            alt='promotion'
            width={300}
            height={200}
          />
        </div>
      </section>
    )
  }

  return (
    <section className='grid grid-cols-1 md:grid-cols-2 my-20'>
      <div className='flex flex-col gap-2 justify-center'>
        <h3 className='text-3xl font-bold'>Deal Of The Month</h3>
        <p>
          Get ready for a shopping experience like never before with our Deals
          of the Month! Every purchase comes with exclusive perks and offers,
          making this month a celebration of savvy choices and amazing deals.
          Don&apos;t miss out! 🎁🛒
        </p>
        <ul className='grid grid-cols-4'>
          <StatBox label='Days' value={time.days} />
          <StatBox label='Hours' value={time.hours} />
          <StatBox label='Minutes' value={time.minutes} />
          <StatBox label='Seconds' value={time.seconds} />
        </ul>
        <div className='text-center'>
          <Button asChild>
            <Link href='/search'>View Products</Link>
          </Button>
        </div>
      </div>
      <div className='flex justify-center'>
        <Image
          src='/images/promo.jpg'
          alt='promotion'
          width={300}
          height={200}
        />
      </div>
    </section>
  );
}

const StatBox = ({
  label,
  value,
}: { label: string; value: number}) => (
  <li className="p-4 w-full text-center">
    <p className="text-3xl font-bold">{value}</p>
    <p>{label}</p>
  </li>
)

export default DealCountdown
