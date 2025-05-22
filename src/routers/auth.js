const express = require("express");
const authController = require('../controller/auth.controller');
const validate = require('../middlewares/validate');
const authValidation = require('../validations/auth.validation');
const { login, logout, register, changePass } = require('../controller/auth.controller');
const { authenticateJWT } = require("../controller/auth.controller");
const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Thông tin đăng nhập không hợp lệ
 */

router.post("/login", login);
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - full_name
 *             properties:
 *               full_name:
 *                 type: string
 *                 description: Họ tên đầy đủ
 *               username:
 *                 type: string
 *                 description: Tên đăng nhập
 *               password:
 *                 type: string
 *                 description: Mật khẩu
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Thông tin không hợp lệ
 */
router.post("/register",validate(authValidation.registerValidator), register);

/**
 * @swagger
 * /auth/change-pass:
 *   post:
 *     summary: Thay đổi mật khẩu và cập nhật thông tin
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - full_name
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Mật khẩu hiện tại
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới
 *               full_name:
 *                 type: string
 *                 description: Họ tên đầy đủ
 *     responses:
 *       200:
 *         description: Đổi mật khẩu và cập nhật thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đổi mật khẩu và cập nhật thông tin thành công
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     access:
 *                       type: string
 *                       description: Access token mới
 *                     refresh:
 *                       type: string
 *                       description: Refresh token mới
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không được phép hoặc mật khẩu cũ không chính xác
 */
router.post("/change-pass",authenticateJWT,validate(authValidation.changePass), changePass);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);

module.exports = router;
