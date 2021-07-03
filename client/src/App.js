import React, { useState } from "react";
import { TextField, ColorPicker, AppProvider, Button } from "@shopify/polaris";
import "@shopify/polaris/dist/styles.css";
import { hsbToHex } from "@shopify/polaris";
import Image from "./Image";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [image, setImage] = useState("uploads/image.png");
  const [color, setColor] = useState({
    hue: 133,
    brightness: 60,
    saturation: 40,
    alpha: 0.7,
  });
  const handleChange = (e) => {
    setText(e);
  };
  const changeColor = (e) => {
    setColor(e);
  };

  const createImage = async ({ text, fill }) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_URL}`, {
        text,
        fill,
      });
      setImage(res.data.src);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = () => {
    if (text.length < 100 && text.length > 0 && color) {
      createImage({
        text: text,
        fill: hsbToHex(color),
      });
    }
  };

  return (
    <AppProvider>
      <div className="container">
        <TextField
          value={text}
          label="Your Quote"
          placeholder="your quote"
          onChange={handleChange}
        />

        <ColorPicker onChange={changeColor} color={color} allowAlpha />
        <Button onClick={handleClick}>Submit</Button>
        <Image image={image} />
      </div>
    </AppProvider>
  );
}

export default App;
