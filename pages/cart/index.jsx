import React, { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import UpdateCart from "@/components/buttons/updateCart";
import ViewAllProducts from "@/components/buttons/viewAllProduct";
import ProcessLoader from "@/components/loader/processLoader";
import CanCel from "@/components/svg/cancel";

import { axiosClient } from "@/helper/axios/axiosClient";
import { formattedMoney } from "@/helper/formatDocument";
import useCartStore from "@/store/cart/useCartStore";
// import useNotificationUpdateCart from "@/store/showNotificationUpdateCart";

function CartPage() {
  const router = useRouter();
  let totalPrice = 0;
  const [isChanged, setIsChanged] = useState({
    update: false,
    checkout: false,
  });
  const [cartItem, setCartItem] = useState([]);
  const [inputCoupon, setInputCoupon] = useState("");

  const [isFlashsale, setIsFlashsale] = useState(false);

  // const OpenNotificationUpdateCart = useNotificationUpdateCart((state) => state.openNotification);

  // const CloseNotificationUpdateCart = useNotificationUpdateCart((state) => state.closeNotification);

  const cartData = useCartStore((state) => state);

  // const increase = useCartStore((state) => state.increase);

  // const reduce = useCartStore((state) => state.reduce);

  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const applyCoupon = useCartStore((state) => state.applyCoupon);

  // const timeoutRef = useRef(null);

  const checkFlashsale = useCallback(async () => {
    const check = await axiosClient.get(`/flashsale/check-flashsale?productId=${cartData.cart[0]?.product?.productId}`);

    if (check.data.message === "found") {
      setIsFlashsale(true);

      return true;
    }

    return false;
  }, [cartData]);

  useEffect(() => {
    if (cartData.cart && cartData.cart.length > 0) {
      checkFlashsale();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartData.cart]);

  const handleClickIncrease = useCallback(
    async (index) => {
      const newItem = cartItem;
      setIsChanged((prev) => ({
        ...prev,
        update: true,
        checkout: true,
      }));
      const valueQuantity = parseInt(document.getElementById(`quantity${index}`).value, 10);
      if (valueQuantity >= newItem[index].productDetail.stock) {
        document.getElementById(`quantity${index}`).value = newItem[index].productDetail.stock;
        newItem[index].product.quantity = newItem[index].productDetail.stock;
        setCartItem(newItem);
        message.error("Không đủ sản phẩm");
      } else {
        document.getElementById(`quantity${index}`).value = parseInt(valueQuantity, 10) + 1;
        newItem[index].product.quantity += 1;
        setCartItem(newItem);
      }
    },
    [cartItem],
  );
  const handleChangeQuantity = useCallback(
    (value, index) => {
      setIsChanged((prev) => ({
        ...prev,
        update: true,
        checkout: true,
      }));
      const newItem = cartItem;
      if (value > newItem[index].productDetail.stock) {
        document.getElementById(`quantity${index}`).value = newItem[index].productDetail.stock;
        newItem[index].product.quantity = newItem[index].productDetail.stock;
        setCartItem(newItem);
        message.error("Số lượng không đủ");
      } else if (value < 1) {
        document.getElementById(`quantity${index}`).value = 1;
        newItem[index].product.quantity = 1;
        setCartItem(newItem);
        message.error("Số lượng không hợp lệ");
      } else {
        newItem[index].product.quantity = parseInt(value, 10);
        setCartItem(newItem);
      }
    },
    [cartItem],
  );
  const handleClickReduce = useCallback(
    (index) => {
      setIsChanged((prev) => ({
        ...prev,
        update: true,
        checkout: true,
      }));
      const newItem = cartItem;
      const valueQuantity = parseInt(document.getElementById(`quantity${index}`).value, 10);
      if (valueQuantity <= 1) {
        const text = "Are you sure, you want to delete this?";
        // eslint-disable-next-line no-alert
        if (window.confirm(text) === true) {
          cartData.removeFromCart(newItem[index].product);
          return;
        }
        return;
      }
      document.getElementById(`quantity${index}`).value = parseInt(valueQuantity, 10) - 1;
      newItem[index].product.quantity -= 1;
      setCartItem(newItem);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cartItem],
  );

  const handleClickRemoveFromCart = useCallback(
    (product) => {
      // eslint-disable-next-line no-alert
      if (window.confirm("Are you sure, you want to delete this?") === true) {
        removeFromCart(product);
      }
    },
    [removeFromCart],
  );

  const handleChangeInputCoupon = useCallback((e) => {
    setInputCoupon(e.target.value);
  }, []);

  const handleClickApplyCoupon = useCallback(
    (e) => {
      e.preventDefault();
      applyCoupon(inputCoupon);
    },
    [applyCoupon, inputCoupon],
  );

  const handleClickUpdateCart = useCallback(() => {
    if (isChanged === false) {
      message.warning("Không có gì để cập nhật");
      return;
    }
    cartData.updateCart(cartItem);
    setIsChanged((prev) => ({
      ...prev,
      update: false,
      checkout: false,
    }));
    // OpenNotificationUpdateCart();

    // if (timeoutRef.current) {
    //   clearTimeout(timeoutRef.current);
    // }

    // timeoutRef.current = setTimeout(() => {
    //   CloseNotificationUpdateCart();

    //   clearTimeout(timeoutRef.current);

    //   timeoutRef.current = null;
    // }, 3000);
  }, [cartItem, cartData, isChanged]);
  const handleClickCheckoutCart = useCallback(async () => {
    const checkFl = await checkFlashsale();

    setIsChanged((prev) => ({
      ...prev,
      update: false,
      checkout: true,
    }));
    if (isChanged === true) {
      message.warning("Vui lòng cập nhật trước khi checkout");
    } else if (checkFl) {
      router.push("/checkout-flashsale");
    } else {
      router.push("/checkout");
    }
  }, [checkFlashsale, isChanged, router]);

  useEffect(() => {
    if (cartData.cart.length > 0) {
      setCartItem(cartData.cart);
    }
  }, [cartData]);
  useEffect(() => {
    cartData.getListCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <ProcessLoader isLoading={cartData.isLoading} />
      {cartData.cart.length > 0 ? (
        <div className="container mt-[5rem] flex flex-col items-center justify-center">
          <div className="flex items-center gap-[0.75rem] max-h-[1.3125rem] min-w-full">
            <Link
              href="/"
              className="text-text-2 font-inter text-[0.875rem] font-[400] leading-[1.3125rem] opacity-[0.5]"
            >
              Home
            </Link>

            <span className="flex items-center justify-center w-[0.82456rem] text-text-2 opacity-[0.5] mb-[0.3rem]">
              /
            </span>

            <span className="text-text-2 font-inter text-[0.875rem] font-[400] leading-[1.3125rem]">Cart</span>
          </div>

          <div className="inline-flex flex-col items-start gap-[2rem] sm:gap-[5rem] mt-[5rem]">
            <div className="flex flex-col items-start gap-[1.5rem]">
              <div className="xl:flex xl:flex-col items-center xl:gap-[2.5rem]">
                <div className="flex xl:max-w-[73.125rem] max-w-[43.8rem] min-h-[4.5rem] pt-[1.5rem] pr-[2.4375rem] pb-[1.5rem] pl-[2.5rem] rounded-[0.25rem] bg-primary-1 shadow-custom">
                  <div className="flex items-center xl:gap-[17.75rem] sm:gap-[8rem]">
                    <span className="text-text-2 font-inter text-[1rem] font-[400] leading-[1.5rem]">Product</span>

                    <span className="text-text-2 ml-[1rem] sm:ml-0 font-inter text-[1rem] font-[400] leading-[1.5rem]">
                      Price
                    </span>

                    <span className="text-text-2 sm:ml-0 ml-[2.2rem] font-inter text-[1rem] font-[400] leading-[1.5rem]">
                      Quantity
                    </span>

                    <span className="text-text-2 sm:ml-0 ml-[1rem] font-inter text-[1rem] font-[400] leading-[1.5rem]">
                      Subtotal
                    </span>
                  </div>
                </div>
                <form
                  id="quantity_form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleClickUpdateCart();
                  }}
                >
                  {cartData.cart.map((item, idx) => {
                    totalPrice += item.productDetail.price * item.product.quantity;
                    return (
                      <div
                        key={item.product._id}
                        className="relative group flex items-center justify-start xl:min-w-[73.125rem] min-h-[6.375rem] rounded-[0.25rem] bg-primary-1 shadow-custom"
                      >
                        <Image
                          title={item.productDetail.name}
                          className="max-w-[3.125rem] max-h-[2.4375rem] flex items-center justify-center flex-shrink-0 ml-[2.5rem] object-contain"
                          src={item.image.location}
                          alt="..."
                          width={1000}
                          height={1000}
                        />

                        <button
                          onClick={() => handleClickRemoveFromCart(item.product)}
                          type="button"
                          className="absolute top-[1rem] left-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <CanCel />
                        </button>

                        <Link
                          className="xl:min-w-[16rem] xl:max-w-[16rem] sm:max-w-[6rem] max-w-[0rem] max-h-[1.5rem] overflow-hidden whitespace-nowrap text-ellipsis text-text-2 font-inter text-[1rem] font-[400] leading-[1.5rem] ml-[1.25rem]"
                          href={`/${item.productDetail._id}`}
                        >
                          <span
                            title={item.productDetail.name}
                            className="xl:min-w-[16rem] xl:max-w-[16rem] sm:max-w-[6rem] max-w-[0rem] max-h-[1.5rem] overflow-hidden whitespace-nowrap text-ellipsis text-text-2 font-inter text-[1rem] font-[400] leading-[1.5rem] ml-[1.25rem]"
                          >
                            {item.productDetail.name}
                          </span>
                        </Link>

                        <span className="w-[2.5625rem] max-h-[1.5rem] text-text-2 font-inter text-[1rem] font-[400] leading-[1.5rem] xl:ml-[1.06rem] sm:ml-[1.5rem] ml-[0.5rem]">
                          {formattedMoney(item.productDetail.price)}
                        </span>

                        <div className="flex min-w-[4.5rem] box-border max-h-[2.75rem] px-[0.75rem] py-[0.375rem] justify-center items-center flex-shrink-0 rounded-[0.25rem] border-[1.5px] border-solid border-[rgba(0,0,0,0.40)] xl:ml-[17.63rem] sm:ml-[7.8rem] ml-[2rem]">
                          {isFlashsale ? (
                            <span className="cursor-default min-w-[1rem] max-h-[1.5rem] text-text-2 font-inter text-[1rem] font-[400] leading-[1.5rem]">
                              {item.product.quantity}
                            </span>
                          ) : (
                            <div className="flex max-w-[4rem] max-h-[2rem] items-center gap-[1rem] flex-shrink-0">
                              <span className="min-w-[1rem] max-h-[1.5rem] text-text-2 font-inter text-[1rem] font-[400] leading-[1.5rem]">
                                <input
                                  type="number"
                                  name="quantity"
                                  id={`quantity${idx}`}
                                  className="w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  defaultValue={item.product.quantity}
                                  onChange={(e) =>
                                    e.target.value
                                      ? handleChangeQuantity(e.target.value, idx)
                                      : setIsChanged((prev) => ({
                                          ...prev,
                                          update: true,
                                          checkout: true,
                                        }))
                                  }
                                  required
                                />
                              </span>

                              <div className="flex flex-col items-center justify-center">
                                <button
                                  onClick={() => handleClickIncrease(idx)}
                                  type="button"
                                  className="max-w-[1rem] max-h-[1rem]"
                                >
                                  <ChevronUp className="max-w-[1rem] max-h-[1rem]" />
                                </button>

                                <button
                                  onClick={() => handleClickReduce(idx)}
                                  type="button"
                                  className="max-w-[1rem] max-h-[1rem]"
                                >
                                  <ChevronDown className="max-w-[1rem] max-h-[1rem]" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <span className="min-w-[2.5625rem] max-h-[1.5rem] text-text-2 font-inter text-[1rem] font-[400] leading-[1.5rem] xl:ml-[17.56rem] sm:ml-[7.7rem] ml-[0.7rem]">
                          {formattedMoney(
                            (parseInt(item.product.quantity, 10) * parseFloat(item.productDetail.price)).toFixed(2),
                          )}
                        </span>
                      </div>
                    );
                  })}
                </form>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 sm:gap-0 items-start xl:gap-[47.3125rem] sm:min-w-[43.8rem] min-w-[20rem] justify-between">
                <button
                  onClick={() => {
                    window.history.back();
                  }}
                  type="button"
                  className="flex px-[3rem] py-[1rem] h-[3.5rem] justify-center items-center gap-[0.625rem] rounded-[0.25rem] border-solid border-[1px] border-[rgba(0,0,0,0.50)]"
                >
                  <span className="text-text-2 font-inter text-[1rem] font-[500] leading-[1.5rem] h-[1.5rem] whitespace-nowrap">
                    Return To Shop
                  </span>
                </button>

                <button
                  // onClick={() => handleClickUpdateCart()}
                  // onClick={() => handleSubmit(onSubmit)}
                  type="submit"
                  form="quantity_form"
                  className="disabled:opacity-50 min-w-[13.7rem] sm:min-w-fit flex px-[3rem] py-[1rem] h-[3.5rem] justify-center items-center gap-[0.625rem] rounded-[0.25rem] border-solid border-[1px] border-[rgba(0,0,0,0.50)]"
                  disabled={!isChanged.update}
                >
                  <span className=" text-text-2 font-inter text-[1rem] font-[500] leading-[1.5rem] h-[1.5rem] whitespace-nowrap">
                    Update Cart
                  </span>
                </button>
              </div>
            </div>

            <div className="xl:flex grid grid-cols-12 items-start xl:gap-[10.8125rem] min-w-full">
              <div className="flex flex-col col-span-12 items-start justify-start xl:gap-[3rem] xl:mb-0 mb-10">
                <form className="min-w-full sm:min-w-fit flex flex-col sm:flex-row items-start sm:items-center justify-center gap-[1rem]">
                  <input
                    type="text"
                    placeholder="Type freeship or 10%"
                    onChange={handleChangeInputCoupon}
                    className="min-w-full sm:min-w-[18.75rem] max-h-[3.5rem] box-border px-[1.5rem] py-[1rem] text-text-2 font-inter text-[1rem] font-[400] leading-[1.5rem] flex items-center rounded-[0.25rem] border-[1px] border-solid border-black"
                  />

                  <ViewAllProducts text="Apply Coupon" type="submit" onClick={handleClickApplyCoupon} />
                </form>

                <span className="text-text-2 font-inter text-[1rem] font-[400] leading-[1.5rem]">
                  {cartData.coupon}
                </span>
              </div>

              <div className="min-w-full xl:min-w-fit col-span-12 flex justify-end">
                <div className="flex flex-col xl:pt-0 pt-[2rem] col-span-12 items-start justify-center max-w-[29.375rem] max-h-[20.25rem] box-border rounded-[0.25rem] border-[1.5px] border-solid border-black">
                  <span className="mt-[2rem] ml-[1.5rem] min-w-[6.25rem] min-h-[1.75rem] text-text-2 font-inter text-[1.25rem] font-[500] leading-[1.75rem]">
                    Cart Total
                  </span>

                  <div className="inline-flex mx-[1.5rem] mt-[1.5rem] items-start min-w-[20rem] sm:min-w-[26.375rem] justify-between">
                    <span className="text-text-2 font-inter text-[1rem] font-[400] leading-[1.5rem]">Subtotal:</span>

                    <span className="text-text-2 font-inter text-[1rem] font-[400] leading-[1.5rem]">
                      {formattedMoney(totalPrice)}
                    </span>
                  </div>

                  <hr className="mx-[1.5rem] min-w-[20rem] sm:min-w-[26.375rem] mt-[1rem] border-solid border-[1px] border-gray-400" />

                  <div className="inline-flex mx-[1.5rem] mt-[1rem] items-start min-w-[20rem] sm:min-w-[26.375rem] justify-between">
                    <span className="text-text-2 font-inter text-[1rem] font-[400] leading-[1.5rem]">Shipping:</span>

                    <span className="text-text-2 font-inter text-[1rem] font-[400] leading-[1.5rem]">
                      {`$${cartData.shipping}`}
                    </span>
                  </div>

                  <hr className="mx-[1.5rem] min-w-[20rem] sm:min-w-[26.375rem] mt-[1rem] border-solid border-[1px] border-gray-400" />

                  <div className="inline-flex mx-[1.5rem] mt-[1rem] mb-[1rem] items-start min-w-[20rem] sm:min-w-[26.375rem] justify-between">
                    <span className="text-text-2 font-inter text-[1rem] font-[400] leading-[1.5rem]">Total:</span>

                    <span className="text-text-2 font-inter text-[1rem] font-[400] leading-[1.5rem]">
                      {formattedMoney(totalPrice + cartData.shipping)}
                    </span>
                  </div>

                  {/* <Link href="/checkout" className="ml-[3.43rem] sm:ml-[5.56rem] mb-[2rem]"> */}
                  <div className="ml-[3.43rem] sm:ml-[5.56rem] mb-[2rem]">
                    <UpdateCart
                      text="Process to checkout"
                      type="button"
                      onClick={() => {
                        handleClickCheckoutCart();
                      }}
                      disabled={isChanged?.update || false}
                    />
                  </div>
                  {/* </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[25vh] container flex items-center justify-center">
          <p>Vui lòng thêm sản phẩm vào giỏ hàng</p>
        </div>
      )}
    </>
  );
}

export default CartPage;
