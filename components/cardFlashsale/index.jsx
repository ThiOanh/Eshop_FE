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
// import { checkTime } from "@/helper/checkTimeFlashSale";
import { renderStars } from "@/helper/renderStar";
import useCartStore from "@/store/cart/useCartStore";

import Loading from "../svg/loading";

function CardFlashsale(props) {
  let { product } = props;

  product = {
    ...product,
    discountedPrice: (parseInt(product?.price, 10) * (100 - parseInt(product?.discount, 10))) / 100,
  };

  // const [api, contextHolder] = notification.useNotification();

  const addFlashsaleToCart = useCartStore((state) => state.addFlashsaleToCart);

  // const cart = useCartStore((state) => state.cart);

  const isLoadingAddCart = useCartStore((state) => state.isLoading);

  // const [isLoadingLocal, setIsLoadingLocal] = useState(false);

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
      // setIsLoadingLocal(true);

      const getToken = getCookie("TOKEN");
      const getRefreshToken = getCookie("REFRESH_TOKEN");

      // const [checkStockFlashsale, getTimeFlashsale] = await Promise.all([
      //   axiosClient.get(`/flashSale/check-flashsale?productId=${item.id}`),
      //   axiosClient.get("/time-flashsale"),
      // ]);

      // if (getTimeFlashsale.data.payload.expirationTime) {
      //   let endOfSale = getTimeFlashsale.data.payload.expirationTime.slice(0, 10);

      //   endOfSale += " 23:59:59";

      //   const checkTimeF = checkTime(endOfSale);

      //   if (checkTimeF <= 0) {
      //     openNotificationWithIcon("error", "The flash sale period has ended");

      //     return;
      //   }

      //   if (!getTimeFlashsale.data.payload.isOpenFlashsale) {
      //     openNotificationWithIcon("error", "Flash sale has not opened yet");

      //     return;
      //   }
      // }

      // if (checkStockFlashsale.data.flashsaleStock <= 0) {
      //   openNotificationWithIcon("error", "The product has been sold out");
      //   return;
      // }

      // if (cart.length > 0) {
      //   openNotificationWithIcon("error", "The shopping cart contains flash sale products, which cannot be added!!!");
      //   return;
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

          addFlashsaleToCart(data);

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
    [addFlashsaleToCart],
  );

  // useEffect(() => {
  // if () {

  // }
  // }, []);

  return (
    <>
      {/* {contextHolder} */}

      <div className="h-[22.875rem] w-[16.875rem] flex flex-col items-start gap-[1rem] rounded-[0.25rem]">
        <div className="group relative flex items-center justify-center min-w-[16.875rem] min-h-[15.625rem] rounded-[0.25rem] bg-primary-1">
          <div className="absolute top-[0.75rem] left-[0.75rem] inline-flex px-[0.75rem] py-[0.25rem] justify-center items-center gap-[0.625rem] rounded-[0.25rem] bg-secondary-2">
            <span className="text-text-1 font-inter text-[0.75rem] font-[400] leading-[1.125rem]">
              -{product.discount}%
            </span>
          </div>

          <div className="absolute top-[10rem] left-[0.75rem] inline-flex px-[0.75rem] py-[0.25rem] justify-center items-center gap-[0.625rem] rounded-[0.25rem] bg-secondary-2">
            <span className="text-text-1 font-inter text-[1.25rem] font-[600] leading-[1.125rem]">
              Stock: {product.stock}
            </span>
          </div>

          {isLoadingAddCart && (
            <div className="absolute top-[6rem] left-[7.4rem]">
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
              className="max-w-[16.875rem] max-h-[15.625rem] object-contain rounded-[0.25rem]"
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
          <h4 className="text-text-2 max-w-[16.875rem] truncate font-inter text-[1rem] font-[500] leading-[1.5rem] overflow-hidden">
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

export default CardFlashsale;

CardFlashsale.propTypes = {
  product: PropTypes.instanceOf(Object).isRequired,
};
