const {Router} = require("express");
const {getTravel,createTravel,getTravelById,putTravelById,delTravelById}=require("../controller/travel");

const router = Router();

router.get("/",getTravel);

router.post("/", createTravel).get("/:id", getTravelById).put("/:id", putTravelById).delete("/:id", delTravelById);

module.exports = router;
