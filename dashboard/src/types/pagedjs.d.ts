declare module "pagedjs" {
  interface PreviewFlow {
    total: number;
  }

  export class Previewer {
    preview(
      content?: HTMLElement | DocumentFragment | string,
      stylesheets?: Array<string | Record<string, string>>,
      renderTo?: HTMLElement | string,
    ): Promise<PreviewFlow>;
  }
}
