import express from 'express';
import Homework from './database.js';

const router = express();

router.post('/homeworks', async (req, res) => {
    try {

        const {course, title, due_date,status} =req.body;

        const homework = new Homework({
            course,
            title,
            due_date,
            status,
        });

        const createdHomework =await homework.save();


        res.status(201).json(createdHomework);
    } catch (err) {

        console.log(err);
        res.status(500),json({ error : 'DB Created failur' })
    }
})


router.get('/homeworks', async (req,res) => {
    const homeworks = await Homework.find({});

    if(homeworks && homeworks.length !== 0){
        res.json(homeworks)
    }else{
        res.status(404).json({
            message:"homework not found"
        })
    }
} );

router.get('/homeworks/:id', async (req,res) => {
    const homework = await Homework.findById(req.params.id);

    if(homework){
        res.json(homework)
    }else{
        res.status(404).json({
            message:"homework not found"
        })
    }
} );

//@desc update a homework
//@route PUT/api/homeworks/:id
router.put('/homeworks/:id', async (req,res) => {
    const {course, title, due_date,status} =req.body;

    const homework = await Homework.findById(req.params.id);

        if(homework){
            homework.course= course;
            homework.title = title;
            homework.due_date = due_date;
            homework.status = status;

            const updateHomework = await homework.save();

            res.json(updateHomework);

        }else{
            res.status(404).json({
                massage :'homework not found'
            })
        }
})


//@desc delete homeworks
//@route delete/api/homework/:id
router.delete('/homeworks/:id', async (req,res) => {
    const homework = await Homework.findById(req.params.id);
    console.log(homework);

    if(homework){
       // await homework.remove();
        res.json({ //homework
            message: 'Data remove'
        })
    }else{
        res.status(404).json({
            message :'homework not found'
        })
    }
})

router.delete('/homeworksAll', async (req,res) => {
    const homework = await Homework.deleteMany();

    if(homework){


       res.json({ 


           message: 'Data all remove'
        })
    }else{
        res.status(404).json({
            message :'homework not found'
        })
    }
})

export default router;