const express = require("express");
const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const today = new Date();

app.use(express.static('img')); 

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// ============ Start Login =================
exports.login = async (req, res) => {
    try {
        const {login_email, login_password} = req.body;

        if(!login_email || !login_password) {
            return res.status(400).render('login', {
                message: 'โปรดกรอกข้อมูลให้ครบถ้วน'
            })
        }

        db.query('SELECT * FROM user WHERE email = ?', [login_email], async (error, results) => {
            console.log(results);
            if( !results || !await bcrypt.compare(login_password, results[0].password) ){
                res.status(401).render('login', {
                    message: 'Email หรือ Password ไม่ถูกต้อง'
                })
            }
            else{
                const id = results[0].userid;

                const token = jwt.sign({id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                
                console.log("The Token is : " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/main');
            } 
        })

    } catch (error) {
        console.log(error)
    }
}
// ============ End Login =================



// ============ Start Register =================
exports.register = (req, res) => {
    console.log(req.body);

    const {prefix, firstname, lastname, sex, birthday, email, phone, password, cpassword} = req.body;

        db.query('SELECT email FROM user WHERE email = ?', [email], async (error, results) => {
            if(error){
                console.log(error);
            }

            if(prefix == 'NO') {
                return res.render('register', {
                    message: 'กรุณาใส่ข้อมูลให้ครบถ้วน'
                })
            }

            else if(prefix == 'NO' || !firstname || !lastname || sex == 'NO' || !birthday || !email || !phone || !password || !cpassword) {
                return res.render('register', {
                    message: 'กรุณาใส่ข้อมูลให้ครบถ้วน'  
                })
            }
            else if( results.length > 0){
                return res.render('register', {
                    message: 'Email นี้มีการใช้งารในระบบอยู่แล้ว'
                })
            }
            else if (password !== cpassword){
                return res.render('register', {
                    message: 'กรุณาใส่ Password ให้ตรงกัน'
                }) 
            }

            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);

            db.query('INSERT INTO user SET ?', {prefix: prefix, firstname: firstname, lastname: lastname, sex: sex, birthday: birthday, email: email, phone: phone, password: hashedPassword, create_date: today}, (error, results) => {
                if(error){
                    console.log(error);
                }
                else {
                    console.log(results);
                    res.redirect('/login');
                }
            })
        });
}
// ============ End Register =================


// ============ Start ele1 =================

exports.ele1 = (req, res) => {
    console.log(req.body);
}
// ============ End ele1 ===================
