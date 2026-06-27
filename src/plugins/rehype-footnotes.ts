import type { Element, ElementContent, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

interface Options {
  label?: string;
}

const backArrowSvg: Element = {
  type: "element",
  tagName: "svg",
  properties: {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 256 256",
    fill: "currentColor",
    width: "0.75em",
    height: "0.75em",
    ariaHidden: "true",
    style: "display:inline;vertical-align:middle;",
  },
  children: [
    {
      type: "element",
      tagName: "path",
      properties: {
        d: "M232,200a8,8,0,0,1-16,0,88.1,88.1,0,0,0-88-88H51.31l34.35,34.34a8,8,0,0,1-11.32,11.32l-48-48a8,8,0,0,1,0-11.32l48-48A8,8,0,0,1,85.66,61.66L51.31,96H128A104.11,104.11,0,0,1,232,200Z",
      },
      children: [],
    },
  ],
};

const replaceArrowWithSvg = (children: ElementContent[]): ElementContent[] =>
  children.flatMap((child) => {
    if (child.type === "text" && child.value.includes("\u21a9")) {
      const parts = child.value.split("\u21a9");
      const result: ElementContent[] = [];
      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) {
          result.push({ type: "text", value: parts[i] });
        }
        if (i < parts.length - 1) {
          result.push({ ...backArrowSvg });
        }
      }
      return result;
    }
    return [child];
  });

const rehypeFootnotes: Plugin<[Options?], Root> = (opts = {}) => {
  const label = opts.label ?? "Fußnoten";

  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "h2" && node.properties?.id === "footnote-label") {
        node.children = [{ type: "text", value: label }];
      }

      if (
        node.tagName === "a" &&
        node.properties?.dataFootnoteBackref !== undefined
      ) {
        node.children = replaceArrowWithSvg(node.children);
      }
    });
  };
};

export default rehypeFootnotes;
