declare module "*.html" {
  const content: any;
  export default content;
}
declare module "*.css" {
  const content: any;
  export default content;
}
declare module WebComponents {
  export const ready: boolean;
  export const waitFor: (callback: () => Promise<any>) => void;
}
