import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { notification } from "antd";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/api/users" }),
  endpoints: (builder) => ({
    postJoinChannel: builder.mutation<
      void,
      { userId: string; channelId: string }
    >({
      query: ({ userId, channelId }) => ({
        url: `/${userId}/join/${channelId}`,
        method: "POST",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;

          notification.success({
            message: "Success",
            description: "You've joined the channel!",
            duration: 5,
          });
        } catch (error) {
          notification.error({
            message: "Error",
            description: error as string,
            duration: 5,
          });
        }
      },
    }),
  }),
});

export const { usePostJoinChannelMutation } = userApi;
