import { gql } from "@apollo/client/core";

export const LOGIN_MUTATION = gql`
  mutation Login($loginUserInput: LoginUserInput!) {
    login(loginUserInput: $loginUserInput) {
      accessToken
      user {
        id
        email
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($registerUserInput: RegisterUserInput!) {
    register(registerUserInput: $registerUserInput) {
      accessToken
      user {
        id
        email
      }
    }
  }
`;

export const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      description
      address
      phoneNumber
      isActive
      countryId
      menuItems {
        id
        name
        description
        price
        isAvailable
      }
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($createOrderInput: CreateOrderInput!) {
    createOrder(createOrderInput: $createOrderInput) {
      id
      totalAmount
      orderStatus
      items {
        menuItemId
        quantity
        unitPrice
        subtotal
      }
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      totalAmount
      orderStatus
      restaurantId
      items {
        menuItemId
        quantity
        unitPrice
        subtotal
      }
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($orderId: Int!) {
    cancelOrder(orderId: $orderId) {
      id
      orderStatus
    }
  }
`;

export const GET_MY_PAYMENT_METHODS = gql`
  query GetMyPaymentMethods {
    myPaymentMethods {
      id
      methodName
      provider
      token
      isActive
    }
  }
`;

export const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod($createPaymentMethodInput: CreatePaymentMethodInput!) {
    addPaymentMethod(createPaymentMethodInput: $createPaymentMethodInput) {
      id
      methodName
      provider
      isActive
    }
  }
`;

export const DELETE_PAYMENT_METHOD = gql`
  mutation DeletePaymentMethod($id: Int!) {
    deletePaymentMethod(id: $id)
  }
`;

export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    allOrders {
      id
      userId
      restaurantId
      totalAmount
      orderStatus
      items {
        menuItemId
        quantity
        unitPrice
        subtotal
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      firstName
      lastName
      email
      isActive
      roleId
      countryId
    }
  }
`;

export const CREATE_RESTAURANT = gql`
  mutation CreateRestaurant($createRestaurantInput: CreateRestaurantInput!) {
    createRestaurant(createRestaurantInput: $createRestaurantInput) {
      id
      name
      description
      address
      phoneNumber
      isActive
      countryId
    }
  }
`;

export const ADD_MENU_ITEM = gql`
  mutation AddMenuItem($createMenuItemInput: CreateMenuItemInput!) {
    addMenuItem(createMenuItemInput: $createMenuItemInput) {
      id
      name
      description
      price
      isAvailable
      restaurantId
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($orderId: Int!, $status: String!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
      id
      orderStatus
    }
  }
`;
