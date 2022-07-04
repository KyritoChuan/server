//Importar mongoose, usar Schema de mongose y lo declara en variable.
const { Schema, model } = require("mongoose");

//Estructura del Objeto. En este caso el Objeto se llamará UserSchema.
//Se rige por la estructura que da Mongoose.
const UserSchema = new Schema({
  name: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: String,
  active: Boolean,
  avatar: String,
});

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

//Module.exports usará para importar este "user.js".
//En este contexto se exportará un modelo de mongoose, en este caso se llamará User
//y se regirá por la estructura Del Objeto UserSchema.
module.exports = model("User", UserSchema);
