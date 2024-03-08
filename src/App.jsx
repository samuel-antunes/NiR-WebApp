import "./App.css";
import ImageView from "./components/ImageView";
import { useEffect, useState, useRef } from "react";
import { checkOpenCVReady, ORBMatching } from "./utils/opencv";

function App() {
  const [opencvReady, setOpencvReady] = useState(false);

  const NiRref = useRef(null);
  const RGBref = useRef(null);

  const [NiRimg, setNiRimg] = useState(null);
  const [RGBimg, setRGBimg] = useState(null);

  useEffect(() => {
    const onOpenCVReady = () => {
      console.log("OpenCV.js is ready.");
      setOpencvReady(true);
    };

    checkOpenCVReady(onOpenCVReady);
  }, []);

  useEffect(() => {
    if (NiRimg && RGBimg) {
      ORBMatching(RGBref, NiRref);
    }
  }, [RGBref.current, NiRref.current]);

  return (
    <div className="container">
      {!opencvReady ? (
        <div>Loading...</div>
      ) : (
        <div className="container">
          <ImageView
            id="rgb"
            imageRef={RGBref}
            image={NiRimg}
            setImage={setNiRimg}
          />
          <ImageView
            id="nir"
            imageRef={NiRref}
            image={RGBimg}
            setImage={setRGBimg}
          />
        </div>
      )}
    </div>
  );
}

export default App;
