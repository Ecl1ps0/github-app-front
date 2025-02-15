import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Channel } from "../../models/Channel.entity";
import { notification } from "antd";

export const channelApi = createApi({
  reducerPath: "channelApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/api/channels" }),
  endpoints: (builder) => ({
    postCreateChannel: builder.mutation<
      { channel_id: string },
      { name: string; description: string }
    >({
      query: (channelData) => ({
        url: "/create",
        method: "POST",
        body: channelData,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;

          notification.success({
            message: "Success",
            description: "Channel created successfully!",
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
    getChannel: builder.query<Channel, string>({
      query: (channelId) => `/${channelId}`,
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          notification.error({
            message: "Error",
            description: error as string,
            duration: 5,
          });
        }
      },
    }),
    getUserChannels: builder.query<Channel[], string>({
      query: (userId) => `/user/${userId}`,
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          notification.error({
            message: "Error",
            description: error as string,
            duration: 5,
          });
        }
      },
    }),
    getUserChannelsNotParticipating: builder.query<Channel[], string>({
      query: (userId) => `/user/${userId}/not-participating`,
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
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

export const {
  usePostCreateChannelMutation,
  useGetChannelQuery,
  useGetUserChannelsQuery,
  useGetUserChannelsNotParticipatingQuery,
} = channelApi;
