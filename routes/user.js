
const express = require("express");
const router = express.Router();
const {add_user,delete_user,} = require ("../controllers/usercontroller");


router.post("/", add_user);
router.get("/", (req,res)=>{
 res.render("user")
});
router.delete("/del", delete_user);


module.exports = router;