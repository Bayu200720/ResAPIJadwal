import User from './../models/user.js';
import express from 'express';
import bcrypt from 'bcrypt';


const userRouter = express.Router();


//add new user

userRouter.post('/add', async (req,res) => {
    try {
        const{
            username,
            password
        } = req.body;

        

        var saltRounds =10;
        const hashedPw = await bcrypt.hash(password, saltRounds);

       // console.log(username);
        const newUser = new User({
            "username":username,
            "password":hashedPw
        });


        const createwordUser = await newUser.save();
        res.status(200).json(createwordUser);
    } catch (error) {
        res.status(500).json({ error: error});
        // res.status(500).json(error)
    }
})

userRouter.get('/home', async (req,res) => {
    const Users = await User.find({});

    if(Users && Users.length !== 0){
        res.json(Users)
    }else{
        res.status(404).json({
            message:"Users not found"
        })
    }
} );




userRouter.put('/update/:id', async (req,res) => {
    const {username, password} = req.body;

    const user = await User.findById(req.params.id);

        if(user){

            var saltRounds =10;
            const hashedPw = await bcrypt.hash(password, saltRounds);
            user.username= username;
            user.password = hashedPw;
           
            
            const updateUser = await user.save();

            res.json(updateUser);

        }else{
            res.status(404).json({
                massage :'User not found'
            })
        }
});

//delete
userRouter.delete('/delete/:id', async (req,res) => {
    const user = await User.findById(req.params.id);
    var id = req.params.id;
    console.log(id);
    console.log(user);

    if(user){
        await user.remove();
        res.json({ //homework
            message: 'Data remove'
        })
    }else{
        res.status(404).json({
            message :'user not found'
        })
    }
})



//login
userRouter.post('/login', async (req, res) => {
    try{

        const{
            username,
            password
        } = req.body;


     //   console.log(username);
        
        const currentUser = await new Promise((resolve, reject) =>{
            User.find({"username": username}, function(err, user){
                if(err)
                    reject(err)
                resolve(user)
            })
        })
        
        //cek apakah ada user?
       if(currentUser[0]){
            //check password
            bcrypt.compare(password, currentUser[0].password).then(function(result) {
                if(result){
                    //urus token disini
                    res.status(201).json({"status":"logged in!"});
                }
                else
                    res.status(201).json({"status":"wrong password."});
            });
        }
        else{
            res.status(201).json({"status":"username not found"});
        }

    }
    catch(error){
        res.status(500).json({ error: error})
    }
})


export default userRouter;