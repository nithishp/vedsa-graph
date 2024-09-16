"use client";
//error handling added

import { Button } from "@/components/ui/button";
import {  CupSoda, Search, ShoppingBag, ShoppingCartIcon } from "lucide-react";
import logo from "../assets/img/logowithtext.png";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import GlobalApi from "../_utils/GlobalApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UpdateCartContext } from "../_context/UpdateCartContext";
import CartItemList from "./CartItemList";
import { toast } from "sonner";
import { UserButton, useUser } from "@clerk/nextjs";
import { deleteCartItem, getCartItemsGraph, getCategories } from "../_utils/GlobalApiGraph";

const Header = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [totalCartItem, setTotalCartItem] = useState(0);
  const [cartItemList, setCartItemList] = useState([]);
  const [subtotal, setSubTotal] = useState(0);

  const {user,isSignedIn} = useUser();
  const isLogin = isSignedIn ? true : false;
  const { updateCart } = useContext(UpdateCartContext);
  const router = useRouter();
  
  
  
  const getCategoriesGraph = async () => {
    const categorydata = await getCategories();
    setCategoryList(categorydata.categories)
  };
  
  useEffect(() => {
    getCategoriesGraph();
  }, []);



  useEffect(() => {
    getCartItems();
  }, [updateCart]);




  const getCartItems = async () => {
    try {
      if (!isSignedIn) {
        throw new Error("User or JWT is not available.");
      }

      const cartItemList_ = await getCartItemsGraph(user.id);
      

      if (Array.isArray(cartItemList_.carts)) {
        setCartItemList([...cartItemList_.carts]);
      } else {
        throw new Error("Cart items data is not in expected array format.");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to fetch cart items. Please try again later.");
      setCartItemList([]);
    }
  };



  const onDeleteItem = (id) => {
    deleteCartItem(id)
      .then(() => {
        toast.success("Item Removed!");
        getCartItems();
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        toast.error("Failed to remove item. Please try again.");
      });
  };

  useEffect(() => {
    let total = 0;
    cartItemList.forEach((element) => {
      const amount = parseFloat(element.amount);
      if (!isNaN(amount)) {
        total += amount;
      } else {
        console.warn(`Invalid amount for item ${element.name}:`, element.amount);
      }
    });
    setSubTotal(total);
  }, [cartItemList]);

    useEffect(() => {
      setTotalCartItem(cartItemList.length);
    }, [cartItemList]);


  return (
    <div className="px-5 pt-6 pb-6 shadow-sm flex justify-between">
      <div className="flex items-center gap-8">
        <div>
          <Link href={"/"}>
            <Image
              src={logo}
              alt="logo"
              width={150}
              height={100}
              className="cursor-pointer"
            />
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <h2 className="hidden md:flex gap-2 items-center border rounded-full p-2 px-10 bg-slate-200">
              <CupSoda className="h-5 w-5" /> Categories
            </h2>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Browse Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categoryList.length > 0 ? (
              categoryList.map((category, index) => {
                const iconUrl = category?.icon.url;
                return (
                  <Link
                    key={index}
                    href={"/products-category/" + category.name}
                  >
                    <DropdownMenuItem className="flex items-center cursor-pointer gap-4">
                      <Image src={iconUrl} alt="icon" width={23} height={23} />
                      <h2 className="ml-1">{category?.name}</h2>
                    </DropdownMenuItem>
                  </Link>
                );
              })
            ) : (
              <DropdownMenuItem>
                <h2>No categories available</h2>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-5 items-center">
        <Sheet>
          <SheetTrigger>
            <h2 className="flex gap-2 items-center text-lg">
              <ShoppingBag />
              <span className=" bg-primary text-white  px-2 rounded-full">
                {totalCartItem}
              </span>
            </h2>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="bg-primary text-white font-semibold text-lg p-2">
                My cart
              </SheetTitle>
              <SheetDescription>
                <CartItemList
                  cartItemList={cartItemList}
                  onDeleteItem={onDeleteItem}
                />
              </SheetDescription>
            </SheetHeader>
            <SheetClose asChild>
              <div className="flex-shrink-0 w-full bottom-6 flex flex-col mt-4">
                <h2 className="text-lg font-semibold flex justify-between">
                  Subtotal <span>₹{subtotal.toFixed(2)}</span>
                </h2>
                <Button
                  onClick={() =>
                    router.push(isSignedIn ? "/checkout" : "/sign-in")
                  }
                >
                  Checkout
                </Button>
              </div>
            </SheetClose>
          </SheetContent>
        </Sheet>

        {!isLogin ? (
          <Link href={"/sign-in"}>
            <Button>Login</Button>
          </Link>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Link
                label="My orders"
                labelIcon={<ShoppingCartIcon />}
                href="/my-order"
              />
            </UserButton.MenuItems>
          </UserButton>
          // <DropdownMenu>
          //   <DropdownMenuTrigger>
          //     <Image
          //       src={user?.imageUrl}
          //       width={35}
          //       height={35}
          //       alt="user"
          //       className="rounded-full"
          //     />
          //   </DropdownMenuTrigger>
          //   <DropdownMenuContent>
          //     <DropdownMenuLabel>My Account</DropdownMenuLabel>
          //     <DropdownMenuSeparator />
          //     <Link href={'/user'}>
          //     <DropdownMenuItem>Profile</DropdownMenuItem>
          //     </Link>
          //     <Link href={"/my-order"}>
          //       <DropdownMenuItem>My Orders</DropdownMenuItem>
          //     </Link>
          //     <DropdownMenuItem onClick={() => onSignOut()}>
          //       Logout
          //     </DropdownMenuItem>
          //   </DropdownMenuContent>
          // </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Header;
