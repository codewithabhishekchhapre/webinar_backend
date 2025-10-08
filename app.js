const express=require("express")
const app=express()
const connectDB =require("./db")
const User=require("./User")

app.use(express.json())

connectDB()
app.get("/",function(req,res){
     res.send("hello user")
})


app.post("/signup", async function(req,res){
     try{

          console.log(req.body)
          const {email,name,password,age}=req.body;
          
          var existUser= await User.findOne({email})

          if(existUser){
               res.json({
                    "message":"user all ready exist"
               })
          }
          
          var user=new User({
               email,name,password,age
          })
          await user.save();
          
          
          
          res.json({
               "message":"user created successfully"
          })
     }
     catch (err){
          res.json({
               "message":"server error ",
               "error":err.message
          })
     }

})


app.post("/login", async function(req,res){
     try{
          const {email,password}=req.body;

          if(!email||!password){
               res.json({
                    "message":"email and password is required"
               })
          }

          var user=await User.findOne({email})
          if(!user){
               res.json({
                    "message":"email not found"
               })
          }

          if(user.password!=password){
                res.json({
                    "message":"invalid password"
               })
          }

          res.json({
               "message":"user login successfully"
          })


     }
     catch(err){
          res.json({
               err
          })
     }

     

})


app.listen(5000,()=>{
     console.log("server is runing")
})