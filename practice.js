// const isValidPhone=(data)=>{
//     let phoneRegex=/^[6-9]\d{9}$/
//     return phoneRegex.test(data)
// }
// // console.log(isValidPhone("99999999989"))
// const moment = require("moment")
// let data=new Date()
// console.log(data.toISOString())
// let date = moment(data, "DD-MM-YYYY")

// console.log(Object.prototype.toString.call(data))
// console.log(date.isValid())

// var minStartValue = function(nums) {
//     let min=Infinity,a=1
//     while(min!==1){
//         for(let i=0;i<nums.length;i++){
//             a+=nums[i]
//             // console.log(a)
//             if(min>a) min=a
//         }
//         a++,min=Infinity
//     }
//     return a
// };
// console.log(minStartValue([-3,2,-3,4,2]))

// const foo=(n,arr)=>{
//     let sum=0
//     for(let i=0;i<arr.length;i++){
//         sum+=arr[i]
//     }
    
// }
// console.log(foo(6,[1,2,3]))
// let moment=require("moment")

// // let data=
// // console.log(new Date(20,10,20))
// // releasedAt = moment(data,"YYYY-MM-DD")
// // console.log(releasedAt.isValid(),)
// let regex=/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
// let data=moment().format("YYYY-MM-DD")
// let a=moment().add(3, 'months').format("YYYY-MM-DD")
// let releasedAt="2022-09-22"
      
// // console.log(data)
// console.log(a)


var frequencySort = function(nums) {
   nums.sort((a,b)=>a-b)
   
};
console.log(frequencySort([1,1,2,2,2,3]))

