import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

import ViewAll from "../buttons/viewAll";
import CardBestSelling from "../cardBestSelling";
import Rectangle from "../svg/rectangle";

function BestSelling(props) {
  const { bestSelling } = props;

  return (
    <div className="pt-[1rem] pb-[1rem] container bg-[url('/assets/images/background/3.png')] rounded-[0.25rem]">
      <div className="sm:flex items-end mb-[7.5rem] sm:mb-[3.75rem]">
        <div className="sm:flex min-h-[6.4375rem] flex-col items-start gap-[1.25rem]">
          <div className="flex items-center gap-[1rem]">
            <div className="min-w-[1.25rem] min-h-[2.5rem]">
              <Rectangle />
            </div>

            <h3 className="text-white font-inter text-[1rem] font-[600] leading-[1.25rem]">This Month</h3>
          </div>

          <h2 className="mt-[0.5rem] sm:mt-0 text-white font-inter text-[2.25rem] font-[600] leading-[3rem] tracking-[0.09rem] sm:whitespace-nowrap">
            Best Selling Products
          </h2>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <Link href="/product">
          <ViewAll />
        </Link>

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-[1.875rem] gap-[1.875rem]">
          {bestSelling.length > 0 ? (
            bestSelling.map((item) => {
              return (
                <div
                  className="max-w-[16.875rem] min-h-[15.625rem] bg-white rounded-[0.25rem]  mb-[2.875rem] sm:mb-0"
                  key={item.name}
                  // col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3
                >
                  <Card product={item} />
                </div>
              );
            })
          ) : (
            <div className="col-span-12 text-center">
              <span className="text-secondary-2 font-inter text-[2.25rem] font-[600] leading-[3rem] tracking-[0.09rem]">
                Internal Server Error
              </span>
            </div>
          )}
        </div> */}

        <div className="grid grid-cols-12 sm:gap-[1.875rem]">
          {bestSelling.length > 0 ? (
            bestSelling.map((item) => {
              return (
                <div
                  className="w-[22.875rem] sm:w-[28.875rem] md:w-[25.875rem] lg:w-[16.875rem] min-h-[15.625rem] bg-white rounded-[0.25rem] col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 mb-[2.875rem] sm:mb-0"
                  key={item.name}
                >
                  <CardBestSelling product={item} />
                </div>
              );
            })
          ) : (
            <div className="col-span-12 text-center">
              <span className="text-secondary-2 font-inter text-[2.25rem] font-[600] leading-[3rem] tracking-[0.09rem]">
                Internal Server Error
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BestSelling;

BestSelling.propTypes = {
  bestSelling: PropTypes.instanceOf(Array).isRequired,
};
