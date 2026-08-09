import bcrypt from "bcrypt";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import {
  signAccessToken,
  createRefreshTokenHash,
  verifyRefreshTokenHash,
  getRefreshTokenExpiry,
} from "../utils/jwt.js";

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
});

/**
 * Register User
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const accessToken = signAccessToken(user._id);
    const { plainToken, tokenHash } = await createRefreshTokenHash();
    const refreshTokenDoc = await RefreshToken.create({
      user: user._id,
      tokenHash,
      expiresAt: getRefreshTokenExpiry(),
    });
    const refreshToken = `${refreshTokenDoc._id.toString()}.${plainToken}`;

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      accessToken,
      refreshToken,
      token: accessToken,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * Login User
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = signAccessToken(user._id);
    const { plainToken, tokenHash } = await createRefreshTokenHash();
    const refreshTokenDoc = await RefreshToken.create({
      user: user._id,
      tokenHash,
      expiresAt: getRefreshTokenExpiry(),
    });
    const refreshToken = `${refreshTokenDoc._id.toString()}.${plainToken}`;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      token: accessToken,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const parts = refreshToken.split(".");
    if (parts.length !== 2) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const [tokenId, tokenSecret] = parts;
    const storedToken = await RefreshToken.findById(tokenId);

    if (
      !storedToken ||
      storedToken.revoked ||
      storedToken.expiresAt < new Date()
    ) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is invalid or expired",
      });
    }

    const isValid = await verifyRefreshTokenHash(
      tokenSecret,
      storedToken.tokenHash
    );

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is invalid",
      });
    }

    const accessToken = signAccessToken(storedToken.user);

    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const parts = refreshToken.split(".");
    if (parts.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const [tokenId] = parts;
    const storedToken = await RefreshToken.findById(tokenId);

    if (storedToken && !storedToken.revoked) {
      storedToken.revoked = true;
      await storedToken.save();
    }

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
