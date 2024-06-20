const UserModel = require("../models/UserModel.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");


const userRegister = async (req, res) => {
    const {  email, password } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email })
        const RegrexPass = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/
        if (!RegrexPass.test(password)) {
            return res.status(201).send({ msg: "please choose another password" })
        }
        if (existingUser) {
            return res.status(201).send({ msg: "User already exist" })
        }
        bcrypt.hash(password, 8, async (err, hash) => {
            if (err) {
                res.status(400).send({ err: err.message })
            } else {
                const user = await UserModel.create({ ...req.body, password: hash })
                res.status(200).send({ msg: "User register successfully!!", register: user })
            }
        })
    } catch (error) {
        res.status(404).send({ error: error.message })
    }
}

const userLogin  = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            bcrypt.compare(password, user.password, (err, decoded) => {
                if (decoded) {
                    const token = jwt.sign({ userId: user._id, role: user.role }, "gullu", { expiresIn: "7d" })
                    res.status(200).send({ msg: "Login successfully!!", token: token ,role: user.role,name:user.name})
                } else {
                    res.status(201).send({ msg: "wrong credentails!!" })
                }
            })
        } else {
            res.status(400).send({ msg: "user does not exist" })
        }

    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

const userLogout = async(req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        if (token) {
            // Check if the token is already blacklisted
            const tokenInBlacklist = await BlackListModel.findOne({ token });
            if (!tokenInBlacklist) {
                // If the token is not blacklisted, add it to the blacklist
                await BlackListModel.create({ token });
            }
        }
        res.status(200).send({ msg: "User has been logged out" });
    } catch (error) {
        res.status(400).send({ err: error.message });
    }
};

module.exports = {
    userRegister,
    userLogin,
    userLogout
}