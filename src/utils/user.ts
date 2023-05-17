import { type RoutableUser } from '~/interfaces/user';

export const getUserAtTag = (user: RoutableUser) => `@${user.username}`;
