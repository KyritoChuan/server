//Importar mongoose, usar Schema de mongose y lo declara en variable.
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Estructura del Objeto. En este caso el Objeto se llamará UserSchema.
//Se rige por la estructura que da Mongoose.
const UserSchema = Schema({
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

//Module.exports usará para importar este "user.js".
//En este contexto se exportará un modelo de mongoose, en este caso se llamará User
//y se regirá por la estructura Del Objeto UserSchema.
module.exports = mongoose.model("User", UserSchema);
