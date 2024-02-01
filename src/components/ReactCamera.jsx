import Webcam from "react-webcam";
import "../App.css";
import { IoCameraReverseOutline } from "react-icons/io5";
import { useCallback, useRef, useState } from "react";

//HOX! Works only with HTTPS connection -> 'HTTPS=true npm start'
//Works with chrome, problems with firefox on mobile

export default function ReactCamera() {

    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [mirrored, setMirrored] = useState(false);
  
    const capture = useCallback(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    }, [webcamRef]);

    const retakeImage = () => {
        setImgSrc(null);
      };

  return (
    <div className="camera-container">
    {imgSrc ? (
      <img src={imgSrc} alt="webcam" />
    ) : (
      <Webcam
      height={'auto'}
      width={"100%"}
      ref={webcamRef}
      screenshotQuality={1}
      mirrored={mirrored}
      videoConstraints={{
        facingMode: mirrored ? 'user' : 'environment',
      }}
      screenshotFormat="image/jpeg"/>
    )}
    <div className="camera-controls">
        <IoCameraReverseOutline onClick={() => setMirrored(!mirrored)} size={30}/>
      </div>
    <div className="btn-container">
      {imgSrc ? (
        <button onClick={retakeImage}>Ota uusi kuva</button>
      ) : (
        <button onClick={capture}>Ota kuva</button>
      )}
    </div>
  </div>
  )
}
