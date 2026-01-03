import crypto from 'crypto';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username :{
        type : String,
        required : true,
        unique : true,
        index : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        index: true
    },
    password : {
        type : String,
        required : true,
        select : false,
    },
    avatar : {
        type : String,
        required : false,
        // gravatar
        default : function () {
            const hash = crypto
            .createHash("md5")
            .update(this.email.trim().toLowerCase())
            .digest("hex");

            return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
        }
    }
})

const User = mongoose.model('User', userSchema);

export default User;