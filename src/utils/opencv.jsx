// import cv from opencv

export const checkOpenCVReady = (onOpenCVReady) => {
  if (window.cv && window.cv.getBuildInformation) {
    onOpenCVReady();
  } else {
    window.Module = {
      onRuntimeInitialized: onOpenCVReady,
    };
  }
};

export const ORBMatching = (RGBref, NiRref) => {
  // Reference: https://answers.opencv.org/question/215934/unable-to-get-keypoints-in-opencvjs-by-orb-detect-and-compute/
  // https://www.reddit.com/r/opencv/comments/cayxcw/question_eamples_for_feature_matching_using_orb/
  // https://stackoverflow.com/questions/76171930/opencv-js-image-alignment-using-rectangles
  // https://scottsuhy.com/2021/02/01/image-alignment-feature-based-in-opencv-js-javascript/
  const cvRGBImage = cv.imread(RGBref.current);
  const cvNiRImage = cv.imread(NiRref.current);

  let orb = new cv.ORB();

  let RGBKeypoints = new cv.KeyPointVector();
  let RGBDescriptors = new cv.Mat();

  let NiRKeypoints = new cv.KeyPointVector();
  let NiRDescriptors = new cv.Mat();

  orb.detectAndCompute(cvRGBImage, new cv.Mat(), RGBKeypoints, RGBDescriptors);
  orb.detectAndCompute(cvNiRImage, new cv.Mat(), NiRKeypoints, NiRDescriptors);

  console.log(`Detected ${RGBKeypoints.size()} keypoints on RGB Image`);
  console.log(`Detected ${NiRKeypoints.size()} keypoints on NiR Image`);

  // let bestMatches = new cv.DMatchVector();

  // let matches = matchKnnFlannBased(RGBDescriptors, NiRDescriptors, 2);

  // let counter = 0;
  // for (let i = 0; i < matches.size(); ++i) {
  //   let match = matches.get(i);
  //   let dMatch1 = match.get(0);
  //   let dMatch2 = match.get(1);
  //   if (dMatch1.distance <= dMatch2.distance * parseFloat(knnDistance_option)) {
  //     bestMatches.push_back(dMatch1);
  //     counter++;
  //   }
  // }
  // let imMatches = new cv.Mat();
  // let color = new cv.Scalar(0, 255, 0, 255);
  // cv.drawMatches(
  //   cvRGBImage,
  //   RGBKeypoints,
  //   cvNiRImage,
  //   NiRKeypoints,
  //   bestMatches,
  //   imMatches,
  //   color
  // );
  // cv.imshow("match-canvas", imMatches);

  //   const cvMatchedImage = new cv.Mat();
  //   cv.drawMatches(cvRGBImage, RGBKeypoints, cvNiRImage, NiRKeypoints);

  //   cv.imshow("match-canvas", cvMatchedImage);

  cvRGBImage.delete();
  RGBKeypoints.delete();
  RGBDescriptors.delete();
  cvNiRImage.delete();
  NiRKeypoints.delete();
  NiRDescriptors.delete();
  orb.delete();
};
