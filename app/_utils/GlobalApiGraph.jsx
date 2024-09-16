import { request, gql } from "graphql-request";
const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

export const getSlidersGraph = async () => {
  const query = gql`
    query MyQuery {
      sliders {
        image {
          url
        }
      }
    }
  `;
  const result = await request(graphqlAPI, query);
  console.log("console working")
  return result;
};

export const getCategories = async() =>{
    const query = gql`
      query MyQuery {
        categories {
          name
          icon {
            url
          }
        }
      }
    `;
    const result = await request(graphqlAPI, query);
    return result;
}
export const getProducts = async () => {
  const query = gql`
    query MyQuery {
      productsConnection {
        edges {
          node {
            addable
            createdAt
            description
            category {
              name
              id
              icon {
                url
              }
            }
            id
            image {
              url
            }
            itemQuantityType
            mrp
            name
            sellingPrice
          }
        }
      }
    }
  `;
  const result = await request(graphqlAPI, query);
  return result;
};

export const getProductsByCategories = async (category) => {
  const query = gql`
    query MyQuery {
      products(where: { category: { name: "`+category+`" } }) {
        addable
        category {
          name
          id
          icon {
            url
          }
        }
        createdAt
        description
        id
        image {
          url
        }
        itemQuantityType
        mrp
        name
        sellingPrice
        slug
      }
    }
  `;
  const result = await request(graphqlAPI, query);
  return result;
};

export const addToCart = async (data) => {
  const mutationQuery = gql`
    mutation MyMutation {
      createCart(
        data: {
          userId: "`+data.userId+`"
          product: { connect: { id: "`+data.product+`" } }
          amount: `+data.amount+`
          quantity: `+data.quantity+`
          from: "`+data.fromDate+`"
          to: "`+data.toDate+`"
        }
      ) {
        id
      }
      publishManyCarts(to: PUBLISHED) {
        count
      }
    }
  `;
  const result = await request(graphqlAPI, mutationQuery);
  return result;
};

export const getCartItemsGraph = async (userId) => {
  const mutationQuery = gql`
    query MyQuery {
      carts(where: { userId: "`+userId+`" }) {
        amount
        from
        id
        to
        product {
          id
          name
          sellingPrice
          image {
            url
          }
        }
        quantity
      }
    }
  `;
  const result = await request(graphqlAPI, mutationQuery);
  return result;
};

export const deleteCartItem = async (cartId) => {
  const mutationQuery = gql`
    mutation MyMutation {
      deleteCart(where: { id: "`+cartId+`" }) {
        id
      }
    }
  `;
  const result = await request(graphqlAPI, mutationQuery);
  return result;
};

export const createOrder = async (email,username,userId,billAmount,address,phone) => {
 
  const query = gql`mutation MyMutation {
  createOrder(data: {email: "`+email+`", name: "`+username+`", userId: "`+userId+`", totalOrderAmount: "`+billAmount+`", address: "`+address+`", phone: "`+phone+`", orderStatus: orderReceived}) {
    id
  }
}
  `;
  const orderResponse = await request(graphqlAPI, query);
  return orderResponse;

};

export const updateOrderToAddOrderItem = async(amount,quantity,productId,resultId,userId,from,to)=>{
  const query = gql`
    mutation MyMutation {
      updateOrder(
        data: {
          orderItemList: {
            create: {
              OrderItem: {
                data: {
                  quantity: `+quantity+`
                  amount: `+amount+`
                  from: "`+from+`"
                  to: "`+to+`"
                  product: {
                    connect: {
                      id: "`+productId+`"
                    }
                  }
                }
              }
            }
          }
        }
        where: { id: "`+resultId+`" }
      ) {
        id
      }
        publishManyOrders(to: PUBLISHED){
          count
        }
        deleteManyCarts(where: {userId: "`+userId+`"}){
          count
        }
    }
  `;
  const result = await request(graphqlAPI,query);
  console.log(result,"update order")
  return result;
}


export const getMyOrders = async (userId) => {
  const query = gql`query MyQuery {
  orders(where: {userId: "`+userId+`"}) {
    id
    totalOrderAmount
    createdAt
    orderStatus
    orderItemList {
      ... on OrderItem {
        id
        amount
        from
        quantity
        to
        product {
          image {
            url
          }
          name
          mrp
        }
      }
    }
  }
}
  `;
  const result = await request(graphqlAPI, query);
  console.log(result,"get My Orders")
  return result;
};