import { type Component, createSignal } from 'solid-js';
import './project-video.css';

interface Props {
  video: string;
  image: string;
  altImage: string;
}

const ProjectVideo: Component<Props> = (props: Props) => {
  const [isPlaying, setIsPlaying] = createSignal(false);
  let video: HTMLVideoElement | null;

  const handlerPlayVideo = async(event: Event) => {
    event.stopPropagation();
    if (isPlaying()) {
      pauseVideo();
    } else {
      await startVideo();
    }
  }

  const pauseVideo = () => {
    if (!video) return;
    setIsPlaying(false);
    video.currentTime = 0;
    video.style.position = 'unset';
    video.style.maxHeight = '160px';
    video.pause();
  }

  const startVideo = async() => {
    if (!video) return;
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
            onClick={handlerPlayVideo}
            onMouseOut={mouseOut}
            onEnded={pauseVideo}
            ref={(el) => (video = el!)}
            poster={props.image}
            preload="auto"
            muted>
          <source src={props.video} type="video/webm"/>
          <img src={props.image} alt={props.altImage} loading="lazy"/>
        </video>
        <button
            onClick={handlerPlayVideo}
            onMouseOver={mouseOver}
            style={{ opacity: !isPlaying() ? '0.4' : '0' }}
            class="card-video__button"
            type="button">
        </button>
      </div>
  )
}

export {
  ProjectVideo
}

