const controls = window;
const mpPose = window;
// const drawingUtils = window;

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const controlsElement = document.getElementsByClassName('control-panel')[0];

// const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
// const grid = new LandmarkGrid(landmarkContainer);

function onResults(results) {
  // if (!results.poseLandmarks) {
  //   grid.updateLandmarks([]);
  //   return;
  // }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                 {color: '#00FF00', lineWidth: 4});
  drawLandmarks(canvasCtx, results.poseLandmarks,
                {color: '#FF0000', lineWidth: 2});
  canvasCtx.restore();
  // console.log(results.poseLandmarks)
  // grid.updateLandmarks(results.poseWorldLandmarks);
}

const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  // return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.4.1624666670/${file}`;
}});
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({image: videoElement});
  },
  width: 640,
  height: 360
});
camera.start();

// Present a control panel through which the user can manipulate the solution
// options.
// new controls
//     .ControlPanel(controlsElement, {
//       selfieMode: true,
//       modelComplexity: 1,
//       smoothLandmarks: true,
//       minDetectionConfidence: 0.5,
//       minTrackingConfidence: 0.5
//     })
//     .add([
//       new controls.StaticText({title: 'MediaPipe Pose'}),
//       new controls.Toggle({title: 'Selfie Mode', field: 'selfieMode'}),
//       new controls.SourcePicker({
//         onSourceChanged: () => {
//           // Resets because this model gives better results when reset between
//           // source changes.
//           pose.reset();
//         },
//         onFrame:
//             async (input: controls.InputImage, size: controls.Rectangle) => {
//               const aspect = size.height / size.width;
//               let width: number, height: number;
//               if (window.innerWidth > window.innerHeight) {
//                 height = window.innerHeight;
//                 width = height / aspect;
//               } else {
//                 width = window.innerWidth;
//                 height = width * aspect;
//               }
//               canvasElement.width = width;
//               canvasElement.height = height;
//               await pose.send({image: input});
//             },
//       }),
//       new controls.Slider({
//         title: 'Model Complexity',
//         field: 'modelComplexity',
//         discrete: ['Lite', 'Full', 'Heavy'],
//       }),
//       new controls.Toggle(
//           {title: 'Smooth Landmarks', field: 'smoothLandmarks'}),
//     ])
//     .on(x => {
//       const options = x as mpPose.Options;
//       videoElement.classList.toggle('selfie', options.selfieMode);
//       pose.setOptions(options);
//     });
