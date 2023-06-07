const processInput = (req, res)=>{
    try{
        return res.status(200).json({msg:"success"})

    }
    catch(err){
        return res.json(500).json({error: err})
    }
}

module.exports = {
    processInput
}