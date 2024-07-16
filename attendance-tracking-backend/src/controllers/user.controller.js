import user from "../models/user";
import * as AuthService from "../services/user.service";

export const getUser = async (res, req) => {
  res.json({message: "This is the page for admin only"})
}

export const createUser = async (req, res) => {
  console.log("Hello", req.body);
    const data = await AuthService.createUser(req.body);
    res.status(data.code).json({
        code: data.code,
        data: data.data,
        message: data.message
      });
}

export const login = async (req, res) => {
  console.log(req);
  console.log(req.body);
  const { lat, lon } = req.query;
  console.log(lat, lon);
  const data = await AuthService.login(req.body, lat, lon);
  res.status(data.code).json({
    code: data.code,
    data: data.data,
    message: data.message
  });
};