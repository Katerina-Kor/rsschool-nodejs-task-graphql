import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UUIDType } from "./types/uuid.js";
import { Context, Args, RootObject } from "./types/types.js";
import { UserType } from "./types/user.js";
import { PostType } from "./types/post.js";
import { ProfileType } from "./types/profile.js";
import { MemberType, MemberTypeId } from "./types/memberType.js";

export const rootQueryType = new GraphQLObjectType<RootObject, Context>({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_obj, _args, context) => {
        return context.prisma.user.findMany();
      },
    },

    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obg, { id }: Args, context) => {
        return await context.prisma.user.findUnique({
          where: { id },
        });
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_obj, _args, context) => {
        return context.prisma.post.findMany();
      },
    },

    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obj, { id }: Args, context) => {
        return await context.prisma.post.findUnique({
          where: { id }
        });
      }
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_obj, _args, context) => {
        return context.prisma.profile.findMany();
      },
    },

    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obj, { id }: Args, context) => {
        return await context.prisma.profile.findUnique({
          where: { id }
        });
      },
    },

    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_obj, _args, context) => {
        return context.prisma.memberType.findMany();
      },
    },

    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId)},
      },
      resolve: async (_obj, { id }: Args, context) => {
        return await context.prisma.memberType.findUnique({
          where: { id },
        });
      },
    },
  }
});
