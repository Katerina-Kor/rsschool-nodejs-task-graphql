import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql";
import { UUIDType } from "./uuid.js";
import { MemberType, MemberTypeId } from "./memberType.js";
import { ContextType } from "./context.js";

export const ProfileType = new GraphQLObjectType<ProfileType, ContextType>({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
    memberType: {
      type: MemberType,
      resolve: (obj, _args, context) => {
        return context.prisma.memberType.findUnique({
          where: {
            id: obj.memberTypeId
          }
        })
      }
    }
  }),
})

type ProfileType = {
  id: string,
  isMale: boolean,
  yearOfBirth: number,
  userId: string,
  memberTypeId: string,
}