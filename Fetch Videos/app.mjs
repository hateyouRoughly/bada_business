import fs from 'fs';
import { exec } from 'child_process';
import request from 'request';
import progress from 'request-progress';
import { XMLHttpRequest as _XMLHttpRequest } from 'xmlhttprequest'; //XMLHttpRequest
const XMLHttpRequest = _XMLHttpRequest;
import terminalImage from 'terminal-image';
import got from 'got';

var course;
var searchcourse = [];
var searchString;
var config = [];

fs.readFile('courses.json', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log("\nCollecting information from data...\n------------------------------------------------------------");

  course = JSON.parse(data);
  for(var i = 0; i < course.length; i++){
      course[i].index = i;
  }

  try{
    if(process.argv[2]=='search'){
        search(process.argv[3]);
    }else if(process.argv[2]=='info'){
        detail(process.argv[3])
    }else if(process.argv[2]=='get'){
        getVideo(process.argv[3]);
    }else if(process.argv[2]=='getAll'){
        getVideo(process.argv[3]);
    }else{
      console.error("Command execution failed, command not found!");
      return;
    }
  }catch(e){
    console.log(e);
  }
})

function search(query){
    for(let c of course){
      searchString = c.title + " " + c.category + " " + c.authorName;
      for(let q of query.split(" ")){
        if(searchString.toLowerCase().includes(q.toLowerCase())){
          searchcourse.push(c);
        }
      }  
    }
    
    searchcourse = sort(searchcourse);

    for(let c of searchcourse){
      searchString = c.title + " (" + c.category + ") by " + c.authorName;
      console.log(c.index, searchString);
    }

}

function sort(myArray){
  
  return Array.from(
      myArray.reduce((map, item) => 
          (map.get(item.url).count++, map) 
      , new Map(myArray.map(o => 
          [o.url, Object.assign({}, o, { count: 0 })]
      ))), ([k, o]) => o
  ).sort( (a, b) => b.count - a.count )
  .map( o => o );

}

async function detail(index){
    const body = await got(course[index].image).buffer();
    console.log(await terminalImage.buffer(body,{width: 200, height: 50, preserveAspectRatio: true}));
    console.log('\x1b[33m%s\x1b[0m', "Index : ", course[index].index);
    console.log('\x1b[33m%s\x1b[0m', "Title : ", course[index].title);
    console.log('\x1b[33m%s\x1b[0m', "Category : ", course[index].category);
    console.log('\x1b[33m%s\x1b[0m', "Author Name : ", course[index].authorName);
    console.log('\x1b[33m%s\x1b[0m', "Author Designation : ", course[index].authorDesignation);
    console.log('\x1b[33m%s\x1b[0m', "Author Description : ", course[index].authorDescription.replace(/<[^>]+>/g, '').trim());
    console.log('\x1b[33m%s\x1b[0m', "Created at : ", course[index].createdAt);
    console.log('\x1b[33m%s\x1b[0m', "Updated at : ", course[index].updatedAt);
    console.log('\x1b[33m%s\x1b[0m', "Duration : ", course[index].durationinmin + " Minutes & " + course[index].durationinsec + " Seconds");
    console.log('\x1b[33m%s\x1b[0m', "Course Name : ", course[index].course_name);
}

function getVideo(index){
    console.log(index, course[index].url);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4 && this.status == 200) {
        var response = JSON.parse(this.responseText).sources;
        downloadVideo(index, course[index].url, response[response.length-1].src);
      }
    });

    xhr.open("GET", "https://edge.api.brightcove.com/playback/v1/accounts/6016595237001/videos/"+course[index].url);
    xhr.setRequestHeader("BCOV-POLICY", "BCpkADawqM2__41Bxf3XuIMeXhvI1nhXfGzEBHhmWj9OAk-NQ-JngsfxOdjn3oPq8lsWgXpCRpZG6vumyteqFAts6_miBxRZP7tGOQvr5Okus7Sihv9QrFntQUMc8lKw1eCHZin5N4Dd85VK");
    xhr.setRequestHeader("User-Agent", "Dalvik/2.1.0 (Linux; U; Android 10; Nokia 6.1 Build/QKQ1.190828.002)");
    xhr.setRequestHeader("Host", "edge.api.brightcove.com");
    xhr.setRequestHeader("Connection", "Keep-Alive");
    xhr.setRequestHeader("Accept-Encoding", "gzip");

    xhr.addEventListener('error', function(){
        console.log("Retry for "+index, course[index].url);
        getVideo(index);
    });

    xhr.send();
}

function downloadVideo(index, id, url){
    progress(request(url), {
    })
    .on('progress', function (state) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(id + " " + parseInt(state.percent*100) + '%');
    })
    .on('error', function (err) {
        unlink('video/id.mp4', (err) => {});
        console.log("Re-download for "+index, id);
        getVideo(index);
    })
    .on('end', function () {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(id + " " + 100 + '%');
        process.stdout.write('\n');

        config.push({index:index ,id:id});
        fs.writeFile('config.json', JSON.stringify(config), { flag: 'w+' }, err => {});

        if(process.argv[2]=='getAll'){
          if(index < course.length-1){
             getVideo(++index);
          }else{
            exec('start video', (error, stdout, stderr) => {});
          }
        }else{
          exec('start video/' + id + '.mp4', (error, stdout, stderr) => {});
        }
        
    })
    .pipe(fs.createWriteStream('video/' + id + '.mp4'));
}



