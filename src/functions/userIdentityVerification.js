import jwt from "jsonwebtoken";

const userIdentityVerification = (token) => {
               let user_id;
    
               const decoded = jwt.verify(token, process.env.JWT_SECRET);
               user_id = Number(decoded)
               return user_id;
         
               if(!decoded) {
                 return null;
               }

        return user_id;
}

export default userIdentityVerification;