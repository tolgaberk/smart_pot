import RTCSocket from "./RTCSocket";
const URL = "https://smartpot.online";
export function main() {
  function logger(txt: string) {
    console.log(txt);
  }
  const video = createVideoElement();

  new RTCSocket(video, URL, logger);
}

function createVideoElement() {
  const video = document.createElement("video");
  video.style.height = "500px";
  video.style.width = "500px";
  video.setAttribute("autoplay", "true");
  video.setAttribute("muted", "true");
  video.style.backgroundColor = "black";
  document.body.appendChild(video);
  return video;
}
