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
  const cvRGBImage = cv.imread(RGBref.current);
  const cvNiRImage = cv.imread(NiRref.current);

  let orb = new cv.ORB();

  let RGBKeypoints = new cv.KeyPointVector();
  let NiRKeypoints = new cv.KeyPointVector();

  orb.detectAndCompute(cvRGBImage, new cv.Mat(), RGBKeypoints);
  orb.detectAndCompute(cvNiRImage, new cv.Mat(), NiRKeypoints);

  console.log(`Detected ${RGBKeypoints.size()} keypoints on RGB Image`);
  console.log(`Detected ${NiRKeypoints.size()} keypoints on NiR Image`);

  cvRGBImage.delete();
  RGBKeypoints.delete();
  cvNiRImage.delete();
  NiRKeypoints.delete();
  orb.delete();
};
