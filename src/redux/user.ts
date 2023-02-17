import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import 'firebase/auth';
import { auth } from '../firebase';

interface User {
  uid: string;
  email: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => {
        const user = auth.currentUser;
        if (user) {
          const { uid, email } = user;
          return {
            url: '/user',
            headers: {
              // Include any necessary headers, such as authorization tokens
            },
            body: { uid, email },
          };
        } else {
          throw new Error('유저정보가 없습니다.');
        }
      },
    }),
  }),
});

export const { useGetUserQuery } = authApi;
