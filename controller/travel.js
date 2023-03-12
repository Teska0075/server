const connection = require("../config/db");
const {convertQuery} = require("../utils/convertedData");

const getTravel = (req,res)=>{
    const query = `SELECT * FROM travels`;

  connection.query(query, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({ travelsData: result });
  });
}

const getTravelById = (req,res)=>{
    const { id } = req.params;
    const query = `SELECT * FROM travels WHERE id=${id}`;
  
    connection.query(query, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({ travelData: result });
    });
}

const createTravel = (req, res) => {
    const { title,detail,price,location,day,cat_id } = req.body;
  
    const query =
      "INSERT INTO travels (id,title,images,detail,price,location,day,cat_id) VALUES(null,?,?,?,?,?,?,?)";
    connection.query(
      query,
      [title,"url",detail,price,location,day,cat_id],
      (err, result) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res
          .status(201)
          .json({ message: "Шинэ аялал амжилттай бүртгэгдлээ." });
      }
    );
  };

  const putTravelById = (req, res) => {
    const { id } = req.params;
    const body = req.body;
  
    const parsedData = convertQuery(body);
  
    const query = `UPDATE travels SET ${parsedData} WHERE id=${id}`;
  
    connection.query(query, (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }
  
      res.status(200).json({ message: "Аялалын мэдээлэл шинэчлэгдлээ", data: result });
    });
  };

  const delTravelById = (req, res) => {
    const { id } = req.params;
  
    const query = `DELETE FROM travels WHERE id=${id}`;
    connection.query(query, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({ message: `${id} id-тай аялал устлаа!` });
    });
  };
module.exports={getTravel,createTravel,getTravelById,putTravelById,delTravelById}