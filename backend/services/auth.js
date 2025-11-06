const jwt=require('jsonwebtoken');
const secretKey=process.env.JWT_SECRET;

function builtTheToken(user){
    console.log("Building token for user:", user._id);

    const plainObject={
        _id:user._id,    
        fullName:user.fullName,
        email:user.email
    };

    const token = jwt.sign(plainObject, secretKey);
    console.log("Token built successfully");
    return token;
}

function decodeTheToken(token){
    console.log("Decoding token...");
    if(!token) {
        console.log("No token provided");
        return null;
    }

    try{
        const decoded = jwt.verify(token, secretKey);
        console.log("Token decoded successfully");
        return decoded;
    }
    catch(error){
        console.log("Token decoding failed:", error.message);
        return null;
    }
}

module.exports={
    builtTheToken,
    decodeTheToken
}
