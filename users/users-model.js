const db = require("../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  findByDepartment
};

function find() {
  return db("users").select("id", "username");
}

function findBy(filter) {
  return db("users").where(filter);
}

async function add(user) {
  const [id] = await db("users").insert(user, "id");

  return findById(id);
}

function findById(id) {
  return db("users")
    .select('id', 'username', 'password')
    .where({ id })
    .first();
}

function findByDepartment(department) {
    return db('users')
        .select('id', 'username', 'department')
        .where({department});
}