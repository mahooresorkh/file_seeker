const seeker = require("find-in-files");
const fs = require('fs');

//read the file containing 600 stored procedure names
fs.readFile('600SPs.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    //split the string based on new lines an put each keyword in the array.
    const lines = data.split(/\r?\n/);  

    //make sure there is no white spaces
    const trimmedLines = lines.map(line=>line.trim());

    //show a message to user to wait till async task is finished.
    console.log("please wait...");

    //create a regex to match any of the keywords while searching files.
    const regExText = trimmedLines.join("|");
    
    //call find function of find-in-files package which can search through all of the files 
    // in the given directory and its sub directories that have .cs format
    seeker.find(regExText, "D:\\Bahar\\newBahar",".cs$")
    .then(res=>{
        //res is based on files pathes having the keywords
        //what is intended is keywords based on the file pathes
        //so res format should be modified.
        var rawAnswers = [];
        Object.keys(res).map(key=>{
            const rawElement = {
                address:key,
                matchedCases:res[key].matches
            };
            rawAnswers.push(rawElement);
        })
        var finalAnswerWithAddress = [];
        var finalAnswerWithoutAddress = [];
        trimmedLines.map(word=>{
            let finalItem = {
                word,
                addresses:[]
            }
            rawAnswers.map(rawAnswer=>{
                if(rawAnswer.matchedCases.some(i=>i==word)){
                    finalItem.addresses.push(rawAnswer.address);
                }
            });
            if(finalItem.addresses.length==0){
                finalAnswerWithoutAddress.push(finalItem);
            }
            else{
                finalAnswerWithAddress.push(finalItem);
            }
        })
        
        //write finalAnswer to a json file
        fs.writeFile("answerWithAdress.json",JSON.stringify(finalAnswerWithAddress,null,2),function(error){
            if(error)
                console.log("not created.");
            else    
                console.log("created successfully.")
        })
        fs.writeFile("answerWithoutAdress.json",JSON.stringify(finalAnswerWithoutAddress,null,2),function(error){
            if(error){
                console.log("not created");
            }
            else{
                console.log("created successfully.");
            }
        })
    })
});





