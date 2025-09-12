import { User } from '../models/user.model.js';
import { hashPassword } from '../services/auth.service.js';

export async function createUser(req, res) {
  const { email, phoneNumber, password } = req.body;

  try {
    if ((!email && !phoneNumber) || !password) {
      return res.status(401).json({
        success: false,
        message: 'Password and either email or number are required',
      });
    }

    //check if usewr already exists by email
    if (email) {
      const existedUser = await User.findOne({ email: email });
      if (existedUser) {
        return res.status(401).json({
          success: false,
          message: 'user already exists with given email',
        });
      }
    }

    if (phoneNumber) {
      const existedUser = await User.findOne({ phoneNumber: phoneNumber });
      if (existedUser) {
        return res.status(401).json({
          success: false,
          message: 'user already exists with given number',
        });
      }
    }

    //create a user but we need to hash password first

    const hashedPassword = await hashPassword(password);

    //create user in db
    //
    const userData = {
      password: hashedPassword,
    };

    //we all dynamically add property bcs we are getting either email or number on signup

    if (email) {
      userData.email = email;
    }
    if (phoneNumber) {
      userData.phoneNumber = phoneNumber;
    }

    const createdUser = await User.create(userData);

    if (!createdUser) {
      return res.status(500).json({
        success: false,
        message: 'something went wrong while creating a user',
      });
    }

    const { password: _, ...safeUser } = createdUser.toObject();

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: safeUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'something went wrong in creating a user',
    });
  }
}
