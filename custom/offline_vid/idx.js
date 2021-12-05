// Complete code documentation of MorphCast AI SDK, here:
// https://ai-sdk.morphcast.com/latest/index.html
// Video part
var tar_vid = document.getElementById("target_video")
function playVideo(){
  tar_vid.play();
}
function pauseVideo(){
  tar_vid.pause();
}

// Detector part
const initSDK = new Promise((res) => {
  res(CY.loader()
  	.licenseKey("11c1dbc0aa72c63a925e1d99103f9763d226cd9c2bcd")
    // .addModule(CY.modules().FACE_AGE.name)
    // .addModule(CY.modules().FACE_GENDER.name)
    .addModule(CY.modules().FACE_EMOTION.name)
    .load());
});

// var initMorphcast = new Promise ((res) => {
//   res(CY.loader()
//     .addModule(CY.modules().FACE_DETECTOR.name)
//     .load());
// });
var startMorphcast = () => initSDK.then(({start}) => start());
var stopMorphcast = () => initSDK.then(({stop}) => stop());

// DATA_AGGREGATOR (beta version) is available and can be tried too

const startButton = document.querySelector("#start_over");
let start_time;
const rows = ["Time, Angry, Disgust, Fear, Happy, Neutral, Sad, Surprise, Dominant Emotion"]

let isplaying = false;

startButton.onclick = () => {
  start_time = new Date();
  console.log(isplaying);
  playVideo();
  // startButton.style.display = "none";
  // initSDK.then(({
  //   start
  // }) => start());
  startMorphcast();
  isplaying = true;
};

// const age_div = document.querySelector("#age");
// const gen_div = document.querySelector("#gender");
const emo_div = document.querySelector("#emotion");

// window.addEventListener(CY.modules().FACE_AGE.eventName, (evt) => {
//   age_div.innerHTML = 'Age: ' + evt.detail.output.numericAge;
// });

// window.addEventListener(CY.modules().FACE_GENDER.eventName, (evt) => {
//   gen_div.innerHTML = 'Gender: ' + evt.detail.output.mostConfident;
// });

window.addEventListener(CY.modules().FACE_EMOTION.eventName, (evt) => {
  emo = evt.detail.output.dominantEmotion;
  // console.log(evt.detail.emotion)
  emo_div.innerHTML = 'Emotion: ' + emo;
  let d = new Date();
  let diff = d - start_time;
  let emotions = evt.detail.output.emotion;
  let row = String(diff)+", "+
            String(emotions.Angry)+", "+
            String(emotions.Disgust)+", "+
            String(emotions.Fear)+", "+
            String(emotions.Happy)+", "+
            String(emotions.Neutral)+", "+
            String(emotions.Sad)+", "+
            String(emotions.Surprise)+", "+
            emo;
  rows.push(row);
});


tar_vid.addEventListener('ended',end_monitoring,false);

function end_monitoring(e) {
  stopMorphcast();
  // video has ended now save all received data
  let csvContent = "data:text/csv;charset=utf-8,";
  for(let i = 0 ; i < rows.length;i++){
    csvContent += rows[i] + "\r\n";
  }
  var encodedUri = encodeURI(csvContent);
  // window.open(encodedUri);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "video_data.csv");
  document.body.appendChild(link); // Required for FF
  link.click(); // This will download the data file named "video_data.csv".

}

// const canvas = document.createElement('canvas');
// document.body.appendChild(canvas);

// window.addEventListener(CY.modules().CAMERA.eventName, (event) => {
//   console.log('New frame in input');
//   const ctx = canvas.getContext('2d');
//   const imageData = event.detail;
//   ctx.canvas.width = imageData.width;
//   ctx.canvas.height = imageData.height;
//   ctx.putImageData(imageData, 0, 0);
// });