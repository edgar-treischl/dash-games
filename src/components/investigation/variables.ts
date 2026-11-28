export type VariableId =
  | "digital_devices"
  | "math_performance"
  | "social_index"
  | "school_size"
  | "teacher_experience";

export const variableLabels: Record<VariableId, string> = {
  digital_devices: "Digitale Ausstattung",
  math_performance: "Mathematikleistung",
  social_index: "Sozialindex",
  school_size: "Schulgröße",
  teacher_experience: "Lehrerfahrung",
};

export const variableUnits: Record<VariableId, string> = {
  digital_devices: "Geräte pro 100 Schüler",
  math_performance: "Punkte",
  social_index: "Indexpunkte",
  school_size: "Schüler",
  teacher_experience: "Jahre",
};

export const variables = Object.keys(variableLabels) as VariableId[];
