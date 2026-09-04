import { Image } from "@tiptap/extension-image";

export interface CustomImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, any>;
}

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: "100%",
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return {
            style: `width: ${attributes.width}; max-width: 100%; height: auto;`,
          };
        },
      },
      alignment: {
        default: "center",
        renderHTML: (attributes) => {
          const align = attributes.alignment || "center";
          return {
            "data-alignment": align,
            class: `img-${align}`,
          };
        },
      },
    };
  },
});
