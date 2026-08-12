export interface Department {
  id: number;
  name: string;
  description?: string;
  teamCount: number;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  departmentId: number;
  departmentName: string;
}
