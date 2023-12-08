import React, { useCallback } from "react";
// import { notification } from "antd";
import { deleteCookie, getCookie } from "cookies-next";
import { ShoppingCart } from "lucide-react";
// import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import PropTypes from "prop-types";

// import { axiosClient } from "@/helper/axios/axiosClient";
import { renderStars } from "@/helper/renderStar";
import useCartStore from "@/store/cart/useCartStore";

import Loading from "../svg/loading";

function CardBestSelling(props) {
  let { product } = props;

  product = {
    ...product,
    discountedPrice: (parseInt(product?.price, 10) * (100 - parseInt(product?.discount, 10))) / 100,
  };

  // const [api, contextHolder] = notification.useNotification();

  const addToCart = useCartStore((state) => state.addToCart);

  const isLoadingAddCart = useCartStore((state) => state.isLoading);

  // const cart = useCartStore((state) => state.cart);

  // const openNotificationWithIcon = useCallback(
  //   (type, message) => {
  //     switch (type) {
  //       case "error":
  //         api[type]({
  //           message: "ERROR",
  //           description: message,
  //         });
  //         break;

  //       case "success":
  //         api[type]({
  //           message: "SUCCESS",
  //           description: message,
  //         });
  //         break;

  //       default:
  //         break;
  //     }
  //   },
  //   [api],
  // );

  const handleClickAddToCart = useCallback(
    async (item) => {
      const getToken = getCookie("TOKEN");
      const getRefreshToken = getCookie("REFRESH_TOKEN");

      // if (cart.length > 0) {
      //   const [checkFlashsaleOnCart, checkFlashsaleThisProduct] = await Promise.all([
      //     axiosClient.get(`/flashsale/check-flashsale?productId=${cart[0].product.productId}`),
      //     axiosClient.get(`/flashSale/check-flashsale?productId=${item.id}`),
      //   ]);

      //   if (checkFlashsaleOnCart.data.message === "found") {
      //     openNotificationWithIcon("error", "The shopping cart contains flash sale products, which cannot be added!!!");

      //     return;
      //   }

      //   if (checkFlashsaleThisProduct.data.message === "found") {
      //     openNotificationWithIcon(
      //       "error",
      //       "This is a flash sale product, please add to cart in the flash sale section",
      //     );

      //     return;
      //   }
      // } else {
      //   const checkFlashsaleThisProduct = await axiosClient.get(`/flashSale/check-flashsale?productId=${item.id}`);

      //   if (checkFlashsaleThisProduct.data.message === "found") {
      //     openNotificationWithIcon(
      //       "error",
      //       "This is a flash sale product, please add to cart in the flash sale section",
      //     );

      //     return;
      //   }
      // }

      try {
        // const url = "/authCustomers/profile";

        // const response = await axiosClient.get(url);

        if (getToken && getRefreshToken) {
          const data = {
            productId: item.id,
            name: item.name,
            image: item.image.location,
            price: item.discountedPrice,
            quantity: 1,
          };

          addToCart(data);

          // openNotificationWithIcon("success", "product added to cart!!!");
        } else {
          deleteCookie("TOKEN");
          deleteCookie("REFRESH_TOKEN");
          deleteCookie("email");
          signOut({ callbackUrl: "/log-in" });
        }
      } catch (error) {
        deleteCookie("TOKEN");
        deleteCookie("REFRESH_TOKEN");
        deleteCookie("email");
        signOut({ callbackUrl: "/log-in" });
      }
    },
    [addToCart],
  );

  return (
    <>
      {/* {contextHolder} */}

      <div className="w-[22.875rem] sm:w-[28.875rem] h-fit md:w-[25.875rem] md:h-fit lg:w-[16.875rem] lg:h-[22.875rem] flex flex-col items-start gap-[1rem] rounded-[0.25rem]">
        <div className="pt-[1rem] pb-[1rem] group relative flex items-center justify-center min-w-[16.875rem] min-h-[23.625rem] md:min-w-[16.875rem] md:min-h-[15.625rem] rounded-[0.25rem] bg-primary-1">
          <div className="absolute top-[0.75rem] left-[0.75rem] inline-flex px-[0.75rem] py-[0.25rem] justify-center items-center gap-[0.625rem] rounded-[0.25rem] bg-secondary-2">
            <span className="text-text-1 font-inter text-[0.75rem] font-[400] leading-[1.125rem]">
              -{product.discount}%
            </span>
          </div>

          {isLoadingAddCart && (
            <div className="absolute top-[10.25rem] left-[10.25rem] sm:top-[12.25rem] sm:left-[13.25rem] md:top-[12.25rem] md:left-[11.4rem] lg:top-[7.25rem] lg:left-[7.4rem]">
              <Loading />
            </div>
          )}

          <button
            type="button"
            onClick={() => handleClickAddToCart(product)}
            title="Add to cart"
            href={`/${product.id}`}
            className="bg-secondary-2 absolute top-[1rem] right-[1rem] flex lg:hidden items-center justify-center rounded-full min-w-[3.125rem] min-h-[3.125rem]"
          >
            <ShoppingCart className="text-text-1" />
          </button>

          {/* <div className="absolute top-[0.75rem] right-[0.75rem] inline-flex flex-col items-start gap-[0.5rem]">
            <button
              title="love"
              type="button"
              className="flex items-center justify-center bg-white rounded-full min-w-[2.125rem] min-h-[2.125rem]"
            >
              <Heart />
            </button>

            <Link
              title="view"
              href={`/${product.id}`}
              className="flex items-center justify-center bg-white rounded-full min-w-[2.125rem] min-h-[2.125rem]"
            >
              <Eye />
            </Link>
          </div> */}

          <Link href={`/${product.id}`}>
            <Image
              className="min-w-[22.875rem] max-w-[22.875rem] sm:min-w-[28.875rem] sm:max-w-[28.875rem] md:min-w-[25.875rem] md:max-w-[25.875rem] lg:min-w-[16.875rem] lg:max-w-[16.875rem] lg:max-h-[15.625rem] object-contain rounded-[0.25rem]"
              src={product?.image.location}
              alt="..."
              width={1000}
              height={1000}
              priority
              style={{ width: "100%", height: "auto" }}
            />
          </Link>

          <button
            onClick={() => handleClickAddToCart(product)}
            type="button"
            className="hidden absolute bottom-0 lg:flex min-w-[16.875rem] min-h-[2.5625rem] items-center justify-center transition-all opacity-0 duration-300 group-hover:opacity-100 flex-shrink-0 bg-text-2"
          >
            <span className="text-text-1 font-inter text-[1rem] font-[500] leading-[1.5rem]">Add To Cart</span>
          </button>
        </div>

        <div className="pl-[0.5rem] pb-[0.5rem] flex flex-col items-start gap-[0.5rem]">
          <h4 className="text-text-2 max-w-[16.875rem] truncate font-inter text-[1.5rem] lg:text-[1rem] font-[500] leading-[1.5rem] overflow-hidden">
            <Link href={`/${product.id}`}>{product?.name}</Link>
          </h4>

          <div className="flex items-start gap-[0.57rem]">
            <div className="text-secondary-2 font-inter text-[1rem] font-[500] leading-[1.5rem]">
              ${product?.discountedPrice}
            </div>

            <div className="text-text-2 font-inter text-[1rem] font-[500] leading-[1.5rem] line-through opacity-[0.5]">
              ${product?.price}
            </div>
          </div>

          <div className="flex items-start gap-[0.5rem]">
            <div className="flex items-start">{renderStars(product?.rate || 4.5)}</div>

            <div className="min-w-[2rem] min-h-[1.25rem] text-text-2 font-inter text-[0.875rem] font-[600] leading-[1.3125rem] opacity-[0.5]">
              ({product?.rateCount || 99})
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardBestSelling;

CardBestSelling.propTypes = {
  product: PropTypes.instanceOf(Object).isRequired,
};
