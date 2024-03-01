import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./types/uuid.js";
import { Context, Args, RootObject, User, CreateUserArgs, CreatePostArgs, CreateProfileArgs } from "./types/types.js";
import { CreateUserBodyType, UserType } from "./types/user.js";
import { CreatePostBodyType, PostType } from "./types/post.js";
import { CreateProfileBodyType, ProfileType } from "./types/profile.js";
import { MemberType, MemberTypeId } from "./types/memberType.js";

export const rootMutationType = new GraphQLObjectType<RootObject, Context>({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserBodyType) },
      },
      resolve: async (_obj, { dto }: CreateUserArgs, context) => {
        return context.prisma.user.create({
          data: dto,
        });
      },
    },

    createPost: {
      type: PostType,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostBodyType) },
      },
      resolve: async (_obj, { dto }: CreatePostArgs, context) => {
        return context.prisma.post.create({
          data: dto,
        });
      },
    },

    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileBodyType) },
      },
      resolve: async (_obj, { dto }: CreateProfileArgs, context) => {
        return context.prisma.profile.create({
          data: dto,
        });
      },
    },

    // users: {
    //   type: new GraphQLList(UserType),
    //   resolve: async (_obj, _args, context) => {
    //     return context.prisma.user.findMany();
    //   },
    // },

    // user: {
    //   type: UserType,
    //   args: {
    //     id: { type: new GraphQLNonNull(UUIDType) },
    //   },
    //   resolve: async (_obg, { id }: Args, context) => {
    //     return await context.prisma.user.findUnique({
    //       where: { id },
    //     });
    //   },
    // },

    // posts: {
    //   type: new GraphQLList(PostType),
    //   resolve: async (_obj, _args, context) => {
    //     return context.prisma.post.findMany();
    //   },
    // },

    // post: {
    //   type: PostType,
    //   args: {
    //     id: { type: new GraphQLNonNull(UUIDType) },
    //   },
    //   resolve: async (_obj, { id }: Args, context) => {
    //     return await context.prisma.post.findUnique({
    //       where: { id }
    //     });
    //   }
    // },

    // profiles: {
    //   type: new GraphQLList(ProfileType),
    //   resolve: async (_obj, _args, context) => {
    //     return context.prisma.profile.findMany();
    //   },
    // },

    // profile: {
    //   type: ProfileType,
    //   args: {
    //     id: { type: new GraphQLNonNull(UUIDType) },
    //   },
    //   resolve: async (_obj, { id }: Args, context) => {
    //     return await context.prisma.profile.findUnique({
    //       where: { id }
    //     });
    //   },
    // },

    // memberTypes: {
    //   type: new GraphQLList(MemberType),
    //   resolve: async (_obj, _args, context) => {
    //     return context.prisma.memberType.findMany();
    //   },
    // },

    // memberType: {
    //   type: MemberType,
    //   args: {
    //     id: { type: new GraphQLNonNull(MemberTypeId)},
    //   },
    //   resolve: async (_obj, { id }: Args, context) => {
    //     return await context.prisma.memberType.findUnique({
    //       where: { id },
    //     });
    //   },
    // },
  }
});
