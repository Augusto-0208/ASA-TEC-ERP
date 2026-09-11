const express = require("express");
const router = express.Router();
const clientesController = require("../controllers/clientesController");

router.get("/", clientesController.listarClientes);
router.get("/:id", clientesController.buscarCliente);
router.post("/", clientesController.criarCliente);   // ← POST está aqui?
router.put("/:id", clientesController.atualizarCliente);
router.delete("/:id", clientesController.excluirCliente);

module.exports = router;