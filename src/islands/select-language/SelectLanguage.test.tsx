import { render, fireEvent, cleanup } from "@solidjs/testing-library";
import { languages, PATHS } from "@i18n/ui";
import { navigate } from "astro:transitions/client";
import { SelectLanguage } from "./SelectLanguage";

describe("SelectLanguage Component", () => {
  const defaultProps = {
    currentLang: "en" as "en" | "es",
    currentLink: "/home",
    datepickerLabel: "Select Language",
    iconLeft: <span>Icon Left</span>,
    iconRight: <span>Icon Right</span>,
  };
  let getByText: ReturnType<typeof render>["getByPlaceholderText"];
  let getByRole: ReturnType<typeof render>["getByRole"];

  beforeEach(() => {
    vi.clearAllMocks();
    const utils = render(() => <SelectLanguage {...defaultProps} />);
    getByText = utils.getByText;
    getByRole = utils.getByRole;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("should render correctly with default props", () => {
    expect(getByText("Select Language")).toBeInTheDocument();
    expect(getByRole("combobox")).toBeInTheDocument();
    expect(getByText("Icon Left")).toBeInTheDocument();
    expect(getByText("Icon Right")).toBeInTheDocument();
  });

  it("should display options for each language", () => {
    Object.keys(languages).forEach((lang) => {
      expect(
        getByRole("option", {
          name: languages[lang as keyof typeof languages],
        }),
      ).toBeInTheDocument();
    });
  });

  it("should call navigate with the correct path on language change", () => {
    const select = getByRole("combobox") as HTMLSelectElement;

    fireEvent.change(select, { target: { value: "es" } });
    expect(navigate).toHaveBeenCalledWith(PATHS["es"].concat("/home/"));
  });

  it("should open the select dropdown when clicking on the label", () => {
    const selectElement = getByRole("combobox") as HTMLSelectElement;
    selectElement.showPicker = vi.fn();

    const label = getByText("Select Language");
    fireEvent.click(label);
    expect(selectElement.showPicker).toHaveBeenCalled();
  });
});
