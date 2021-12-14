var express = require('express');
var router = express.Router();
var cors = require('./cors');
var models = require('../models/models');
var authenticate = require('../authenticate');
var passport = require('passport');
var cors = require('./cors');

const { dbConnect } = require('../connectDB');

const accountRouter = express.Router();

accountRouter.use(express.json());

accountRouter.route('/signup')
    .post((req, res, next) => {
        console.log(req.body);
        dbConnect.query("SELECT * FROM account WHERE username = '" + req.body.username + "';", {
            type: dbConnect.QueryTypes.SELECT
        }).then((result) => {
            if (result.length != 0) {
                res.statusCode = 403;
                res.json({ message: 'User ' + req.body.username + ' already exists!' });
            } else {
                models.Account.create(req.body)
                    .then((result) => {
                        console.log('Park created ');
                        if (req.body.type == "user") {
                            models.User.create({ "user_id": result.dataValues.id, "isactivated": false })
                                .then(() => {
                                    console.log('User created ');
                                    authenticate.sendEmail(req.headers.origin, result.dataValues.email, authenticate.getCodeVerify(result.dataValues.id));
                                    res.json({ success: true, status: 'Đăng ký thành công!' });
                                }, (err) => next(err));
                        } else {
                            models.Owner.create({ "own_id": result.dataValues.id, "isactivated": false })
                                .then(() => {
                                    console.log('Owner created ');
                                    authenticate.sendEmail(req.headers.origin, result.dataValues.email, authenticate.getCodeVerify(result.dataValues.id));
                                    res.json({ success: true, status: 'Đăng ký thành công!' });
                                }, (err) => next(err));
                        }
                    }, (err) => next(err))
            }
        }, (err) => next(err))
            .catch(err => next(err));
    })

    accountRouter.route('/login')
    .post((req, res, next) => {
        let username = req.body.username;
        let password = req.body.password;
        if (!username) {
            res.statusCode = 401;
            res.json({ message: 'You are not authenticated!' });
        }
        dbConnect.query("SELECT * FROM account WHERE username = '" + req.body.username + "';", {
            type: dbConnect.QueryTypes.SELECT
        }).then((result) => {
            if (result.length == 0) {
                res.statusCode = 403;
                res.json({ message: 'User ' + username + ' does not exist!' });
            }
            else if (result[0].password !== password) {
                res.statusCode = 403;
                res.json({ message: "Your password is incorrect!" });
            }
            else if (result[0].username === username && result[0].password === password) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                var token = authenticate.getToken({ id: result[0].id });
                res.cookie('token', token, { signed: true });
                dbConnect.query("SELECT * FROM user WHERE user_id = " + result[0].id + ";", {
                    type: dbConnect.QueryTypes.SELECT
                }).then(result1 => {
                    if (result1.length != 0) {
                        res.json({ login: true, username: username, role: 'user' });
                    } else {
                        dbConnect.query("SELECT * FROM owner WHERE own_id = " + result[0].id + ";", {
                            type: dbConnect.QueryTypes.SELECT
                        }).then(result => {
                            if (result.length != 0) {
                                res.json({ login: true, username: username, role: 'owner' });
                            } else {
                                res.json({ login: true, username: username, role: 'admin' });
                            }
                        }, err => next(err))
                    }
                }, err => next(err))
            }
        }, (err) => next(err))
            .catch((err) => next(err));
    })

accountRouter.route('/logout')
    .get((req, res, next) => {
        if (req.signedCookies.token) {
            res.clearCookie("token");
            res.json({ success: true, status: 'You are successfully logged out!' });
        } else {
            res.statusCode = 403;
            res.json({ message: 'You are not logged in!' });
        }
    });

