import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLObjectType } from "graphql";
import { UUIDType } from "./uuid.js";
import { MemberType, MemberTypeId } from "./memberType.js";
import { Context, Profile } from "./types.js";
import DataLoader from "dataloader";

export const ProfileType = new GraphQLObjectType<Profile, Context>({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },

    memberType: {
      type: MemberType,
      resolve: ({ memberTypeId }, _args, context, info) => {
        // return context.prisma.memberType.findUnique({
        //   where: {
        //     id: memberTypeId,
        //   },
        // });

        const { dataLoaders } = context;

        // единожды инициализируем DataLoader для получения авторов по ids
        let dl = dataLoaders.memberType;
        if (!dl) {
          dl = new DataLoader(async (ids: any) => {
            // обращаемся в базу чтоб получить авторов по ids
            const rows = await context.prisma.memberType.findMany({
              where: {
                id: {
                  in: ids
                }
              }
            });
            // IMPORTANT: сортируем данные из базы в том порядке, как нам передали ids
            const sortedInIdsOrder = ids.map(id => rows.find(x => x.id === id));
            return sortedInIdsOrder;
          });
          // ложим инстанс дата-лоадера в WeakMap для повторного использования
          dataLoaders.memberType = dl;
        }

        // юзаем метод `load` из нашего дата-лоадера
        return dl.load(memberTypeId);
      },
    },
  }),
});

export const CreateProfileBodyType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
  },
});

export const ChangeProfileBodyType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeId },
  },
});