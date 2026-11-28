
import confounderData from './confounder.json';

export interface DatasetObservation {
  school_id: string;
  digital_devices: number;
  math_performance: number;
  social_index: number;
  school_size: number;
  teacher_experience: number;
  school_type: string;
  social_group: string;
  devices_residual: number;
  math_residual: number;
}

export interface InvestigationDataset {
  id: string;
  title: string;
  observations: DatasetObservation[];
}

export const datasets: InvestigationDataset[] = [
  {
    id: "confounder-dataset",
    title: "Digitale Ausstattung und Mathematikleistung",
    observations: confounderData as DatasetObservation[],
  },
];
