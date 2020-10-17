import User from './../models/user.js';
import Kasir from './../models/kasir.js';
import express from 'express';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import Conf from './../config.js';


const userRouter = express.Router();

var router = express.Router();

router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());
//add new user

userRouter.post('/add', async (req,res) => {
    try {
        // const{
        //     username,
        //     email,
        //     password
        // } = req.body;
            var hashedPassword = bcrypt.hashSync(req.body.password,8);
        //     var saltRounds =10;
        //     const hashedPw = await bcrypt.hash(password, saltRounds);

     
                User.create(
                    {
                        nama_belakang: req.body.nama_belakang,
                        username: req.body.username,
                        password: hashedPassword,
                        jabatan: req.body.jabatan
                    },function(err,user)
                    {
                    if(err) return res.status(500).send("There was a problem registering the user.")
                    //create token
                    // var token = jwt.sign({user},Conf.secret,
                    //     { 
                    //         expiresIn: 0 // 24 hours
                    //     });
                    //     res.status(200).send({auth:true,token:token});
                    res.status(200).send(`${user} Berhasil Daftar`);

                    }
                );
        } catch(error)
        {
            res.status(500).json({error:error})
        }
});
   //    // console.log(username);
        //     const newUser = new User({
        //         "username":username,
        //         "email":email,
        //         "password":hashedPw

//         const createwordUser = await newUser.save();
//         res.status(200).json(createwordUser);
//     } catch (error) {
//         res.status(500).json({ error: error});
//         // res.status(500).json(error)
//     }
// })

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

userRouter.get('/home/:id', async (req,res) => {
    const Users = await User.findById(req.params.id);

    if(Users && Users.length !== 0){
        res.json(Users)
    }else{
        res.status(404).json({
            message:"Users not found"
        })
    }
} );

userRouter.get('/Aktivitas_Kasir', async (req,res) => {
    const Aktivitas_Kasir = await Kasir.find({});

    if(Aktivitas_Kasir && Aktivitas_Kasir.length !== 0){
        res.json(Aktivitas_Kasir)
    }else{
        res.status(404).json({
            message:"Aktivitas_Kasir not found"
        })
    }
} );


userRouter.get('/check', function(req, res) {
    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      res.status(200).send(decoded);
    });
  });

  



  //post
  userRouter.post('/tweet', function(req, res) {
    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      const email = decoded.user.email;
      res.status(200).send(decoded);
    });
  });


  userRouter.post('/Masukin_Uang',async function(req, res) {
    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

                       
                Kasir.create({
                    "jenis_transaksi":`${decoded.user.nama_belakang} Masukin Uang Status Bisa Melakukan`

                },function(err,user)
                {
                if(err) return res.status(500).send("There was a problem transaksi.")
                });

                     res.status(200).send(`${decoded.user.nama_belakang} Bisa Melakukan`);
    
    });
  });


  userRouter.post('/Melihat_Saldo_Total', function(req, res) {
    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const jabatan = decoded.user.jabatan;
        if(jabatan === '2'){

            Kasir.create({
                "jenis_transaksi":`${decoded.user.nama_belakang} Melihat Saldo total Status Tidak Memiliki wewenang`

            },function(err,user)
            {
            if(err) return res.status(500).send("There was a problem transaksi.")
            });


            res.status(200).send(`${decoded.user.nama_belakang} Tidak Memiliki Wewenang`);
        }else{

            Kasir.create({
                "jenis_transaksi":`${decoded.user.nama_belakang} Melihat Saldo Total Status Bisa Melakukan`

            },function(err,user)
            {
            if(err) return res.status(500).send("There was a problem transaksi.")
            });

            res.status(200).send(`${decoded.user.nama_belakang} Bisa Melakukan`);
        }
    });
  });

  userRouter.post('/check', function(req, res) {
    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      const jabatan = decoded.jabatan;
      console.log(jabatan);
      res.status(200).send(decoded);
    });
  });

  userRouter.post('/Mengambil_Uang', function(req, res) {
    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      const jabatan = decoded.user.jabatan;
      console.log(decoded);
      if(jabatan === '2' || jabatan === '1'){

            Kasir.create({
                "jenis_transaksi":`${decoded.user.nama_belakang} Mengambil Uang Status Tidak Memiliki Wewenang`

            },function(err,user)
            {
            if(err) return res.status(500).send("There was a problem transaksi.")
            });

            res.status(200).send(`${decoded.user.nama_belakang} Tidak Memiliki Wewenang`);
         }else{

            Kasir.create({
                "jenis_transaksi":`${decoded.user.nama_belakang} Mengambil Uang Status Bisa Melakukan`

            },function(err,user)
            {
            if(err) return res.status(500).send("There was a problem transaksi.")
            });
            res.status(200).send(`${decoded.user.nama_belakang} Bisa Melakukan`);
        }
    });
  });




userRouter.put('/update/:id', async (req,res) => {
    const {nama_belakang,jabatan,username, password} = req.body;
   
    const user = await User.findById(req.params.id);

        if(user){
            if(username === undefined){
                user.username = user.username;
            }else{
                user.username= username;
            }

            if(jabatan === undefined){
                user.jabatan = user.jabatan;
            }else{
                user.jabatan= jabatan;
            }

            if(nama_belakang === undefined){
                user.nama_belakang = user.nama_belakang;
            }else{
                user.nama_belakang= nama_belakang;
            }

            if(password === undefined){
                user.password = user.password;
            }else{
                //user.password= password;

                var saltRounds =10;
                const hashedPw = await bcrypt.hash(password, saltRounds);
               
                user.password = hashedPw;
            }
           // console.log(user.username);
           // console.log(password);
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
        
        const user1 = await new Promise((resolve, reject) =>{
            User.find({"username": username}, function(err, user){
                if(err)
                    reject(err)
                resolve(user)
            })
        })
        
        //cek apakah ada user?
       if(user1[0]){
            //check password
            bcrypt.compare(password, user1[0].password).then(function(result) {
                if(result){
                 const user = user1[0];  
                  console.log(user);
                    //urus token disini
                    var token = jwt.sign({user},Conf.secret,
                        { 
                            expiresIn:12000 // 24 hours
                        });
                        res.status(200).send({auth:true,token:token});
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