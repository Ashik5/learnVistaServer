import bcryptjs from "bcryptjs";

const saltRounds = 10;

export const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(saltRounds);
  const hash = await bcryptjs.hash(password, salt);
  return hash;
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};

