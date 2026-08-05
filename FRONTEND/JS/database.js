// =========================
// DATABASE ASA TEC 3D
// =========================

function getDatabase() {

  const database =
    localStorage.getItem('asaTecDatabase');

  if (database) {

    return JSON.parse(database);

  }

  // DATABASE PADRÃO

  const initialDatabase = {

    pedidos: [],

    clientes: [],

    produtos: [],

    estoque: [],

    financeiro: []

  };

  localStorage.setItem(
    'asaTecDatabase',
    JSON.stringify(initialDatabase)
  );

  return initialDatabase;

}

// =========================
// SAVE DATABASE
// =========================

function saveDatabase(database) {

  localStorage.setItem(
    'asaTecDatabase',
    JSON.stringify(database)
  );

}