import { render, fireEvent, screen, cleanup } from "@solidjs/testing-library";
import { ThemeManager } from "./ThemeManager";

describe("ThemeManager Component", () => {
  let prefersDarkScheme = false;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "";
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: prefersDarkScheme
        ? query === "(prefers-color-scheme: dark)"
        : query === "(prefers-color-scheme: light)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("should renders with the default theme from props", () => {
    prefersDarkScheme = false;
    window.matchMedia("(prefers-color-scheme: light)");
    render(() => <ThemeManager ariaLabel="Toggle theme" />);
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("should applies dark theme when defaultTheme is set to dark", () => {
    prefersDarkScheme = true;
    window.matchMedia("(prefers-color-scheme: dark)");
    render(() => <ThemeManager ariaLabel="Toggle theme" />);
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("should saves the theme to localStorage and applies it on initial render", () => {
    localStorage.setItem("theme", "dark");
    render(() => <ThemeManager ariaLabel="Toggle theme" />);
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("should toggles theme from light to dark on button click", () => {
    prefersDarkScheme = false;
    window.matchMedia("(prefers-color-scheme: light)");
    render(() => <ThemeManager ariaLabel="Toggle theme" />);
    const button = screen.getByRole("button", { name: /toggle theme/i });

    fireEvent.click(button);

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("should toggles theme from dark to light on button click", () => {
    prefersDarkScheme = true;
    window.matchMedia("(prefers-color-scheme: dark)");
    render(() => <ThemeManager ariaLabel="Toggle theme" />);
    const button = screen.getByRole("button", { name: /toggle theme/i });

    fireEvent.click(button);

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("should displays the correct icon for the current theme", () => {
    prefersDarkScheme = false;
    window.matchMedia("(prefers-color-scheme: light)");
    const iconLight = <span data-testid="icon-light">🌞</span>;
    const iconDark = <span data-testid="icon-dark">🌜</span>;

    render(() => (
      <ThemeManager
        ariaLabel="Toggle theme"
        iconLight={iconLight}
        iconDark={iconDark}
      />
    ));

    expect(screen.getByTestId("icon-light")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-dark")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /toggle theme/i }));

    expect(screen.getByTestId("icon-dark")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-light")).not.toBeInTheDocument();
  });
});
