'use client'
//error handling added
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  LoaderCircle,
  ShoppingBasket,
  Calendar as CalendarIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import GlobalApi from "../_utils/GlobalApi";
import { toast } from "sonner";
import { UpdateCartContext } from "../_context/UpdateCartContext";
import { format, differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getCookie } from "cookies-next";
import { useUser } from "@clerk/nextjs";
import { addToCart } from "../_utils/GlobalApiGraph";

const ProductItemDetail = ({ product }) => {
  const router = useRouter();
const {user,isSignedIn} = useUser()
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext);

  const [productTotalPrice, setProductTotalPrice] = useState(
    product.sellingPrice
      ? product.sellingPrice
      : product.mrp
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [isSubscription, setIsSubscription] = useState(false);
  const [subscriptionDays, setSubscriptionDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(productTotalPrice);

  useEffect(() => {
    if (isSubscription && fromDate && toDate) {
      const days = differenceInCalendarDays(toDate, fromDate) + 1;
      setSubscriptionDays(days);
      setTotalPrice(days * productTotalPrice * quantity);
    } else {
      setSubscriptionDays(0);
      setTotalPrice(productTotalPrice * quantity);
    }
  }, [isSubscription, fromDate, toDate, quantity, productTotalPrice]);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      if (!isSignedIn) {
        toast.error("You must be signed in to add items to the cart.");
        router.push("/sign-in");
        return;
      }

      if (!user || !user.id) {
        throw new Error("User data is missing. Please sign in again.");
      }

      if (!product || !product.id) {
        throw new Error("Product information is missing.");
      }

      const data = {
        userId: user.id,
        product: product.id,
        quantity: quantity,
        amount: totalPrice.toFixed(0),
        fromDate: fromDate ? fromDate.toISOString() : null,
        toDate: toDate ? toDate.toISOString() : null,
      };

      console.log("Data being sent to GraphQL mutation:", data);

      const response = await addToCart(data);
      toast.success("Added to cart successfully!");
      setUpdateCart(!updateCart);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error(error.message || "Error while adding product to cart.");
    } finally {
      setLoading(false);
    }
  };


  const isPastDay = (day) => {
    return day <= new Date();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-7 bg-white text-black">
      <Image
        className="bg-slate-200 p-5 h-[320px] w-[300px] object-contain rounded-lg"
        src={product.image.url}
        width={300}
        height={300}
        alt="Image"
      />
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <h2 className="text-sm text-gray-500">
          <h4 className="font-semibold text-gray-600">Benefits</h4>
          {product.description}
        </h2>
        <div className="flex gap-3">
          {product.sellingPrice && (
            <h2 className="text-xl">₹{product.sellingPrice}</h2>
          )}
          <h2
            className={`${
              product.sellingPrice &&
              " text-xl line-through text-gray-500 "
            }`}
          >
            ₹{product.mrp}
          </h2>
        </div>
        <h2 className="font-semibold text-lg">
          Quantity: {product.itemQuantityType}
        </h2>
        {product.addable ? (
          <div className="flex flex-col items-baseline gap-3">
            <div className="flex gap-3 items-center ">
              <div className="p-2 border-[2px] flex gap-10 items-center px-4">
                <button
                  disabled={quantity === 1}
                  onClick={() => setQuantity(quantity - 1)}
                >
                  -
                </button>
                <h2>{quantity}</h2>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <h2 className="font-semibold text-3xl">
                = ₹ {totalPrice}
              </h2>
            </div>
            <div>
              <div className="flex gap-2 my-2 items-center">
                <input
                  type="radio"
                  id="delivery"
                  name="orderType"
                  value="delivery"
                  checked={!isSubscription}
                  onChange={() => setIsSubscription(false)}
                />
                <label htmlFor="delivery">One-time Delivery</label>
              </div>
              <div className="flex gap-2 my-2 items-center">
                <input
                  type="radio"
                  id="subscription"
                  name="orderType"
                  value="subscription"
                  checked={isSubscription}
                  onChange={() => setIsSubscription(true)}
                />
                <label htmlFor="subscription">Subscription</label>
              </div>
              <div>
                <div className="flex gap-2 my-2 items-center">
                  <CalendarDays className="text-primary" />
                  <h6>{isSubscription ? "From" : "Delivery Date"}</h6>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                      disabled={isPastDay}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {isSubscription && (
                <div>
                  <div className="flex gap-2 my-2 items-center">
                    <CalendarDays className="text-primary" />
                    <h6>To</h6>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !toDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        initialFocus
                        disabled={isPastDay}
                      />
                    </PopoverContent>
                  </Popover>
                  <div>
                    <h6 className="mt-2">Subscription Period: {subscriptionDays} days</h6>
                  </div>
                </div>
              )}
            </div>
            <Button
              className="flex gap-3"
              onClick={handleAddToCart}
              disabled={loading}
            >
              <ShoppingBasket />
              {loading ? <LoaderCircle className="animate-spin" /> : "Add to Cart"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-baseline gap-3">
            <div className="flex gap-3 items-center ">
              <div className="p-2 border-[2px] flex gap-10 items-center px-4">
                <h1>This Product is not available right now</h1>
              </div>
            </div>
          </div>
        )}
        <h2>
          <span className="font-semibold">Category</span>:{" "}
          {product.category.name}{" "}
        </h2>
      </div>
    </div>
  );
};

export default ProductItemDetail;
