import {uncTeenSurvey} from "/js/surveylist.js";

//let surveyName = "uncTeenSurvey"; // Get surveyname from table Question in the database
//let questionList = ["M1", "M2"]; // Fetch question list from the database

var idJSON = JSON.parse($('#idJSON').text());
var timeJSON = JSON.parse($('#timeJSON').text());
var surveynameJSON = JSON.parse($('#surveynameJSON').text());
var qlistJSON = JSON.parse($('#qlistJSON').text());

var surveyName=surveynameJSON;
var id=idJSON;
var questionList=qlistJSON;
//var questionList=qlistJSON.split("_");
var time=timeJSON;


console.log( idJSON ); 
console.log( surveynameJSON ); 
console.log( timeJSON ); 
console.log( qlistJSON );
console.log(questionList);


//let questionList = ["Q1", "Q2"]; 
if (surveyName === "uncTeenSurvey") {
    let questions = uncTeenSurvey;
    insertQuestions(questions);
} else if (surveyName === "uncTeen") {
}

function insertQuestions(questions) {
    let newPages = [];
    for (let i = 0; i < questions.pages.length; i++) {
        if (questionList.includes(questions.pages[i].questions[0].name)) {
            newPages.push(questions.pages[i]);
        }
    }
    questions.pages = newPages;
    window.survey = new Survey.Model(questions);
}

var myCss = {
    matrix: {root: "table table-striped matrixtable"},
};

$("#surveyContainer").Survey({
    model: survey,
    css: myCss
});

survey
    .onComplete
    .add(function (sender) {
        document
            .querySelector('#surveyResult')
            .textContent = "Result JSON:\n" + JSON.stringify(sender.data, null, 3);
    });

 function sendDataToTheServer(isComplete, data) {
        // var text = isComplete ? "The survey is completed" : "The survey is not completed";
        var a=Object.keys(data);
        // document.querySelector('#surveyResults').innerHTML = text + ", result: " + JSON.stringify(data);
        var url="https://web-based-survey.herokuapp.com/answer";
        var timeNow = new Date();
        console.log(timeNow.getFullYear().toLocaleString() + "-" + timeNow.getMonth().toLocaleString() + "-" + timeNow.getDate()//.toLocaleString()
        ,timeNow.toLocaleString()
       )
         fetch(url,{
            method:'post',
            body: JSON.stringify({
                id:id,
                time: timeNow, 
                 survey: time, 
                 question: a[a.length-1], 
                 answer: data[a[a.length-1]], 
                 date: timeNow.getFullYear()+ "-" + timeNow.getMonth() + "-" + timeNow.getDate()
            }),
            headers:{'Content-Type':'application/json'}
        });
        //const t=await response.json();
       // console.log(t);
    }
    
    survey.onComplete.add(function(survey) {
        sendDataToTheServer(true, survey.data);
    });
    
    survey.onPartialSend.add(function(survey) {
        sendDataToTheServer(false, survey.data);
    });

var defaultThemeColors = Survey
    .StylesManager
    .ThemeColors["default"];
defaultThemeColors["$main-color"] = "#4B9CD3";
defaultThemeColors["$main-hover-color"] = "#4B9CD3";
defaultThemeColors["$text-color"] = "#4a4a4a";
defaultThemeColors["$header-color"] = "#4B9CD3";

defaultThemeColors["$header-background-color"] = "#4a4a4a";
defaultThemeColors["$body-container-background-color"] = "#f8f8f8";

Survey
    .StylesManager
    .applyTheme();

$(".sv_prev_btn").remove(); // hide the previous button
