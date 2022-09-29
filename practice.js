// "use strict"
// console.log(a)
// let a=undefined+5
// console.log(a)
// (function(){
//     console.log("Immediately Invoked function")
// })()
// foo()

    // function foo(){
//         console.log("function")
//     }
// console.log(foo)

// {
//     var a=0
//     console.log("function")
// }
// // a=0
// console.log(a)
// function foo(){
//     let a=0
//     if(a>0){
//         var c=a*10
//     }
//     else{
//         var b=a*15
//     }
//     console.log(a,b,c)
// }
// foo()
// console.log(a,b,c)

function foo(s1){
    let arr=s1.split(" ")
   if(arr.length%2==0){
    for(let i=1;i<arr.length;i=i+2){
        let a=arr.splice(i,1)[0].split("").reverse().join("")
        console.log(a)
        arr.unshift(a)

    }
   }
   else{
    for(let i=0;i<arr.length;i=i+2){
        let a=arr.splice(i,1)[0].split("").reverse().join("")
        arr.unshift(a)

    }
   }
   return arr
}
console.log(foo("Ashish Yadav Abhishek Rajput Sunil Pundir"))