import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { ProfileType } from "./profile.js";
import { PostType } from "./post.js";
import { Context, Post, Profile, User } from "./types.js";
import DataLoader, { BatchLoadFn } from "dataloader";
import { getPostsLoader, getProfileLoader, getSubscribedToUserLoader, getUserSubscribedToLoader } from "../dataLoader.js";

export const UserType = new GraphQLObjectType<User, Context>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },

    profile: {
      type: ProfileType,
      resolve: async ({ id }, _args, { dataLoaders, prisma }) => {

        let dl = dataLoaders.get('profile');
        if (!dl) {
          const batchFunc: BatchLoadFn<string, Profile | undefined> = async (ids) => {

            const profiles: Profile[] = await prisma.profile.findMany({
              where: {
                userId: {
                  in: ids as string[]
                }
              }
            });

            return ids.map(id => profiles.find((profile) => profile.userId === id));
          };

          dl = new DataLoader<string, Profile | undefined>(batchFunc);
          dataLoaders.set('profile', dl);
        }
        return dl.load(id);
        // return loaders.profile().load(id);
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }, _args, { dataLoaders, prisma }) => {
        let dl = dataLoaders.get('posts');
        if (!dl) {
          const batchFunc: BatchLoadFn<string, Post[] | undefined> = async (ids) => {

            const posts = await prisma.post.findMany({
              where: {
                authorId: {
                  in: ids as string[]
                }
              }
            });

            const sortedPosts = ids.map(id => posts.filter((post) => post.authorId === id));
            return sortedPosts;
          }

          dl = new DataLoader<string, Post[] | undefined>(batchFunc);

          dataLoaders.set('posts', dl);
        }

        return await dl.load(id);
        // return loaders.posts().load(id);
      },
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }, _args, { dataLoaders, prisma }) => {

        let dl = dataLoaders.get('userSubscribedTo');
        if (!dl) {
          const batchFunc: BatchLoadFn<string, User[] | undefined> = async (ids) => {
            const users = await prisma.user.findMany({
              where: {
                subscribedToUser: {
                  some: {
                    subscriberId: {
                      in: ids as string[]
                    },
                  },
                },
              },
              include: {
                subscribedToUser: true
              },
            });

            const sortedUsers = ids.map(id => 
              users.filter(user => 
                user.subscribedToUser.find(subscribedUser => 
                  subscribedUser.subscriberId === id) ));

            return sortedUsers;
          }

          dl = new DataLoader<string, User[] | undefined>(batchFunc);
          dataLoaders.set('userSubscribedTo', dl);
        }

        return await dl.load(id);
        // return loaders.userSubscribedTo().load(id);
      },
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }, _args, { dataLoaders, prisma }) => {

        let dl = dataLoaders.get('subscribedToUser');
        if (!dl) {
          const batchFunc: BatchLoadFn<string, User[] | undefined> = async (ids) => {

            const users = await prisma.user.findMany({
              where: {
                userSubscribedTo: {
                  some: {
                    authorId: {
                      in: ids as string[]
                    }
                  }
                }
              },
              include: {
                userSubscribedTo: true
              }
            });

            const sortedUsers = ids.map(id => 
              users.filter(user => 
                user.userSubscribedTo.find(subUser => 
                  subUser.authorId === id)));

            return sortedUsers;
          }

          dl = new DataLoader<string, User[] | undefined>(batchFunc);

          dataLoaders.set('subscribedToUser', dl);
        }

        return await dl.load(id);
        // return loaders.subscribedToUser().load(id);
      },
    },

  }),
});

export const CreateUserBodyType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat }
  },
});

export const ChangeUserBodyType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat }
  },
});
