import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { ProfileType } from "./profile.js";
import { PostType } from "./post.js";
import { Context, Post, User } from "./types.js";
import DataLoader from "dataloader";

export const UserType = new GraphQLObjectType<User, Context>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },

    profile: {
      type: ProfileType,
      resolve: async ({ id }, _args, context, info) => {
        // const res = await context.prisma.profile.findUnique({
        //   where: { userId: id },
        // });
        // console.log('RES', res);

        const { dataLoaders } = context;

        let dl = dataLoaders.profile;
        if (!dl) {
          // const profiles: Profile[] = await context.prisma.profile.findMany({
          //   where: {
          //     userId: {
          //       in: ids
          //     }
          //   }
          // });

          // // console.log('PROFILES', profiles)
          // // console.log('IDS', ids)

          // const profileObj: {[key: string]: Profile} = {};
          // profiles.forEach((profile) => profileObj[profile.userId] = profile);
          
          // const sortedProfiles = ids.map(id => profileObj[id]);
          // // console.log('IDS', ids)
          // // console.log('ROWS', rows[0])
          // // console.log('SORTED ITEMS', sortedInIdsOrder)
          // // console.log('sorted RES', sortedProfiles)
          // return sortedProfiles;
          dl = new DataLoader(async (ids: any) => {
            // обращаемся в базу чтоб получить авторов по ids
            const rows = await context.prisma.profile.findMany({
              where: {
                userId: {
                  in: ids
                }
              }
            });
            // IMPORTANT: сортируем данные из базы в том порядке, как нам передали ids
            const sortedInIdsOrder = ids.map(id => rows.find(x => x.userId === id));
            // console.log('IDS', ids)
            // console.log('ROWS', rows[0])
            // console.log('SORTED ITEMS', sortedInIdsOrder)
            return sortedInIdsOrder;
          });
          // ложим инстанс дата-лоадера в WeakMap для повторного использования
          dataLoaders.profile = dl;
        }

        // юзаем метод `load` из нашего дата-лоадера
        const loaderRes = await dl.load(id);
        // console.log('loaderRes', loaderRes)
        return loaderRes
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }, _args, context, info) => {
        // const posts = await context.prisma.post.findMany({
        //   where: { authorId: id },
        // });
        // console.log('POSTS', posts)
        // return posts;

        const { dataLoaders } = context;

        // единожды инициализируем DataLoader для получения авторов по ids
        let dl = dataLoaders.posts;
        if (!dl) {
          dl = new DataLoader(async (ids: any) => {
            // обращаемся в базу чтоб получить авторов по ids
            const rows = await context.prisma.post.findMany({
              where: {
                authorId: {
                  in: ids
                }
              }
            });
            // IMPORTANT: сортируем данные из базы в том порядке, как нам передали ids
            const sortedInIdsOrder = ids.map(id => rows.filter(x => x.authorId === id));
            return sortedInIdsOrder;
          });
          // ложим инстанс дата-лоадера в WeakMap для повторного использования
          dataLoaders.posts = dl;
        }

        // юзаем метод `load` из нашего дата-лоадера
        const res = await dl.load(id);
        // console.log('RES', res)
        return res
      },
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }, _args, context, info) => {
        // const resu = await context.prisma.user.findMany({
        //   where: {
        //     subscribedToUser: {
        //       some: {
        //         subscriberId: id,
        //       },
        //     },
        //   },
        // });
        // console.log('RES', resu, id);
        // return resu;

        const { dataLoaders } = context;

        // единожды инициализируем DataLoader для получения авторов по ids
        let dl = dataLoaders.userSubscribedTo;
        if (!dl) {
          dl = new DataLoader(async (ids: any) => {
            // обращаемся в базу чтоб получить авторов по ids
            const rows = await context.prisma.user.findMany({
              where: {
                subscribedToUser: {
                  some: {
                    subscriberId: {
                      in: ids
                    }
                  }
                }
              },
              include: {
                subscribedToUser: true
              }
            });
            // IMPORTANT: сортируем данные из базы в том порядке, как нам передали ids
            const sortedInIdsOrder = ids.map(id => rows.filter(x => x.subscribedToUser.find(user => user.subscriberId === id) ));
            // console.log('IDS', ids)
            // console.log('ROWS', rows)
            // console.log('SORTED ITEMS', sortedInIdsOrder)
            return sortedInIdsOrder;
          });
          // ложим инстанс дата-лоадера в WeakMap для повторного использования
          dataLoaders.userSubscribedTo = dl;
        }

        // юзаем метод `load` из нашего дата-лоадера
        const res = await dl.load(id);
        // console.log('TEST', res)
        return res
      },
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }, _args, context, info) => {
        // console.log('INFO', info)
        // const res = await context.prisma.user.findMany({
        //   where: {
        //     userSubscribedTo: {
        //       some: {
        //         authorId: id,
        //       },
        //     },
        //   },
        // });
        // console.log('RES', res);

        const { dataLoaders } = context;

        // единожды инициализируем DataLoader для получения авторов по ids
        let dl = dataLoaders.subscribedToUser;
        if (!dl) {
          dl = new DataLoader(async (ids: any) => {
            // обращаемся в базу чтоб получить авторов по ids
            const rows = await context.prisma.user.findMany({
              where: {
                userSubscribedTo: {
                  some: {
                    authorId: {
                      in: ids
                    }
                  }
                }
              },
              include: {
                userSubscribedTo: true
              }
            });
            // IMPORTANT: сортируем данные из базы в том порядке, как нам передали ids
            const sortedInIdsOrder = ids.map(id => rows.filter(x => x.userSubscribedTo.find(user => user.authorId === id) ));
            return sortedInIdsOrder;
          });
          // ложим инстанс дата-лоадера в WeakMap для повторного использования
          dataLoaders.subscribedToUser = dl;
        }

        // юзаем метод `load` из нашего дата-лоадера
        const data = await dl.load(id);
        // console.log(data);
        return data;
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
