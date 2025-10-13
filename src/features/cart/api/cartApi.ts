import { Cart, CartQueryParams } from '@/features/cart/types/cart.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { ApiSuccessResponse } from '@/types/baseModel'

export const cartApi = createCrudApi<Cart, CartQueryParams>({
  reducerPath: 'cartApi',
  tagTypes: ['Cart'],
  baseUrl: '/carts'
}).injectEndpoints({
  endpoints: (builder) => ({
    getCartByUserId: builder.query<ApiSuccessResponse<Cart>, { userId: string }>({
      query: ({ userId }) => ({
        url: `/carts`,
        method: 'GET',
        params: { userId }
      })
    }),
    updateCartItems: builder.mutation<
      ApiSuccessResponse<Cart>,
      { userId: string; productId: number; quantity: number }
    >({
      query: ({ userId, productId, quantity }) => ({
        url: `/carts`,
        method: 'POST',
        body: { userId, productId, quantity }
      }),
      async onQueryStarted({ userId, productId, quantity }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedCart } = await queryFulfilled

          dispatch(
            cartApi.util.updateQueryData('getCartByUserId', { userId }, () => {
              return updatedCart
            })
          )
        } catch (err) {}
      }
    }),
    deleteCartItem: builder.mutation<ApiSuccessResponse<Cart>, { userId: string; productId: number }>({
      query: ({ userId, productId }) => ({
        url: `/carts/items/${productId}`,
        method: 'DELETE',
        params: { userId }
      }),
      async onQueryStarted({ userId, productId }, { dispatch, queryFulfilled }) {
        try {
          const { data: deleteCartItem } = await queryFulfilled

          dispatch(
            cartApi.util.updateQueryData('getCartByUserId', { userId }, () => {
              return deleteCartItem
            })
          )
        } catch (err) {}
      }
    })
  })
})

export const { useGetCartByUserIdQuery, useUpdateCartItemsMutation, useDeleteCartItemMutation } = cartApi
