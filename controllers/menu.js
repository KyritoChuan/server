const Menu = require("../models/menu");

function addMenu(req, res) {
  const { title, url, order, active } = req.body;
  const menu = new Menu();
  menu.title = title;
  menu.url = url;
  menu.order = order;
  menu.active = active;

  menu.save((err, createdMenu) => {
    if (err) {
      res.status(500).send({ ok: false, message: "Error del servidor." });
    } else {
      if (!createdMenu) {
        res.status(404).send({ ok: false, message: "Error al crear el menú" });
      } else {
        res.status(200).send({ ok: true, message: "Menú creado correctamente" });
      }
    }
  });
}

function getMenus(req, res) {
  Menu.find()
    .sort({ order: "asc" })
    .exec((err, menusStored) => {
      if (err) {
        res.status(500).send({ ok: false, message: "Error del servidor" });
      } else {
        if (!menusStored) {
          res.status(404).send({
            ok: false,
            message: "No se ha encontrado ningún elemento en el menú",
          });
        } else {
          res.status(200).send({ok: true, menus: menusStored });
        }
      }
    });
}

function updateMenus(req, res) {
  let menuData = req.body;
  const params = req.params;

  Menu.findByIdAndUpdate(params.id, menuData, (err, menuUpdate) => {
    if (err) {
      res.status(500).send({ ok: false, message: "Error del servidor" });
    } else {
      if (!menuUpdate) {
        res.status(404).send({ ok: false, message: "No se ha encontrado ningún Menú" });
      } else {
        res.status(200).send({ ok: true, message: "Menú actualizado correctamente" });
      }
    }
  });
}

function activateMenu(req, res) {
  const { id } = req.params;
  const { active } = req.body;

  Menu.findByIdAndUpdate(id, { active }, (err, menuStored) => {
    if (err) {
      res.status(500).send({ ok: false, message: "Error del servidor" });
    } else {
      if (!menuStored) {
        res.status(404).send({ ok: false, message: "No se ha encontrado el menú" });
      } else {
        if (active === true) {
          res.status(200).send({ ok: true, message: "Menu activado correctamente" });
        } else {
          res.status(200).send({ ok: false, message: "Menu desactivado correctamente" });
        }
      }
    }
  });
}

function deleteMenu(req, res) {
  const { id } = req.params;

  Menu.findByIdAndRemove(id, (err, menuDeleted) => {
    if (err) {
      res.status(500).send({ ok: false, message: "Error del servidor" });
    } else {
      if (!menuDeleted) {
        res.status(404).send({ ok: false, message: "Menu no encontrado" });
      } else {
        res
          .status(200)
          .send({ ok: true, message: "El menu ha sido eliminado correctamente" });
      }
    }
  });
}

module.exports = {
  addMenu,
  getMenus,
  updateMenus,
  activateMenu,
  deleteMenu,
};
