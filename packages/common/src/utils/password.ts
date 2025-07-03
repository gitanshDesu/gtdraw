import bcrypt from "bcryptjs";

export const hash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const isPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
