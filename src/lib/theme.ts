// TODO: define a theme
interface Theme {
  spacing: (factor: number) => number;
}
export const theme = {
  spacing: (factor: number): number => factor * 8,
};

export default Theme;
