import { useState } from "react";

function Trailer() {
  const [trailers] = useState([
    {
      id: "Inside Out 2",
      title: "Inside Out 2",
      source: "https://www.youtube.com/watch?v=VWavstJydZU&ab_channel=Pixar",
    },
    {
      id: "Dune",
      title: "Dune",
      source:
        "https://www.youtube.com/watch?v=ahL5yAOXjzU&ab_channel=%E8%8F%AF%E7%B4%8D%E5%85%84%E5%BC%9F%E5%8F%B0%E7%81%A3",
    },
  ]);

  return trailers;
}

export default Trailer;
