const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
       type:  String,
       minlength: 3,
       unique: true
    },
    name: String,
    passwordHash: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})
userSchema.plugin(uniqueValidator)

//set is called from JSON.stringify method, which is called when get responds with response.json()
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash  //shouldn't be revealed
    }
})

module.exports = mongoose.model('User', userSchema)