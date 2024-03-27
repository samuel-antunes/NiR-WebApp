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
  const maskRef = useRef(null);

  const [NiRimg, setNiRimg] = useState(null);
  const [RGBimg, setRGBimg] = useState(null);
  const [resultImg, setResultImg] = useState(null);
  const [color, setColor] = useState("#000000");

  const [masks, setMasks] = useState([]);
  const [currentMask, setCurrentMask] = useState(-1);
  const [maskZ, setMaskZ] = useState("2");

  const combineColors = () => {
    // console.log(RGBimg);
    // return;
    if (NiRimg == null || RGBimg == null) return;

    const rgbCanvas = document.getElementById("rgb-canvas");
    const nirCanvas = document.getElementById("nir-canvas");
    const resultCanvas = document.getElementById("result-canvas");

    resultCanvas.width = rgbCanvas.width;
    resultCanvas.height = rgbCanvas.height;

    const rgbCtx = rgbCanvas.getContext("2d", { willReadFrequently: true });
    const nirCtx = nirCanvas.getContext("2d", { willReadFrequently: true });
    const resultCtx = resultCanvas.getContext("2d", {
      willReadFrequently: true,
    });

    resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

    const hexColor = color.replace("/^#/", "");

    let rFactor = parseInt(hexColor.slice(1, 3), 16) / 255;
    let gFactor = parseInt(hexColor.slice(3, 5), 16) / 255;
    let bFactor = parseInt(hexColor.slice(5, 7), 16) / 255;

    // console.log(rFactor, gFactor, bFactor);

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

    let maskData = null;
    if (currentMask > -1) {
      const maskCanvas = document.getElementById("mask-canvas");
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      maskData = maskCtx.getImageData(
        0,
        0,
        maskCanvas.width,
        maskCanvas.height
      );
    }

    for (let i = 0; i < rgbData.data.length; i += 4) {
      const nirIntensity = nirData.data[i];
      // console.log(nirIntensity);
      const r = rgbData.data[i];
      const g = rgbData.data[i + 1];
      const b = rgbData.data[i + 2];

      if (currentMask > -1) {
        if (maskData.data[i + 3] == 0) {
          resultData.data[i] = r * (1 - rFactor) + nirIntensity * rFactor;
          resultData.data[i + 1] = g * (1 - gFactor) + nirIntensity * gFactor;
          resultData.data[i + 2] = b * (1 - bFactor) + nirIntensity * bFactor;
          resultData.data[i + 3] = 255;
        } else {
          resultData.data[i] = r;
          resultData.data[i + 1] = g;
          resultData.data[i + 2] = b;
          resultData.data[i + 3] = 255;
        }
      } else {
        resultData.data[i] = r * (1 - rFactor) + nirIntensity * rFactor;
        resultData.data[i + 1] = g * (1 - gFactor) + nirIntensity * gFactor;
        resultData.data[i + 2] = b * (1 - bFactor) + nirIntensity * bFactor;
        resultData.data[i + 3] = 255;
      }
    }

    resultCtx.putImageData(resultData, 0, 0);
  };

  const initDrawing = () => {
    const maskCanvas = document.getElementById("mask-canvas");
    if (!maskCanvas) return;

    const ctx = maskCanvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.globalCompositeOperation = "destination-out";
    let drawing = false;

    const startDrawing = (e) => {
      drawing = true;
      draw(e);
    };

    const endDrawing = () => {
      drawing = false;
      ctx.beginPath();
    };

    const draw = (e) => {
      if (!drawing) return;
      ctx.lineWidth = 200;
      ctx.lineCap = "round";

      var rect = maskCanvas.getBoundingClientRect();
      var scaleX = maskCanvas.width / rect.width;
      var scaleY = maskCanvas.height / rect.height;

      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    maskCanvas.addEventListener("mousedown", startDrawing);
    maskCanvas.addEventListener("mouseup", endDrawing);
    maskCanvas.addEventListener("mousemove", draw);
    maskCanvas.addEventListener("mouseout", endDrawing);
  };

  const addMask = () => {
    setCurrentMask(currentMask + 1);
    setMasks([...masks, null]);
  };

  useEffect(() => {
    combineColors();
  }, [color]);

  useEffect(() => {
    const onOpenCVReady = () => {
      console.log("OpenCV.js is ready.");
      setOpencvReady(true);
    };

    checkOpenCVReady(onOpenCVReady);
  }, []);

  useEffect(() => {
    if (currentMask == 0) {
      if (!maskRef.current) return;
      const drawingCanvas = maskRef.current;

      const drawingCtx = drawingCanvas.getContext("2d");
      drawingCtx.fillStyle = "rgba(115, 115, 115, 0.8)";
      drawingCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    }

    initDrawing();
  }, [currentMask]);

  const toggleMask = () => {
    const maskCanvas = document.getElementById("mask-canvas");
    if (maskZ === "2") {
      maskCanvas.style.zIndex = "0";
      setMaskZ("0");
    } else {
      maskCanvas.style.zIndex = "2";
      setMaskZ("2");
    }
  };

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
          <div className="container-input">
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
          <div className="container-output">
            {currentMask != -1 ? (
              <canvas
                id="mask-canvas"
                className="mask-canvas"
                ref={maskRef}
                height={resultRef?.current.height}
                width={resultRef?.current.width}
              />
            ) : (
              <></>
            )}

            <canvas
              id="result-canvas"
              className="image-canvas"
              ref={resultRef}
            />

            <div className="color-picker">
              <button onClick={addMask}>Add mask</button>
              <button onClick={toggleMask}>
                Toggle mask {maskZ === "2" ? "off" : "on"}
              </button>
              <HexColorPicker color={color} onChange={setColor} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
