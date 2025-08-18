import mongoose, {Schema,Document} from "mongoose";
import bcrypt from "bcrypt";

//define interface for typesafety
export interface IUser extends Document{
   name : string;
   email : string;
   password : string;
   role : "user"  | "admin" | "superadmin";
   matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser> ({
    name :{type: String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type: String, required: true, select: false},
    role: {type: String, enum:["user", "admin", "superadmin"], default : "user"}
});

//Hash password before saving
//this is a mongoose middleware hook(pre save hook) run before saving a document
//before saving the user in mongodb this function run
//it check pass chnage no - skip hashing , yes - hash pass
//replace the real paas with hash one and then save in db.
userSchema.pre<IUser>("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,10);
    next();
})

//password check method
userSchema.methods.matchPassword = async function (enteredPassword: string) : Promise<boolean>{
    return await bcrypt.compare(enteredPassword, this.password);
};

//setRefreshtoken method
//when a user login we generate a new refreshtoken
//insted of saying it as-is, we hash it -> store in hash
//thats why if db leaks attakers just cant use refresh token
userSchema.methods.serRefreshToken = function (token : string){
    const crypto = require("crypto");
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    this.refreshToken = hash;
}

const User = mongoose.model<IUser>("user", userSchema);
export default User;
