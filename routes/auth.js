const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { JWT_SECRET } = require('../config/keys');

const db = mysql.createPool({
  host: 'sql6.freesqldatabase.com',
  database: 'sql6585416',
  user: 'sql6585416',
  password: 'JdntdbYxeR'
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const sqlFind = "SELECT * FROM user_details WHERE email=?;";
    db.query(sqlFind, [email], async (err, user) => {
      if(user.length !== 0){
        console.log("User exists");
        console.log(user[0]);
        const passwordCheck = await bcrypt.compare(password, user[0].password);

        if (passwordCheck) {
          const token = jwt.sign({ _id: user[0].id }, JWT_SECRET);
          res.status(200).json({
            status: true,
            user: user[0],
            token: token,
            message: 'Success',
          });
        } else {
          res.status(400).json({
            status: false,
            message: 'Email/Password wrong',
            user: null,
          });
        }
      }
      else{
        console.log("New user");
        res.status(400).json({
          status: false,
          user: null,
          message: 'You do not have an account. SignUp instead.',
        });
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      user: null,
      message: 'Something went wrong',
    });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const sqlFind = "SELECT * FROM user_details WHERE email=?;";
    db.query(sqlFind, [email], async (err, result) => {
      if(result.length !== 0){
        console.log("User already exists");
        res.status(400).json({
          status: false,
          user: null,
          message: 'user exist please login',
        });
      }
      else{
        console.log("User doesn't exist");
        const hash = await bcrypt.hash(password, 8);
        console.log('hash ', hash);
        const sqlInsert = "INSERT INTO user_details (name, email, password) VALUES (?,?,?);"
        const resu = db.query(sqlInsert, [name, email, hash], async (err, result) => {
          console.log("inserted signup data");
          const token = jwt.sign({ _id: result.insertId }, JWT_SECRET);

          const user = {
            id: result.insertId,
            name: name,
            email: email,
            password: hash,
          };
          console.log(user);

          res.status(200).json({
            status: true,
            user: user,
            token: token,
            message: 'success',
          });
        });
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      token: null,
      status: false,
      user: null,
      message: 'Something went wrong',
    });
  }
});

module.exports = router;
