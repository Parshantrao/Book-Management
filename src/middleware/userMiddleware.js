const validation = require("../validators/validation")




const createUserMid = async function(req,res,next){
    try{
        const requestBody = req.body

        // Extracting values from requestBody
        let {title,name,phone,email,password,address}=requestBody

        // Validation on requestBody
        if(!validation.isValidObject(requestBody)){
            res.status(400).send({status:false, msg:"pls provide user details"})
            return
        }

        //Check for mandatory fields
        let arrOfMandField = ["title","name","phone","email","password"]
        for(let key of arrOfMandField){
            if(!Object.keys(requestBody).includes(key)){
                res.status(400).send({status:false, msg:`${key} must be present`})
                return
            }
        }

        //1.validation on title
        if(!validation.isValidTitle(title)){
            res.status(400).send({status:false, msg:"title must be from - Mr, Mrs, Miss in string"})
            return
        }

        //2. validation on userName
        if(!validation.isValidName(name)){
            res.status(400).send({status:false, msg:"Name must contain letter only (string type)"})
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

            // for(let key in address){
            //     if(address[key].length==0){
            //         res.status(400).send({status:false, message:`${key} can't be empty`})
            //         return
            //     }
            // }

            // Validating city
            if(validation.isValid(address["city"])){
                if(!validation.isValidName(address["city"])){
                    res.status(400).send({status:false, msg:"city must contains letters only"})
                    return
                }
            }
            // Validating pincode
            if(validation.isValid(address["pincode"])){
                if(!validation.isValidPincode(address["pincode"])){
                    res.status(400).send({status:false, msg:"invalid pincode"})
                    return
                }
            }
            // Validating street
            if(validation.isValid(address["street"])){
                if(typeof address["street"] != "string" || address["street"].length==0){
                    res.status(400).send({status:false, message:"street can't be empty"})
                    return
                }
            }
         
        }
        next()
         
    }
    catch(err){
        return res.status(500).send({statu:false, msg:err.message})
    }
}


module.exports={
    createUserMid,
}