'use client';
//error handling addded
import GlobalApi from '@/app/_utils/GlobalApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCardIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getCookie } from 'cookies-next';
import { createOrder, getCartItemsGraph, updateOrderToAddOrderItem } from '@/app/_utils/GlobalApiGraph';
import { useUser } from '@clerk/nextjs';
import { UpdateCartContext } from '@/app/_context/UpdateCartContext';
const Checkout = () => {
  const jwt = getCookie("jwt");
  const userData = getCookie("user");
  const [totalCartItem, setTotalCartItem] = useState(0);
  const [subtotal, setSubTotal] = useState(0);
  const [billAmount, setBillAmount] = useState(0);
  const [cartItemList, setCartItemList] = useState([]);
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
  const [address, setAddress] = useState('');
   const { updateCart, setUpdateCart } = useContext(UpdateCartContext);
  const { user, isSignedIn,isLoaded } = useUser();
  useEffect(() => {
    getCartItems();
  }, []);
    const getCartItems = async () => {
      try {
       

        const cartItemList_ = await getCartItemsGraph(user.id);

        if (Array.isArray(cartItemList_.carts)) {
          setCartItemList([...cartItemList_.carts]);
          setTotalCartItem(cartItemList_.carts.length);
        } else {
          throw new Error("Cart items data is not in expected array format.");
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Failed to fetch cart items. Please try again later.");
        setCartItemList([]);
      }
    };


  useEffect(() => {
    try {
      let total = 0;
      cartItemList.forEach((element) => {
        const amount = parseFloat(element.amount);
        if (!isNaN(amount)) {
          total += amount;
        } else {
          console.warn(`Invalid amount for item ${element.name}:`, element.amount);
        }
      });
      setBillAmount((total * 1.1 + 15).toFixed(0));
      setSubTotal(total);
    } catch (error) {
      console.error('Error calculating total amounts:', error);
      toast.error('Failed to calculate total amounts.');
    }
  }, [cartItemList]);

  const calculateTotalAmount = () => {
    try {
      const totalAmount = subtotal + subtotal * 0.1 + 15;
      return totalAmount;
    } catch (error) {
      console.error('Error calculating total amount:', error);
      toast.error('Failed to calculate total amount.');
      return 0;
    }
  };

  const calculateTaxAmount = () => {
    try {
      const taxAmount = subtotal * 0.1;
      return taxAmount;
    } catch (error) {
      console.error('Error calculating tax amount:', error);
      toast.error('Failed to calculate tax amount.');
      return 0;
    }
  };

  const onApprove = () => {
    try {

      const data = {
        data: {
          totalAmount: billAmount,
          userName: username,
          email: email,
          phone: phone,
          address: address,
          userId: user.id,
        },
      };
      console.log(data)
      console.log(cartItemList,"Cart Items")
      createOrder(email,username,user.id,billAmount,address,phone)
        .then((resp) => {
          console.log(resp)
          const resultId = resp?.createOrder?.id;
          if(resultId){
            cartItemList.forEach((item)=>{
              updateOrderToAddOrderItem(item.amount,item.quantity,item.product.id,resultId,user.id,item.from,item.to).then(result=>{console.log(result)})
            })
          }
          toast.success('Order placed successfully.');
          setUpdateCart(!updateCart)
          router.replace('/order-confirmation');
        })
        .catch((error) => {
          console.error('Error placing order:', error);
          toast.error('Failed to place the order. Please try again.');
        });
    } catch (error) {
      console.error('Error in onApprove:', error);
      toast.error('Failed to process the order.');
    }
  };

  return (
    <div className=''>
      <h2 className='p-3 bg-primary text-xl font-bold text-center text-white'>Checkout</h2>
      <div className='p-5 px-5 md:px-10 grid grid-cols-1 md:grid-cols-3 py-8'>
        <div className='md:col-span-2 mx-20'>
          <h2 className='font-bold text-3xl'>Billing Details</h2>
          <div className='grid grid-cols-2 gap-10 mt-3'>
            <Input placeholder='Name' onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='grid grid-cols-2 gap-10 mt-3'>
            <Input placeholder='Phone' onChange={(e) => setPhone(e.target.value)} />
            <Input placeholder='Zip' onChange={(e) => setZip(e.target.value)} />
          </div>
          <div className='mt-3'>
            <Input placeholder='Address' onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>
        <div className='mx-10 border'>
          <h2 className='p-3 bg-gray-200 font-bold text-center'>Total Cart ({totalCartItem})</h2>
          <div className='p-4 flex flex-col gap-4'>
            <h2 className='font-bold flex justify-between'>Subtotal: <span>₹{subtotal}</span></h2>
            <hr />
            <h2 className='flex justify-between'>Delivery: <span>₹15.00</span></h2>
            <h2 className='flex justify-between'>Tax (10%): <span>₹{calculateTaxAmount()}</span></h2>
            <hr />
            <h2 className='font-bold flex justify-between'>Total: <span>₹{calculateTotalAmount()}</span></h2>
            <Button className='gap-3' onClick={() => onApprove()} disabled={!(username && email && address && zip)}>Payment <CreditCardIcon /></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
