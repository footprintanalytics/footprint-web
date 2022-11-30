import Driver from "driver.js";
import "driver.js/dist/driver.min.css";
import "./newGuide.css";
import { trackStructEvent } from "metabase/lib/analytics";
import { isDefi360 } from "metabase/lib/project_info";

const guideInfo = {
  table: {
    title: "Select data for the chart.",
    description: "",
    position: "right",
    steps: 4,
    curStep: 1,
    element: ".Question-side #table-0-0",
    next: "filterField",
  },
  filterField: {
    title: "Filter data by the field you want.",
    description: "",
    position: "left",
    steps: 4,
    curStep: 2,
    element: ".filterSidebar #accordionList-item-1",
    next: "filterFieldValue",
  },
  filterFieldValue: {
    title: "Filter data by the field you want.",
    description: "",
    position: "left-center",
    steps: 4,
    curStep: 2,
    element: ".filterSidebar #token-field-option-0",
    next: "filterFieldValueConfirm",
  },
  filterFieldValueConfirm: {
    title: "Add filter",
    description: "",
    position: "top",
    steps: 4,
    curStep: 2,
    element: ".filterSidebar #sidebar-footer-button",
    next: "summary",
  },
  summary: {
    title: "Select the aggregate function to get the metrics you want.",
    description: "",
    position: "left",
    steps: 4,
    curStep: 3,
    element: ".summarizeSidebar #accordionList-item-0",
    next: "saveChart",
  },
  saveChart: {
    title: "Save the chart.",
    description: "",
    position: "left",
    steps: 4,
    curStep: 4,
    element: "#edit-bar-save",
  },
};

const driver = new Driver({
  className: "new-guide__scoped-class",
  allowClose: false,
  showButtons: false,
  onDeselected: e => {
    highLightElement = null;
  },
});

let highLightElement = null;

export function newGuideHighlight({ key, getNewGuideInfo, setNewGuideInfo }) {
  const info = guideInfo[key];
  if (!info) {
    return;
  }
  setNewGuideInfo(newGuideHandle(getNewGuideInfo, info.next, true));
  driver.highlight({
    element: info.element || "",
    popover: {
      className: "new-guide__popover-class",
      title: createTitleDiv(info),
      description: info.description || createProgressGraph(info),
      position: info.position || "",
    },
  });
  highLightElement = driver.getHighlightedElement();
  trackStructEvent(`new-guide highlight ${key}`);
}

const createTitleDiv = info => {
  return `<div class="index">${info.curStep}</div><div class="title">${info.title}</div>`;
};

const createProgressGraph = info => {
  const circle = new Array(info.steps)
    .fill("")
    .map((v, index) => {
      return index + 1 === info.curStep
        ? "<div class='current-step'></div>"
        : "<div class='step'></div>";
    })
    .join("");
  return `${circle}`;
};

export function closeNewGuide({ key }) {
  const info = guideInfo[key];
  if (!highLightElement) {
    return;
  }
  if (!info) {
    return;
  }
  driver.highlight({
    element: info.element || "",
  });
  driver.reset(true);
  highLightElement?.hidePopover();
  highLightElement = null;
}

export function canShowNewGuideStart(user) {
  return (
    user &&
    // eslint-disable-next-line no-prototype-builtins
    user.hasOwnProperty("hasCreateChart") &&
    !user.hasCreateChart &&
    !localStorage.getItem("show-new-guide-start", false) &&
    !isDefi360()
  );
}

export function setShowNewGuideDone(hasDone) {
  localStorage.setItem("show-new-guide-start", hasDone);
}

export function newGuideHandle(object, key, value) {
  if (object) {
    Object.keys(object).forEach(key => (object[key] = false));
    if (key) {
      object[key] = value;
    }
  }
  return object;
}
