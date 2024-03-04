import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLObjectType } from "graphql";
import { UUIDType } from "./uuid.js";
import { MemberType, MemberTypeId } from "./memberType.js";
import { Context, Member, Profile } from "./types.js";
import DataLoader, { BatchLoadFn } from "dataloader";

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
      resolve: async ({ memberTypeId }, _args, { dataLoaders, prisma }) => {

        let dl = dataLoaders.get('memberType');
        if (!dl) {
          const batchFunc: BatchLoadFn<string, Member | undefined> = async (ids) => {

            const memberTypes = await prisma.memberType.findMany({
              where: {
                id: {
                  in: ids as string[]
                }
              }
            }) as Member[];

            const sortedMemberTypes = ids.map(id => memberTypes.find(memberType => memberType.id === id));
            return sortedMemberTypes;
          }

          dl = new DataLoader<string, Member | undefined>(batchFunc);

          dataLoaders.set('memberType', dl);
        }

        return await dl.load(memberTypeId);
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