const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

//TODO: Check if this line is still necessáry to prevent (node:12992) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead. warning
mongoose.set('useCreateIndex', true)

//#region Define the model
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
})
//#endregion

//#region On Save Hook, encrypt password
//pre: execute a function before save
userSchema.pre('save', function (next) {
    //get access to the user model
    const user = this;

    // generate a salt then run callback
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            return next(err)

        // hash (encrypt) our password using the salt
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err)
                return next(err)

            //Overwrite plain text password with encrypted password
            user.password = hash
            next()
        })
    })
})

userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) { return callback(err) }
        callback(null, isMatch)
    })
}

//#endregion

//#region Create the model class
const ModelClass = mongoose.model('user', userSchema)
//#endregion

//#region Export the modulle
module.exports = ModelClass
//#endregion