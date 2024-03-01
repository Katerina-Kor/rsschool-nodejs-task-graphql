import { GraphQLBoolean, GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./types/uuid.js";
import { Context, Args, RootObject, User, CreateUserArgs, CreatePostArgs, CreateProfileArgs } from "./types/types.js";
import { ChangeUserBodyType, CreateUserBodyType, UserType } from "./types/user.js";
import { ChangePostBodyType, CreatePostBodyType, PostType } from "./types/post.js";
import { ChangeProfileBodyType, CreateProfileBodyType, ProfileType } from "./types/profile.js";
import { MemberType, MemberTypeId } from "./types/memberType.js";

export const rootMutationType = new GraphQLObjectType<RootObject, Context>({
  name: 'Mutation',
  fields: {
    createUser: {
      type: new GraphQLNonNull(UserType),
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
      type: new GraphQLNonNull(PostType),
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
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileBodyType) },
      },
      resolve: async (_obj, { dto }: CreateProfileArgs, context) => {
        return context.prisma.profile.create({
          data: dto,
        });
      },
    },

    deleteUser: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obg, { id }: Args, context) => {
        await context.prisma.user.delete({
          where: {
            id: id,
          },
        });
        return 'User was deleted';
      },
    },

    deletePost: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obg, { id }: Args, context) => {
        await context.prisma.post.delete({
          where: {
            id: id,
          },
        });
        return 'Post was deleted';
      },
    },

    deleteProfile: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obg, { id }: Args, context) => {
        await context.prisma.profile.delete({
          where: {
            id: id,
          },
        });
        return 'Profile was deleted';
      },
    },

    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserBodyType) },
      },
      resolve: async (_obj, { dto, id }: CreateUserArgs & Args, context) => {
        return context.prisma.user.update({
          where: { id },
          data: dto,
        });
      },
    },

    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostBodyType) },
      },
      resolve: async (_obj, { dto, id }: CreatePostArgs & Args, context) => {
        return context.prisma.post.update({
          where: { id },
          data: dto,
        });
      },
    },

    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileBodyType) },
      },
      resolve: async (_obj, { dto, id }: CreateProfileArgs & Args, context) => {
        return context.prisma.profile.update({
          where: { id },
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
