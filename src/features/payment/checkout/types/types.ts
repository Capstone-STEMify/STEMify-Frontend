export type DeliveryOption = 'home' | 'collection';
export type DeliveryMethodKey = 'standard' | 'nextDay' | 'named';

export type CartItem = {
  id: string;
  title: string;
  imageUrl: string;
  qty: number;
  price: number;
};

export type Address = {
  firstName: string;
  lastName: string;
  phone: string;
  street1: string;
  street2?: string;
  country: string;
  city: string;
  postCode: string;
};

export type CheckoutState = {
  guestEmail?: string;
  deliveryOption: DeliveryOption;
  deliveryMethod: DeliveryMethodKey;
  address: Address;
  cart: CartItem[];
};
