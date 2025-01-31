const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("../services/jwt");
const User = require("../models/user");
const { use } = require("../routers/user");

function signUp(req, res) {
  const user = new User();
  const { name, lastname, email, password, repeatPassword } = req.body;
  user.name = name;
  user.lastname = lastname;
  user.email = email.toLowerCase();
  user.role = "admin";
  user.active = false;

  if (!password || !repeatPassword) {
    res.status(404).send({ ok: false, message: "Las contraseñas son obligatorias." });
  } else {
    if (password !== repeatPassword) {
      res.status(404).send({ ok: false, message: "Las contraseñas no son iguales." });
    } else {
      bcrypt.hash(password, 0, function (err, hash) {
        if (err) {
          res
            .status(500)
            .send({ ok: false, message: "Error al encriptar la contraseña." + err });
        } else {
          user.password = hash;
          user.save((err, userStored) => {
            if (err) {
              res.status(500).send({ ok: false, message: "El usuario ya existe." });
            } else {
              if (!userStored) {
                res.status(404).send({ ok: false, message: "Error al crear el usuario." });
              } else {
                res.status(200).send({ ok: true, user: userStored, message: "Usuario creado correctamente" });
              }
            }
          });
        }
      });
      //res.status(200).send({ message: "Usuario creado." });
    }
  }
}

function signIn(req, res) {
  const params = req.body;
  const email = params.email;
  const password = params.password;
  User.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del Servidor." });
    } else {
      if (!userStored) {
        res.status(404).send({ message: "Usuario no encontrado. " });
      } else {
        bcrypt.compare(password, userStored.password, (err, check) => {
          if (err) {
            res.status(500).send({ message: "Error del servidor" });
          } else if (!check) {
            res.status(404).send({ message: "La contraseña es incorrecta." });
          } else {
            if (!userStored.active) {
              res
                .status(200)
                .send({ code: 200, message: "El usuario no se ha activado." });
            } else {
              res.status(200).send({
                accessToken: jwt.createAccessToken(userStored),
                refreshToken: jwt.createRefreshToken(userStored),
              });
            }
          }
        });
      }
    }
  });
}

function getUsers(req, res) {
  User.find().then((users) => {
    if (!users) {
      res.status(404).send({ ok: false, message: "No se ha encontrado ningún usuario." });
    } else {
      res.status(200).send({ ok: true, users });
    }
  });
}

function getUsersActive(req, res) {
  const query = req.query;

  User.find({ active: query.active }).then((users) => {
    if (!users) {
      res.status(404).send({ ok: false, message: "No se ha encontrado ningún usuario" });
    } else {
      res.status(200).send({ ok: true, users });
    }
  });
}

function uploadAvatar(req, res) {
  const params = req.params;

  User.findById({ _id: params.id }, (err, userData) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor" });
    } else {
      if (!userData) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ningún usuario. " });
      } else {
        let user = userData;

        //console.log(userData);
        //console.log(req.files);

        if (req.files) {
          let filePath = req.files.avatar.path;
          let fileSplit = filePath.split("\\");
          let fileName = fileSplit[2];

          let extSplit = fileName.split(".");
          let fileExt = extSplit[1];


          if (fileExt !== "png" && fileExt !== "jpg") {
            res.status(400).send({
              message:
                "La extensión de la imagen no es valida. (Extensiones permitidas: .png y .jpg",
            });
          } else {
            user.avatar = fileName;
            User.findByIdAndUpdate(
              { _id: params.id },
              user,
              (err, userResult) => {
                if (err) {
                  res.status(500).send({ message: "Error del servidor " });
                } else {
                  if (!userResult) {
                    res
                      .status(404)
                      .send({ message: "No se ha encontrado ningún usuario." });
                  } else {
                    res.status(200).send({ avatarName: fileName });
                  }
                }
              }
            );
          }
        }
      }
    }
  });
}

function getAvatar(req, res) {
  const avatarName = req.params.avatarName;
  const filePath = "./uploads/avatar/" + avatarName;

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.status(404).send({ message: "El avatar que buscas no existe." });
    } else {
      res.sendFile(path.resolve(filePath));
    }
  });
}

async function updateUser(req, res) {
  const userData = req.body;
  userData.email = req.body.email.toLowerCase();
  const params = req.params;

  console.log(userData);
  console.log(params);

  if (userData.password) {
    await bcrypt
      .hash(userData.password, 0)
      .then((hash) => {
        userData.password = hash;
      })
      .catch(() => {
        res.status(500).send({ ok: false, message: "Error al encriptar la contraseña" });
      });
  }

  User.findByIdAndUpdate(params.id, userData, (err, userUpdate) => {
    if (err) {
      console.log(err);
      res.status(500).send({ ok: false, message: "Error del servidor" });
    } else {
      if (!userUpdate) {
        res.status(404).send({ ok: false, message: "No se ha encontrado ningún usuario" });
      } else {
        res.status(200).send({ ok: true, message: "Usuario actualizado correctamente" });
      }
    }
  });
}

function activateUser(req, res) {
  const { id } = req.params;
  const { active } = req.body;

  User.findByIdAndUpdate(id, { active }, (err, userStored) => {
    if (err) {
      res.status(500).send({ ok: false, message: "Error en el servidor" });
    } else {
      if (!userStored) {
        res.status(404).send({ ok: false, message: "No se ha encontrado el usuario" });
      } else {
        if (active === true) {
          res.status(200).send({ ok: true, message: "Usuario activado correctamente" });
        } else {
          res
            .status(200)
            .send({ ok: true, message: "Usuario desactivado correctamente." });
        }
      }
    }
  });
}

function deleteUser(req, res) {
  const { id } = req.params;

  User.findByIdAndRemove(id, (err, userDeleted) => {
    if (err) {
      res.status(500).send({ ok: false, message: "Error en el servidor" });
    } else {
      if (!userDeleted) {
        res.status(404).send({ ok: false, message: "Usuario no encontrado" });
      } else {
        res
          .status(200)
          .send({ ok: true, message: "El usuario ha sido eliminado correctamente." });
      }
    }
  });
}

function singUpAdmin(req, res) {
  const user = new User();

  const { name, lastname, email, role, password } = req.body;
  user.name = name;
  user.lastname = lastname;
  user.email = email;
  user.role = role;
  user.active = true;

  if (!password) {
    res.status(500).send({ ok: false, message: "La contraseña es obligatoria" });
  } else {
    bcrypt
      .hash(password, 0)
      .then((hash) => {
        user.password = hash;

        user.save((err, userStored) => {
          if (err) {
            res.status(500).send({ ok: false, message: "El usuario ya existe" });
          } else {
            if (!userStored) {
              res
                .status(500)
                .send({ ok: false, message: "Error al crear el nuevo usuario" });
            } else {
              res
                .status(200)
                .send({ ok: true, message: "Usuario creado correctamente." });
              //res.status(200).send({ user: userStored });
            }
          }
        });
      })
      .catch(() => {
        res.status(500).send({ ok: false, message: "Error al encriptar la contraseña" });
      });
  }
}

module.exports = {
  signUp,
  signIn,
  getUsers,
  getUsersActive,
  uploadAvatar,
  getAvatar,
  updateUser,
  activateUser,
  deleteUser,
  singUpAdmin,
};
