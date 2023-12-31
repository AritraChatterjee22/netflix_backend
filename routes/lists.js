const router = require("express").Router();
const verify  = require("../verifyToken");
const List = require("../models/List");


//CREATE
router.post("/", verify, async(req,res)=>{
  if(req.user.isAdmin){
      const newList = new List(req.body);
      try {
        const savedList = await newList.save();
        res.status(200).json(savedList);
      }catch (err) {
        res.status(500).json({error: err.message})
      }
  } else{
    res.status(403).json("You are not allowed")
  } 
})

// DELETE

router.delete("/:id", verify, async(req,res)=>{
  if(req.user.isAdmin){
      try {
        await List.findByIdAndDelete(req.params.id);
        res.status(200).json("The List has been deleted");
      }catch (err) {
        res.status(500).json({error: err.message})
      }
  } else{
    res.status(403).json("You are not allowed")
  } 
})


// GET

router.get("/", verify, async (req, res)=>{
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];

  try {
    if(typeQuery){
      if(genreQuery){
        list = await List.aggregate([
          {$sample: {size:10}},
          {$match: {type: typeQuery, genre: genreQuery}},
        ]);
      }else{
        list = await List.aggregate([
          {$sample: {size:10}},
          {$match: {type: typeQuery}},
        ])
      }
    }
    else{
      list = await List.aggregate([{$sample: {size:10}}]);
    }
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({error: err.message})
  }
})

module.exports = router
