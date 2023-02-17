import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import 'firebase/auth';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, dbFirebase } from '../firebase';

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ["authApi"],
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => {
        const user = auth.currentUser;
        console.log(user);
        if (user) {
          return user;
        } else {
          throw new Error('유저정보가 없습니다.');
        }
      },
      providesTags: ["authApi"],
    }),
  }),
});

export const { useGetCurrentUserQuery } = authApi;

type Post = {
  id: string;
  author: string;
  createAt: string;
  photo: string[];
  text: string;
};

type Posts = Post[];

export const postsApi = createApi({
  reducerPath: "posts",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    fetchPosts: builder.query<Posts, void>({
      // since we are using fakeBaseQuery we use queryFn
      async queryFn() {
        try {
          // posts is the collection name
          const blogRef = collection(dbFirebase, "posts");
          const querySnaphot = await getDocs(blogRef);
          let posts: Post[] = [];
          querySnaphot?.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() } as Post);
          });
          return { data: posts };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Post"],
    }),
    //***************SINGLE ITEM FETCHING*************** */
    fetchSinglePost: builder.query({
      async queryFn(id) {
        try {
          const docRef = doc(dbFirebase, "posts", id);
          const snapshot = await getDoc(docRef);
          return { data: snapshot.data() };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Post"],
    }),
  }),
});

export const { useFetchPostsQuery, useFetchSinglePostQuery } = postsApi;
