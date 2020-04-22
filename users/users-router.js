const router = require("express").Router();

const Users = require("./users-model.js");

router.get("/", (req, res) => {
    const dept = req.decodedToken.department;  
    console.log(req.decodedToken);
  Users.findByDepartment(dept)
    .then(users => {
        console.log('Users - ', users);
        res.json();
    })
    .catch(err => res.send(err));
});

module.exports = router;
