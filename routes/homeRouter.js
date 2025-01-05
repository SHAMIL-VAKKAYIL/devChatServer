const router=require('express').Router()

router.get('/data',(req,res)=>{
    res.json([
        {id:1,name:'shamil',age:21},
        {id:2,name:'salman',age:22},
    ])
})


module.exports=router