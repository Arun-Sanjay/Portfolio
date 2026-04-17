export interface ChapterRange {
  start: number;
  end: number;
}

export interface Chapter {
  id: string;
  label: string;
  number: string;
  range: ChapterRange;
}
