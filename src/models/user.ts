import mongoose, {Schema,Document} from "mongoose";
import bcrypt from "bcrypt";

//define interface for typesafety
export interface IUser extends Document{
   name : string;
   email : string;
   password : string;
   role : "user"  | "admin";
   matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser> ({
    name :{type: String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type: String, required: true},
    role: {type: String, enum:["user", "admin"], default : "user"}
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
    return await bcrypt.compare(enteredPassword, this.Password);
};

const User = mongoose.model<IUser>("user", userSchema);
export default User;
