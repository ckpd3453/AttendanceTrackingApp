import HttpStatus from 'http-status-codes';
import sequelize, { DataTypes } from '../config/database';
import * as loginLocation from '../utils/location-detector';

const User = require('../models/user').default(sequelize, DataTypes);
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

export const createUser = async (body) => {
  console.log('in service', body);
  try {
    const email = body.email;
    console.log(email);
    const checkUser = await User.findOne({ where: { email: email } });
    console.log('checking', checkUser);
    if (checkUser) {
      return {
        code: HttpStatus.BAD_REQUEST,
        data: null,
        message: 'User is already registered'
      };
    }
    body.password = await bcrypt.hash(body.password, 10);
    const data = await User.create(body);

    return {
      code: HttpStatus.OK,
      data: data,
      message: `${body.email} is registered successfully`
    };
  } catch {
    return {
      code: HttpStatus.BAD_REQUEST,
      data: null,
      message: `Check your input data`
    };
  }
};

export const login = async (body, latitude, longitude) => {
  const { email, password } = body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        code: HttpStatus.BAD_REQUEST,
        data: null,
        message: 'user is not registered'
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        code: HttpStatus.BAD_REQUEST,
        data: null,
        message: 'invalid password'
      };
    }

    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id
        }
      },
      process.env.ACCESS_TOKEN_KEY
    );
    console.log(accessToken);

    if (latitude && longitude) {
      const location = await loginLocation.getLocation(latitude, longitude);
      return {
        code: HttpStatus.ACCEPTED,
        data: { token: accessToken, location: location, email: email },
        message: 'location is fetched successfully'
      };
    } else {
      return {
        code: HttpStatus.BAD_REQUEST,
        data: null,
        message: 'Please allow location permission'
      };
    }
  } catch {
    return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      message: 'Server side error'
    };
  }
};
