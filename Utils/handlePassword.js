import bcrypt from "bcrypt";

export const hashingPass = async (pass) =>{
    const passHash = bcrypt.hash(pass, 10);
    return passHash
}

export const comparePass = async (pass, hash) => {
    const result = await bcrypt.compare(pass, hash);
    return result
}