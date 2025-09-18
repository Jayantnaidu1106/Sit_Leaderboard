const express = require("express");
const router = express.Router();
const { add_user, delete_user, get_leaderboard, get_contest_leaderboard, get_all_time_contest_leaderboard } = require("../controllers/usercontroller");

router.post("/signup", add_user);
router.delete("/del/:username", delete_user);
router.get("/leaderboard", get_leaderboard);
router.get("/contest-leaderboard", get_contest_leaderboard);
router.get("/all-time-contest-leaderboard", get_all_time_contest_leaderboard);

module.exports = router;