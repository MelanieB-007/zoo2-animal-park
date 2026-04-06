// 1. Definition der Struktur
interface HabitatColor {
  main: string;
  light?: string; // Optionaler Key für Hover-Effekte
}

// 2. Das typisierte Objekt
export const habitatColors: Record<string, HabitatColor> = {
  gras: { main: "#47610d", light: "#6b8e23" },
  steppe: { main: "#924722", light: "#b35a2d" },
  wald: { main: "#224c0b", light: "#3a7a14" },
  berg: { main: "#39525e", light: "#567a8c" },
  savanne: { main: "#c66f12", light: "#e88a2a" },
  dschungel: { main: "#4c7c07", light: "#76a312" },
  eis: { main: "#066eb8", light: "#2a9df4" },
  wasser: { main: "#4634c1", light: "#7261e6" },
  blattdickicht: { main: "#779d59", light: "#a8d384" },
  felsenwüste: { main: "#dcbc5d", light: "#ebcf7d" },
  süsswasser: { main: "#71fef8", light: "#a5fefb" },
  salzwasser: { main: "#603bde", light: "#8b6ef2" },
  noctarium: { main: "#a540a2", light: "#c96ec6" },
  default: { main: "#666666", light: "#999999" },
};
