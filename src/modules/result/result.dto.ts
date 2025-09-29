import { t } from "elysia";

export const ResultParamsDto = t.Object({
  assignmentId: t.String(),
  candidateId: t.String(),
});

export const PercentsDto = t.Object({
  a: t.Number(),
  b: t.Number(),
  c: t.Number(),
  d: t.Number(),
  e: t.Number(),
  f: t.Number(),
  g: t.Number(),
  h: t.Number(),
  i: t.Number(),
  j: t.Number(),
});

export const ScoreDto = t.Object({
  a: t.Number(),
  b: t.Number(),
  c: t.Number(),
  d: t.Number(),
  e: t.Number(),
  f: t.Number(),
  g: t.Number(),
  h: t.Number(),
  i: t.Number(),
  j: t.Number(),
});

export const CanceledDto = t.Object({
  e: t.Optional(t.Number()),
});

export const ResultResponseDto = t.Object({
  language: t.String(),
  fullName: t.String(),
  age: t.Number(),
  gender: t.String(),
  percents: PercentsDto,
  score: ScoreDto,
  canceled: CanceledDto,
  doubt: t.Number(),
  sendDate: t.String(),
  testType: t.String(),
});
