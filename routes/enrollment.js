const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const db = mysql.createPool({
  host: 'sql6.freesqldatabase.com',
  database: 'sql6584239',
  user: 'sql6584239',
  password: 'vJfgLcHY8F'
});

router.post('/receive', async (req, res) => {
    try {
      const { user } = req.body;
      const sqlFind = "SELECT * FROM enrollment_details WHERE user_id=?;";
      console.log("User id:", user.id);
      db.query(sqlFind, [user.id], async (err, enrollmentDetails) => {
        console.log("Enrollment Details fetched");
        console.log(enrollmentDetails);

        res.status(200).json({
          enrollmentDetails: enrollmentDetails,
          message: 'success',
        });
      });
    } catch (error) {
      res.status(500).json({
        enrollmentDetails: null,
        message: 'Something went wrong',
      });
    }
});

router.post('/add', async (req, res) => {
  try{
    const { userId } = req.body;
    const sqlInsert = "INSERT INTO enrollment_details (user_id, enrollment_date, subscription_end_date, slot) VALUES (?,?,?,?);"
    console.log("UserId is: ", userId);
    db.query(sqlInsert, [userId, null, null, null], (err, result) => {
      console.log("inserted enrollment data");

      const enrollmentDetails = {
        user_id: userId,
        enrollment_date: null,
        subscription_end_date: null,
        slot: null,
      };

      res.status(200).json({
        enrollmentDetails: enrollmentDetails,
        message: 'success',
      });
    });
  } catch (error) {
    console.log("Insert Enrollment details error", error);
    res.status(500).json({
      enrollmentDetails: null,
      message: 'Something went wrong',
    });
  }
});

router.put('/change', async (req, res) => {
  try{
    const { userId, currDate, lastDate, selectedOption } = req.body;
    //const current = new Date();
    //const currDate = new Date(current.getFullYear(), current.getMonth(), current.getDate());
    console.log(currDate);
    const sqlUpdate = "UPDATE enrollment_details SET enrollment_date=?, subscription_end_date=?, slot=? WHERE user_id=?;"
    console.log("Request body is", req.body);
    db.query(sqlUpdate, [new Date(currDate), new Date(lastDate), selectedOption, userId], (err, result) => {
      console.log("Updated enrollment data");

      const enrollmentDetails = {
        user_id: userId,
        enrollment_date: currDate,
        subscription_end_date: lastDate,
        slot: selectedOption,
      };

      res.status(200).json({
        enrollmentDetails: enrollmentDetails,
        message: 'success',
      });
    });
  } catch (error) {
    console.log("Update Enrollment details error", error);
    res.status(500).json({
      enrollmentDetails: null,
      message: 'Something went wrong',
    });
  }
});

module.exports = router;