const express = require('express')
const router =  express.Router();

const food_schema = require('../food_module/foodM')
const upload = require('../Multer/multer')

// upload data to server
router.post('/uploads',upload.single('foodimage'),async(req,resp)=>{


    const {name,desc,price}=req.body;
    if(!req.file){
       return  resp.status(404).json({error:'file not found'})
    }
    const image = req.file.filename
    try{
        const newFood= new food_schema({
            name,
            image,
            desc,
            price
        })
        await newFood.save()
        resp.json({message:'new product added successfully'})
    }catch(error){
      console.log(error)
      resp.status(500).json({error:'error saving to database'})
    }

})
// get data from server 
router.get('/',async(req,resp)=>{
    try{
        const data = await food_schema.find();
        console.log('data fetched')
        resp.status(200).json({data})

    }catch(error){
        console.log(error)
        resp.status(500).json({error:'internel server error'})
    }

})

// update data 
router.put('/:id',async(req,resp)=>{
   try{
    
     const foodID= req.params.id;
     const updateFoodData = req.body;
     const response = await food_schema.findByIdAndUpdate(foodID,updateFoodData,{
        new:true,
        runValidators:true
     })
     if(!response){
        return resp.status(404).json({error:'page not found'})
     }
     console.log('data updated')
     resp.status(200).json({response})

   }catch(error){
    console.log(error)
    resp.status(500).json({error:'internel server error'})
   }
});

// delete data 
router.delete('/:id',async(req,resp)=>{
   try{
      const deleteID = req.params.id;
      const response = await food_schema.findByIdAndDelete(deleteID);
      if(!response){
        return resp.status(404).json({error:'page not found'})    
      }
      console.log('data deleted successfully')
      resp.status(200).json('data deleted')
   }catch(error){
    console.log('error is: ',error)
    resp.status(500).json({error:'internel server error'})
   }
})
module.exports=router;