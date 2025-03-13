/* eslint-disable prefer-spread */
/* eslint-disable no-plusplus */
class ContextVariableMenu {
  constructor(element, settings, $) {
    const _ = this;
    const { markup } = utils;

    _.defaults = {
      name: "DBCA-BWF-CONTEXT-VARIABLE-MENU",
      theme: "default",
    };

    const { input, component, onSelectValue, showInPopover } = settings;

    if (!input || !component) {
      return;
    }
    const { value, value_ref, json_value, data_type } = input;
    const { type, options, value_rules } = json_value || {};

    _.component = component;
    _.input = input;

    _.elementId = `context-menu-${component.id}-${input.key}${showInPopover ? "-popover" : ""}`;

    _.initials = {
      present: true,
      value: value,
      value_ref: value_ref,
      type: type,
      options: options,
      value_rules: value_rules,
      showInPopover: showInPopover === true,
      onSelectValue: onSelectValue ?? function (value) {},
    };

    $.extend(_, _.initials);
    _.$element = $(element);

    // Acts like a button
    if (_.initials.showInPopover) {
      _.$element.empty();
      _.renderInPopover();
    } else {
      _.$element.empty();
      _.setupMenu(_.$element);
    }
  }

  renderInPopover() {
    const _ = this;
    const { markup } = utils;
    const popoverContent = $(
      markup(
        "div",
        [
          {
            tag: "div",
            class: "context-menu",
            content: "",
          },
        ],
        { "data-name": null }
      )
    );

    // popoverContent.attr("id", `popover-content-${input.key}`);
    popoverContent.find(".context-menu").attr("id", _.elementId);

    popoverContent.find(".btn-close").on("click", _, function (event) {
      const selector = event.data;
      selector.popover.hide();
    });

    _.$element.empty();
    _.$element.append(
      markup(
        "span",
        [{ tag: "i", class: "bi bi-braces-asterisk me-2" }, "Variables"],
        { class: "btn btn-primary btn-sm menu-popover" }
      )
    );
    const popoverButton = _.$element.find(".menu-popover");

    const popoverOptions = {
      html: true,
      title: "",
      content: popoverContent,
      placement: "top",
    };
    _.popover = new bootstrap.Popover(popoverButton, popoverOptions);

    popoverButton.on("shown.bs.popover", _, function (event) {
      const _ = event.data;
      _.setupMenu($(`#${_.elementId}`));
    });

    popoverButton.on("show.bs.popover", _, function (event) {
      const selector = event.data;
      selector.onPopoverOpen();
    });
  }

  onPopoverOpen() {
    const _ = this;
  }

  rerenderMenu() {
    console.log("Rerendering menu");
  }

  setupMenu(container) {
    const _ = this;
    const { markup } = utils;

    const menuElements = markup("ul", [
      // inputs,
      {
        tag: "li",
        content: [
          markup("div", "Inputs"),
          markup(
            "ul",
            workflow_inputs.var.inputs.map((el) => ({
              tag: "li",
              content: el.label,
              class: "",
              "data-context": "inputs",
              "data-value": el.id,
              "data-key": el.key,
            }))
          ),
        ],
      },
      // variables
      {
        tag: "li",
        content: [
          markup("div", "Variables"),
          markup(
            "ul",
            workflow_variables.var.variables.map((el) => ({
              tag: "li",
              content: el.name,
              class: "",
              "data-context": "variables",
              "data-id": el.id,
              "data-key": el.key,
            }))
          ),
        ],
      },
      //outputs
    ]);

    // if (!input.value_ref) {
    //   menuElements.appendChild(
    //     markup("li", { tag: "div", content: "Editor" }, { class: "editor-btn" })
    //   );
    // }
    container.empty();
    container.append(menuElements.children);
    container.menu();
    container.show();
    container.find("li").on("click", _, function (event) {
      const selector = event.data;
      const $this = $(this);
      const id = $this.data("id");
      const key = $this.data("key");
      const context = $this.data("context");
      if (!key || !context) {
        return;
      }
      selector?.onSelectValue({ id, key, context });
      selector.popover?.hide();
    });
  }
}

jQuery.fn.contextMenu = function (...args) {
  const _ = this;
  const opt = args[0];
  const moreArgs = Array.prototype.slice.call(args, 1);
  const l = _.length;
  let i;
  let ret;

  for (i = 0; i < l; i++) {
    if (typeof opt === "object" || typeof opt === "undefined") {
      _[i].formb = new ContextVariableMenu(_[i], opt, jQuery);
    } else {
      ret = _[i].formb[opt].apply(_[i].formb, moreArgs, jQuery);
    }
    if (typeof ret !== "undefined") return ret;
  }
  return _;
};
