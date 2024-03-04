import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UUIDType } from "./types/uuid.js";
import { Context, Args, RootObject, User } from "./types/types.js";
import { UserType } from "./types/user.js";
import { PostType } from "./types/post.js";
import { ProfileType } from "./types/profile.js";
import { MemberType, MemberTypeId } from "./types/memberType.js";
import { ResolveTree, parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';
import DataLoader, { BatchLoadFn } from "dataloader";

export const rootQueryType = new GraphQLObjectType<RootObject, Context>({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_obj, _args, { prisma, dataLoaders }, info) => {
        const parsedResolveInfoFragment = parseResolveInfo(info) as ResolveTree;

        const { fields } = simplifyParsedResolveInfoFragmentWithType(
					parsedResolveInfoFragment,
          info.returnType
				);

        const hasUserSubscribedTo = 'userSubscribedTo' in fields;
        const hasSubscribedToUser = 'subscribedToUser' in fields;

        const users = await prisma.user.findMany({
          include: {
            userSubscribedTo: hasUserSubscribedTo,
            subscribedToUser: hasSubscribedToUser
          }
        });

        users.forEach((user) => {
          if(hasSubscribedToUser) {
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
             dl.prime(user.id, user.subscribedToUser.map((subUser) => users.find(user => user.id === subUser.subscriberId) as User))
          }

          if(hasUserSubscribedTo) {
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
            dl && dl.prime(user.id, user.userSubscribedTo.map((subUser) => users.find(user => user.id === subUser.authorId) as User))
          }
        })
        
        return users;
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
