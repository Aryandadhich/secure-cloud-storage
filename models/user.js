const mongoose = require('mongoose')
const bycrpt = require('bcrypt')

const userSchema = new mongoose.Schema ({
    name :{type: string, require:true},
    email:{type:string, require:true, unique:true},
    role: {type: string, enum:["user", "admin"], default : "user"}
});

//Hash password before saving
//this is a mongoose middleware hook(pre save hook) run before saving a document
//before saving the user in mongodb this function run
//it check pass chnage no - skip hashing , yes - hash pass
//replace the real paas with hash one and then save in db.
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,10);
    next();
})

//password check method
userSchema.method.matchPassword = async function (enteredpassword){
    return await bcrypt.compare(enteredpassword, this.Password);
};

export default mongoose.model("user", userSchema);
