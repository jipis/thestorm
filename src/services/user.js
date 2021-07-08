import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/user/v1/'}),
  endpoints: builder => ({
    getUser: builder.query({
      query: () => {
        console.log("running query");
        return 'me';
      },
    }),
  }),
});

export const { useGetUserQuery } = userApi;
