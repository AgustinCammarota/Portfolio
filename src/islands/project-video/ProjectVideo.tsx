import { type Component, createSignal, type JSX } from 'solid-js';
import './project-video.css';

interface Props {
  video: string;
  children: JSX.Element;
}

const ProjectVideo: Component<Props> = (props: Props) => {
  const [isPlaying, setIsPlaying] = createSignal(false);
  let video!: HTMLVideoElement;

  const handlerPlayVideo = async(event: Event) => {
    event.stopPropagation();
    if (isPlaying()) {
      pauseVideo();
    } else {
      await startVideo();
    }
  }

  const pauseVideo = () => {
    setIsPlaying(false);
    video.currentTime = 0;
    video.style.position = 'unset';
    video.style.maxHeight = '180px';
    video.pause();
  }

  const startVideo = async() => {
    setIsPlaying(true);
    video.style.position = 'absolute';
    video.style.maxHeight = '100%';
    await video.play();
  }

  const mouseOver = async(event: Event) => {
    event.stopPropagation();
    if (window.innerWidth >= 1024) {
      await startVideo();
    }
  }

  const mouseOut = (event: Event) => {
    event.stopPropagation();
    if (window.innerWidth >= 1024) {
      pauseVideo();
    }
  }

  return (
      <div class="card-video">
        <video
            class="video"
            preload="auto"
            onClick={handlerPlayVideo}
            onMouseOut={mouseOut}
            onEnded={pauseVideo}
            ref={(el) => video = el}
            playsinline
            muted>
          <source src={props.video} type="video/webm"/>
          {props.children}
        </video>

        <div class="image-container"
             style={{opacity: !isPlaying() ? '1' : '0'}}>
          {props.children}
        </div>

        <button
            onClick={handlerPlayVideo}
            onMouseOver={mouseOver}
            style={{opacity: !isPlaying() ? '0.5' : '0'}}
            class="card-video__button"
            type="button">
        </button>
      </div>
  )
}

export {
  ProjectVideo
}

