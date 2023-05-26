const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");
const permission = require("../middleware/permission");
const router = express.Router();

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 255 },
  age: { type: Number, required: true, min: 1, max: 110 },
  gender: { type: String, required: true },
  email: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 255,
    unique: true,
  },
  phone: { type: String, minlength:10, maxlength: 10 },
});

const Member = mongoose.model("member", memberSchema);

router.get("/", async (req, res) => {
  const members = await Member.find();
  res.send(members);
});

router.post("/", [permission], async (req, res) => {
  const { error } = validateMember(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let member = new Member({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    gender: req.body.gender,
    phone: req.body.phone,
  });
  member = await member.save();
  res.send(member);
});

function validateMember(member) {
  const schema = {
    name: Joi.string().min(5).max(255).required(),
    age: Joi.number().min(1).max(110).required(),
    gender: Joi.string().max(6).required(),
    phone: Joi.string().min(10).max(10).required(),
    email: Joi.string().required().min(10).max(255),
  };
  return Joi.validate(member, schema);
}
module.exports = router;
