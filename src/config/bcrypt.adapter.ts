import { genSaltSync, hashSync, compareSync } from "bcryptjs";
export const bcrypAdapter = {
  hash: (password: string): string => {
    const salt = genSaltSync();
    return hashSync(password, salt);
  },

  compare: (password: string, hashedPassword: string): boolean => {
    return compareSync(password, hashedPassword);
  },
};
