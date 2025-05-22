const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService} = require('../services');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).json({ 
    message: "Register done",
    username: user.username
  });
});

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await userService.getUserByUsername(username);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect username or password');
  }
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const authenticateJWT = catchAsync(async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  const user = await authService.verifyAccessToken(token);
  req.user_id = user;
  next();
});

const changePass = catchAsync(async (req, res) => {
  const { oldPassword, newPassword, full_name } = req.body;
  const user_id = req.user_id;
  
  // Lấy thông tin user từ database
  const user = await userService.getUserById(user_id);
  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại');
  }
  
  // Kiểm tra mật khẩu cũ
  if (!(await user.isPasswordMatch(oldPassword))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Mật khẩu cũ không chính xác');
  }
  
  // Cập nhật mật khẩu mới và họ tên
  user.password = newPassword;
  user.full_name = full_name;
  await user.save();
  
  await tokenService.invalidateUserTokens(user_id);
  
  res.status(httpStatus.OK).json({
    message: 'Đổi mật khẩu và cập nhật thông tin thành công'
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  authenticateJWT,
  changePass
};
