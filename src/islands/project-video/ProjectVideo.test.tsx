import { render, fireEvent, waitFor, cleanup } from "@solidjs/testing-library";
import { ProjectVideo } from "./ProjectVideo";

describe("ProjectVideo Component", () => {
  const videoSrc = "mock-video.webm";
  const children = <div>Video Thumbnail</div>;
  let container: HTMLElement;
  let getByText: ReturnType<typeof render>["getByPlaceholderText"];
  let getByRole: ReturnType<typeof render>["getByRole"];

  beforeEach(() => {
    vi.clearAllMocks();
    const utils = render(() => (
      <ProjectVideo video={videoSrc}>{children}</ProjectVideo>
    ));
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(HTMLMediaElement.prototype, "pause", {
      configurable: true,
      value: vi.fn(),
    });
    container = utils.container;
    getByText = utils.getByText;
    getByRole = utils.getByRole;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("should render the component", () => {
    expect(getByText("Video Thumbnail")).toBeInTheDocument();
    expect(getByRole("button", { name: /Play/i })).toBeInTheDocument();
  });

  it("should pause video playback on click", async () => {
    const playButton = getByRole("button", { name: /Play/i });
    const videoElement = container.querySelector("video") as HTMLVideoElement;

    fireEvent.click(playButton);
    fireEvent.click(videoElement);

    await waitFor(() => {
      expect(videoElement.paused).toBe(true);
    });
  });

  it("should handle mouseOver and call play video if screen width >= 1024", () => {
    global.innerWidth = 1024;

    const playButton = getByRole("button", { name: /Play/i });
    const videoElement = container.querySelector("video") as HTMLVideoElement;
    const playSpy = vi
      .spyOn(videoElement, "play")
      .mockImplementation(() => Promise.resolve());

    fireEvent.mouseOver(playButton);

    expect(playSpy).toHaveBeenCalled();
    playSpy.mockRestore();
  });

  it("should handle mouseOut and call pause video if screen width >= 1024", () => {
    global.innerWidth = 1024;

    const videoElement = container.querySelector("video") as HTMLVideoElement;
    const pauseSpy = vi
      .spyOn(videoElement, "pause")
      .mockImplementation(() => {});

    fireEvent.mouseOut(videoElement);

    expect(pauseSpy).toHaveBeenCalled();
    pauseSpy.mockRestore();
  });

  it("should not handle mouseOut and call pause video if screen width <= 1024", () => {
    global.innerWidth = 800;

    const videoElement = container.querySelector("video") as HTMLVideoElement;
    const pauseSpy = vi
      .spyOn(videoElement, "pause")
      .mockImplementation(() => {});

    fireEvent.mouseOut(videoElement);

    expect(pauseSpy).not.toHaveBeenCalled();
    pauseSpy.mockRestore();
  });

  it("should not handle mouseOver and call play video if screen width <= 1024", () => {
    global.innerWidth = 800;

    const playButton = getByRole("button", { name: /Play/i });
    const videoElement = container.querySelector("video") as HTMLVideoElement;
    const playSpy = vi
      .spyOn(videoElement, "play")
      .mockImplementation(() => Promise.resolve());

    fireEvent.mouseOver(playButton);

    expect(playSpy).not.toHaveBeenCalled();
    playSpy.mockRestore();
  });
});
