const validation = require("../validators/validation")




const createUserMid = async function(req,res,next){
    try{
        const data = req.body

        // Extracting values from requestBody
        let {title,name,phone,email,password,address}=data

        // Validation on requestBody
        if(!validation.isValidObject(data)){
            res.status(400).send({status:false, msg:"pls provide user details"})
            return
        }

        //Check for mandatory fields
        let arrOfMandField = ["title","name","phone","email","password"]
        for(let key of arrOfMandField){
            if(!Object.keys(data).includes(key)){
                res.status(400).send({status:false, msg:`${key} must be present`})
                return
            }
        }

        //Check for type String
        let typeStringField = ["title","name","email","phone","password"]
        for(let key of typeStringField){
            if(!validation.isValidString(data[key])){
                res.status(400).send({status:false,msg:`${key} can't be empty / String only`})
                return
            }
        }

        ///check for field that  CAN contains only letters
        let letField = ["name"]
        for(let key of letField){
            if(!validation.isLetters(data[key])){
                res.status(400).send({status:false,msg:`${key} must contain letters only`})
                return
            }
        }

        //1.validation on title
        if(!validation.isValidTitle(title)){
            res.status(400).send({status:false, msg:"title must be from - Mr, Mrs, Miss"})
            return
        }

        //3. Validation on phone number
        if(!validation.isValidPhone(phone)){
            res.status(400).send({status:false, msg:"phone must be indian phone number (without +91)"})
            return
        }

        //4. Validation on email
        if(!validation.isValidEmail(email)){
            res.status(400).send({status:false, msg:"email is Invalid"})
            return
        }

        //5. Validation on password

        if(!validation.isValidPassword(password)){
            res.status(400).send({status:false, msg:"password must contain uppercase,lowercase,number,special charactor"})
            return
        }

        //6. Vaidation on address
        if(address){
            if(!validation.isValidObject(address)){
                res.status(400).send({status:false, msg:"pls provide address in correct formate"})
                return
            }

            // Check for types of value to be String 
            let arr=["street","city","pincode"]
            for(let key in address){
                if(!validation.isValidString(address[key])){
                    res.status(400).send({status:false, msg:`${key} can't be empty / String only`})
                    return
                }
            }

            // Check for city to have only letters in value
            if(address["city"]){
                if(!validation.isLetters(address["city"])){
                    res.status(400).send({status:false, msg:"city must contains letters only"})
                    return
                }
            }
            if(address["pincode"]){
                if(!/^[1-9][0-9]{5}$/.test(address["pincode"])){
                    res.status(400).send({status:false, msg:"invalid pincode"})
                    return
                }
            }
         
        }
        next()
         
    }
    catch(err){
        res.status(500).send({statu:false, msg:err.message})
    }
}


module.exports={
    createUserMid,
}