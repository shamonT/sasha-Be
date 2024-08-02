const socket = require("../model/socket.model");
const User = require("../model/users.model");

async function addsocketdetails(data, id) {
  console.log(data, id);
  let response = await socket.findOne({ email: data.email });
  console.log(response, "responseresponse");
  if (response) {
    await socket.updateOne({ email: data.email }, { $set: { socket_id: id } });
  } else {
    let res = await socket.create({
      email: data.email,
      id: data.id,
      socket_id: id,
    });
    console.log(res, "res");
  }
}
module.exports = { addsocketdetails };
