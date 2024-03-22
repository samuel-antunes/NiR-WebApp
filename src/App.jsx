import "./App.css";
import ImageView from "./components/ImageView";
import { useEffect, useState, useRef } from "react";
import { checkOpenCVReady, ORBMatching } from "./utils/opencv";
import { HexColorPicker } from "react-colorful";

function App() {
  const [opencvReady, setOpencvReady] = useState(false);

  const NiRref = useRef(null);
  const RGBref = useRef(null);
  const resultRef = useRef(null);

  const [NiRimg, setNiRimg] = useState(null);
  const [RGBimg, setRGBimg] = useState(null);
  const [resultImg, setResultImg] = useState(null);
  const [color, setColor] = useState("#000000");

  const combineColors = () => {
    // console.log(RGBimg);
    if (NiRimg == null || RGBimg == null) return;

    const rgbCanvas = document.getElementById("rgb-canvas");
    const nirCanvas = document.getElementById("nir-canvas");
    const resultCanvas = document.getElementById("result-canvas");

    resultCanvas.width = rgbCanvas.width;
    resultCanvas.height = rgbCanvas.height;

    const rgbCtx = rgbCanvas.getContext("2d");
    const nirCtx = nirCanvas.getContext("2d");
    const resultCtx = resultCanvas.getContext("2d");

    resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

    const hexColor = color.replace("/^#/", "");

    let rFactor = parseInt(hexColor.slice(1, 3), 16) / 255;
    let gFactor = parseInt(hexColor.slice(3, 5), 16) / 255;
    let bFactor = parseInt(hexColor.slice(5, 7), 16) / 255;

    console.log(rFactor, gFactor, bFactor);

    const nirData = nirCtx.getImageData(
      0,
      0,
      nirCanvas.width,
      nirCanvas.height
    );
    const rgbData = rgbCtx.getImageData(
      0,
      0,
      rgbCanvas.width,
      rgbCanvas.height
    );
    const resultData = resultCtx.createImageData(
      resultCanvas.width,
      resultCanvas.height
    );

    console.log(nirData.data[100] == nirData.data[101]);
    console.log(nirData.data[101] == nirData.data[102]);

    console.log(nirData.data[102] == nirData.data[103]);

    for (let i = 0; i < rgbData.data.length; i += 4) {
      const nirIntensity = nirData.data[i];
      // console.log(nirIntensity);
      const r = rgbData.data[i];
      const g = rgbData.data[i + 1];
      const b = rgbData.data[i + 2];
      resultData.data[i] = r * (1 - rFactor) + nirIntensity * rFactor;
      resultData.data[i + 1] = g * (1 - gFactor) + nirIntensity * gFactor;
      resultData.data[i + 2] = b * (1 - bFactor) + nirIntensity * bFactor;
      resultData.data[i + 3] = 255;
    }

    resultCtx.putImageData(resultData, 0, 0);
  };

  useEffect(() => {
    console.log(color);
    combineColors();
  }, [color]);

  useEffect(() => {
    const onOpenCVReady = () => {
      console.log("OpenCV.js is ready.");
      setOpencvReady(true);
    };

    checkOpenCVReady(onOpenCVReady);
  }, []);

  // useEffect(() => {
  //   if (NiRimg && RGBimg) {
  //     ORBMatching(RGBref, NiRref);
  //   }
  // }, [RGBref.current, NiRref.current]);

  return (
    <div className="container">
      {!opencvReady ? (
        <div>Loading...</div>
      ) : (
        <div className="ui">
          <div className="container">
            <ImageView
              id="rgb"
              imageRef={RGBref}
              image={RGBimg}
              setImage={setRGBimg}
              parentID={"rgb"}
            />
            <ImageView
              id="nir"
              imageRef={NiRref}
              image={NiRimg}
              setImage={setNiRimg}
              parentID={"nir"}
            />
          </div>
          <div className="container">
            <canvas id="result-canvas"></canvas>
            <HexColorPicker color={color} onChange={setColor} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
