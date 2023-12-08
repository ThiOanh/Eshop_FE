import React, { useEffect, useState } from "react";
import Image from "next/image";

// import { endOfSale } from "@/constant";
// import { getTime } from "@/helper/getTime";
import { formatNumberToString, formatTime } from "@/helper/timeFlashSale";
import useGetTimeFlashsale from "@/store/timeFlashSale";

import BuyNow from "../buttons/buyNow";

function SaleHunter() {
  const endOfSale = useGetTimeFlashsale((state) => state.timeFlashsale);

  const getFlashsaleTime = useGetTimeFlashsale((state) => state.fetch);

  const [numOfSecond, setNumOfSecond] = useState(endOfSale);
  const [dateTime, setDateTime] = useState(formatTime(endOfSale));

  useEffect(() => {
    getFlashsaleTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setNumOfSecond(endOfSale);
    setDateTime(formatTime(endOfSale));
  }, [endOfSale]);

  let interval;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    interval = setInterval(() => {
      setNumOfSecond((s) => s - 1);
    }, 1000);

    if (numOfSecond === 0) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [numOfSecond]);

  useEffect(() => {
    if (numOfSecond === 0) {
      clearInterval(interval);
    }

    setDateTime(formatTime(numOfSecond));

    return () => {
      clearInterval(interval);
    };
  }, [interval, numOfSecond]);

  return (
    <div className="container mt-[8.75rem] flex justify-center items-center rounded-[0.25rem] bg-text-2">
      <div className="rounded-[0.25rem] grid grid-cols-12 bg-text-2 max-w-[73.125rem] min-h-[31.25rem]">
        <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6 xl:col-span-6 flex flex-col items-start justify-start">
          <h3 className="text-button-3 font-inter text-[1rem] font-[600] leading-[1.25rem] mt-[4.31rem] ml-[3.5rem]">
            Categories
          </h3>

          <h2 className="max-w-[27.6875rem] ml-[3.5rem] mt-[2rem] text-text-1 font-inter text-[3rem] font-[600] leading-[3.75rem] tracking-[0.12rem]">
            Enhance Your Music Experience
          </h2>

          <div className="grid grid-cols-12 sm:inline-flex items-start gap-[0.5rem] sm:gap-[1.5rem] ml-[3.5rem] mt-[2rem]">
            <div className="col-span-6 min-w-[3.875rem] min-h-[3.875rem] flex-shrink-0 rounded-full bg-white flex items-center justify-center">
              <div className="flex flex-col items-center gap-[-0.25rem]">
                <span
                  suppressHydrationWarning
                  className="text-text-2 font-inter text-[1rem] font-[600] leading-[1.25rem]"
                >
                  {formatNumberToString(dateTime.hour)}
                </span>

                <span className="min-w-[2rem] text-text-2 font-inter text-[0.6875rem] font-[400] leading-[1.125rem]">
                  Hours
                </span>
              </div>
            </div>

            <div className="col-span-6 min-w-[3.875rem] min-h-[3.875rem] flex-shrink-0 rounded-full bg-white flex items-center justify-center">
              <div className="flex flex-col items-center gap-[-0.25rem]">
                <span
                  suppressHydrationWarning
                  className="text-text-2 font-inter text-[1rem] font-[600] leading-[1.25rem]"
                >
                  {formatNumberToString(dateTime.day)}
                </span>

                <span className="min-w-[1.75rem] text-text-2 font-inter text-[0.6875rem] font-[400] leading-[1.125rem]">
                  Days
                </span>
              </div>
            </div>

            <div className="col-span-6 min-w-[3.875rem] min-h-[3.875rem] flex-shrink-0 rounded-full bg-white flex items-center justify-center">
              <div className="flex flex-col items-center gap-[-0.25rem]">
                <span
                  suppressHydrationWarning
                  className="text-text-2 font-inter text-[1rem] font-[600] leading-[1.25rem]"
                >
                  {formatNumberToString(dateTime.minute)}
                </span>

                <span className="min-w-[2.6875rem] text-text-2 font-inter text-[0.6875rem] font-[400] leading-[1.125rem]">
                  Minutes
                </span>
              </div>
            </div>

            <div className="col-span-6 min-w-[3.875rem] min-h-[3.875rem] flex-shrink-0 rounded-full bg-white flex items-center justify-center">
              <div className="flex flex-col items-center gap-[-0.25rem]">
                <span
                  suppressHydrationWarning
                  className="text-text-2 font-inter text-[1rem] font-[600] leading-[1.25rem]"
                >
                  {formatNumberToString(dateTime.second)}
                </span>

                <span className="min-w-[3rem] text-text-2 font-inter text-[0.6875rem] font-[400] leading-[1.125rem]">
                  Seconds
                </span>
              </div>
            </div>
          </div>

          <div className="ml-[3.5rem] mt-[2.5rem]">
            <BuyNow />
          </div>
        </div>

        <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6 xl:col-span-6 flex items-center justify-center">
          <Image
            className="p-10 lg:p-0 lg:mr-[3.75rem] object-contain"
            src="/assets/images/products/sound.png"
            alt="..."
            width={1000}
            height={1000}
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default SaleHunter;