accountRouter.route('/verify')
    .get((req, res, next) => {
        var code = req.query.code;
        console.log(code.length);
        var decodeId = authenticate.getIdCode(code);
        console.log(decodeId);
        if (decodeId == 'Wrong') {
            
            res.statusCode = 403;
            res.json({ message: 'Can not verify. Maybe code is invalid or time out' });
        } else {
            dbConnect.query("SELECT id FROM account WHERE id = " + decodeId + ";", {
                type: dbConnect.QueryTypes.SELECT
            }).then(result => {
                if (result.length == 0) {
                    res.statusCode = 403;
                    res.json({ message: 'Không thể xác nhận' });
                } else {
                    dbConnect.query("SELECT user_id FROM user WHERE user_id = " + result[0].id + ";", {
                        type: dbConnect.QueryTypes.SELECT
                    }).then(kq => {
                        if (kq.length == 0) {
                            models.Owner.update({ isactivated: true }, {
                                where: {
                                    own_id: result[0].id
                                }
                            })
                                .then(() => {
                                    res.statusCode = 200;
                                    res.json({ success: true });
                                })
                        } else {
                            models.User.update({ isactivated: true }, {
                                where: {
                                    user_id: result[0].id
                                }
                            })
                                .then(() => {
                                    res.statusCode = 200;
                                    res.json({ success: true });
                                })
                        }
                    })
                }
            }, (err) => next(err))
                .catch(err => next(err));
        }
    })
    .post((req, res, next) => {
        var id = authenticate.getAccountId(req);
        authenticate.sendEmail(req.hostname, req.body.email, authenticate.getCodeVerify(id));
        res.statusCode = 201;
        res.json({ success: true, status: 'Please check your email to verify account' });
    })

    accountRouter.route('/forgotten')
    .post((req, res, next) => {
        dbConnect.query("SELECT email FROM account WHERE username = '" + req.body.username + "';", {
            type: dbConnect.QueryTypes.SELECT
        }).then(result => {
            if (result.length == 0) {
                res.statusCode = 403;
                res.json({ message: 'Tài khoản người dùng chưa chính xác, vui lòng nhập lại!' })
            } else {
                var code = authenticate.getCodeForgotten();
                authenticate.sendCode(result[0].email, code);
                models.Account.update({ code: code }, {
                    where: {
                        username: req.body.username
                    }
                })
                res.statusCode = 200;
                res.json({ success: true });
            }
        }, (err) => next(err))
            .catch(err => next(err))
    })

accountRouter.route('/forgotten/code')
    .post((req, res, next) => {
        dbConnect.query("SELECT code FROM account WHERE username = '" + req.body.username + "';", {
            type: dbConnect.QueryTypes.SELECT
        }).then(result => {

            if (result.length == 0) {
                res.statusCode = 403;
                res.json({ message: 'Tài khoản người dùng chưa chính xác, vui lòng nhập lại!' })
            } else {
                if (result[0].code == req.body.code) {
                    res.statusCode = 200;
                    res.json({ success: true })
                } else {
                    console.log(req.body);
                    res.statusCode = 403;
                    res.json({ message: 'Mã xác minh không chính xác, vui lòng xác minh lại!' })
                }
            }
        }, (err) => next(err))
            .catch(err => next(err))
    })

accountRouter.route('/forgotten/password')
    .post((req, res, next) => {
        models.Account.update({ password: req.body.password },
            {
                where: {
                    username: req.body.username
                }
            })
        res.statusCode = 200;
        res.json({ success: true });
    })
    
accountRouter.route('/changepass')
    .put(authenticate.verifyUserOrOwner, (req, res, next) => {
        const id = authenticate.getAccountId(req);
        dbConnect.query("SELECT password FROM account WHERE id = " + id + ";", {
            type: dbConnect.QueryTypes.SELECT
        }).then((result) => {
            if (result[0].password != req.body.password) {
                res.statusCode = 403;
                res.json({message: "Mật khẩu cũ không đúng"});
            } else {
                models.Account.update({password: req.body.newpass}, {
                    where: {
                        id: id
                    }
                }).then(() => {
                    res.statusCode = 201;
                    res.json({success: true});
                }, err => next(err));
            }
        }, err => next(err))
        .catch(err => next(err));
    })

module.exports = accountRouter;