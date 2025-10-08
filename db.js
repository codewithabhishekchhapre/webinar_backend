const mongoose = require("mongoose");

const connectDB = async () => {
     try {
          await mongoose.connect("mongodb+srv://devpot076_db_user:YIrtY0KIkVV89TP8@cluster0.yajfcg3.mongodb.net/baserahub_webinar?retryWrites=true&w=majority&appName=Cluster0");
          console.log("✅ MongoDB connected successfully!");
     }
     catch (err) {
          console.log(err)
     }
}

module.exports=connectDB