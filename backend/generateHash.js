import bcrypt from "bcrypt";

const hash = await bcrypt.hash(
  "riadcasaverde@",
  10
);

console.log(hash);