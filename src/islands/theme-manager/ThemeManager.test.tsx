import { render, fireEvent, screen, cleanup } from "@solidjs/testing-library";
import { ThemeManager } from "./ThemeManager";

describe("ThemeManager Component", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("should renders with the default theme from props", () => {
    render(() => (
      <ThemeManager defaultTheme="light" ariaLabel="Toggle theme" />
    ));
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("should applies dark theme when defaultTheme is set to dark", () => {
    render(() => <ThemeManager defaultTheme="dark" ariaLabel="Toggle theme" />);
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("should saves the theme to localStorage and applies it on initial render", () => {
    localStorage.setItem("theme", "dark");
    render(() => (
      <ThemeManager defaultTheme="light" ariaLabel="Toggle theme" />
    ));
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("should toggles theme from light to dark on button click", () => {
    render(() => (
      <ThemeManager defaultTheme="light" ariaLabel="Toggle theme" />
    ));
    const button = screen.getByRole("button", { name: /toggle theme/i });

    fireEvent.click(button);

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("should toggles theme from dark to light on button click", () => {
    render(() => <ThemeManager defaultTheme="dark" ariaLabel="Toggle theme" />);
    const button = screen.getByRole("button", { name: /toggle theme/i });

    fireEvent.click(button);

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("should displays the correct icon for the current theme", () => {
    const iconLight = <span data-testid="icon-light">🌞</span>;
    const iconDark = <span data-testid="icon-dark">🌜</span>;

    render(() => (
      <ThemeManager
        defaultTheme="light"
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
