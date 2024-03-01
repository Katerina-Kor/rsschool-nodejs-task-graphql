import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UUIDType } from "./types/uuid.js";
import { ContextType } from "./types/context.js";
import { UserType } from "./types/user.js";
import { ArgsType } from "./types/args.js";
import { PostType } from "./types/post.js";
import { ProfileType } from "./types/profile.js";
import { MemberType, MemberTypeId } from "./types/memberType.js";

export const rootQueryType = new GraphQLObjectType<unknown, ContextType>({
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
      resolve: async (_obg, { id }: ArgsType, context) => {
        const user = await context.prisma.user.findUnique({
          where: { id },
        });
         return user ? user : null;
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
      resolve: async (_obj, { id }: ArgsType, context) => {
        const post = await context.prisma.post.findUnique({
          where: { id }
        });
        return post ? post : null;
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
      resolve: async (_obj, { id }: ArgsType, context) => {
        const profile = await context.prisma.profile.findUnique({
          where: { id }
        });
        return profile ? profile : null;
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
      resolve: async (_obj, { id }: ArgsType, context) => {
        const memberType = await context.prisma.memberType.findUnique({
          where: { id },
        });
        return memberType ? memberType : null;
      },
    },
  }
});
