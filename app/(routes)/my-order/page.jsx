'use client'
import GlobalApi from "@/app/_utils/GlobalApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import moment from "moment";
import MyOrderItem from "./_component/MyOrderItem";
import { useUser } from "@clerk/nextjs";
import { getMyOrders } from "@/app/_utils/GlobalApiGraph";

function MyOrder() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    if (user) {
      getMyOrder();
    }
  }, [user]);

  const getMyOrder = async () => {
    const orderList_ = await getMyOrders(user.id);
    console.log("Order List ->", orderList_);
    setOrderList(orderList_.orders);
  };

  if (!isSignedIn) {
    return <div>Please wait...</div>;
  }

  return (
    <div>
      <h2 className="p-3 bg-primary text-xl font-bold text-center text-white">
        My Order
      </h2>
      <div className="py-8 mx-7 md:mx-20">
        <h2 className="text-3xl font-bold text-primary">Order History</h2>
        <div className="mt-10">
          {orderList.length === 0 ? (
            <div>No orders found.</div>
          ) : (
            orderList.map((item, index) => (
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="border p-2 bg-slate-100 flex w-full gap-24">
                      <h2>
                        <span className="font-bold mr-2">Order Date: </span>
                        {item?.createdAt
                          ? moment(item?.createdAt).format("DD/MMM/yyyy")
                          : "nil"}
                      </h2>
                      <h2>
                        <span className="font-bold mr-2">Total Amount:</span>{" "}
                        {item?.totalOrderAmount}
                      </h2>
                      <h2>
                        <span className="font-bold mr-2">Status:</span>{" "}
                        {item?.orderStatus}
                      </h2>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.orderItemList.map((order, index_) => (
                      <MyOrderItem orderItem={order} key={index_} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrder;