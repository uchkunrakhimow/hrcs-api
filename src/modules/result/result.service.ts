import { PrismaClient } from "../../generated/prisma";
import { AssignmentCandidateTestBO } from "../assignment-candidate-test/assignment-candidate-test.bo";
import { ResultBO, CandidateAnswerBO, AssignmentCandidateBO, AssignmentTestBO } from "./result.bo";

export class ResultService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async calculateResult(assignmentId: string, candidateId: string): Promise<ResultBO> {
    const assignment = await this.prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        assignmentCandidateId: candidateId,
      },
      include: {
        assignmentCandidate: true,
        assignmentTest: {
          include: {
            test: true,
          },
        },
        candidateAnswers: {
          include: {
            answer: true,
            question: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    const candidate = assignment.assignmentCandidate as AssignmentCandidateBO;
    const test = assignment.assignmentTest as AssignmentTestBO;
    const answers = assignment.candidateAnswers as CandidateAnswerBO[];
    const assignmentCandidateTest = assignment.assignmentTest?.test as AssignmentCandidateTestBO;

    const percents = this.calculatePercents(answers);
    const score = this.calculateScore(percents);
    const canceled = this.calculateCanceled(answers);
    const doubt = this.calculateDoubt(answers);

    return {
      language: assignmentCandidateTest?.language!,
      fullName: candidate.fullname,
      age: candidate.age!,
      gender: candidate.gender!,
      percents,
      score,
      canceled,
      doubt,
      sendDate: test.sendDate?.toISOString() || new Date().toISOString(),
      testType: "persona",
    };
  }

  private calculatePercents(answers: CandidateAnswerBO[]): {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    g: number;
    h: number;
    i: number;
    j: number;
  } {
    const traitScores = {
      a: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      f: 0,
      g: 0,
      h: 0,
      i: 0,
      j: 0,
    };

    const scoringMatrix = this.getScoringMatrix();

    for (const answer of answers) {
      const questionNumber = parseInt(answer.questionId.split('-').pop() || '0');
      const answerType = this.getAnswerType(answer.answerId);

      if (scoringMatrix[questionNumber]) {
        const scores = scoringMatrix[questionNumber];
        const score = scores[answerType];

        if (score) {
          for (const trait in score) {
            if (trait in traitScores) {
              traitScores[trait as keyof typeof traitScores] += score[trait];
            }
          }
        }
      }
    }

    return this.normalizeScores(traitScores);
  }

  private calculateScore(percents: {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    g: number;
    h: number;
    i: number;
    j: number;
  }): {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    g: number;
    h: number;
    i: number;
    j: number;
  } {
    const score: any = {};

    for (const trait in percents) {
      const value = percents[trait as keyof typeof percents];
      score[trait] = Math.round(100 + value);
    }

    return score;
  }

  private calculateCanceled(answers: CandidateAnswerBO[]): { e?: number } {
    const canceled: { e?: number } = {};

    const eAnswers = answers.filter(answer => {
      const questionNumber = parseInt(answer.questionId.split('-').pop() || '0');
      return questionNumber === 22 || questionNumber === 197;
    });

    if (eAnswers.length > 0) {
      canceled.e = eAnswers.length;
    }

    return canceled;
  }

  private calculateDoubt(answers: CandidateAnswerBO[]): number {
    const middleAnswers = answers.filter(answer => {
      const answerType = this.getAnswerType(answer.answerId);
      return answerType === 'middle';
    });

    return Math.round((middleAnswers.length / answers.length) * 100);
  }

  private getAnswerType(answerId: string): 'minus' | 'middle' | 'plus' {
    if (answerId.includes('minus')) return 'minus';
    if (answerId.includes('middle')) return 'middle';
    if (answerId.includes('plus')) return 'plus';
    return 'middle';
  }

  private normalizeScores(scores: {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    g: number;
    h: number;
    i: number;
    j: number;
  }): {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    g: number;
    h: number;
    i: number;
    j: number;
  } {
    const normalized: any = {};

    for (const trait in scores) {
      const value = scores[trait as keyof typeof scores];
      normalized[trait] = Math.max(-100, Math.min(100, value));
    }

    return normalized;
  }

  private getScoringMatrix(): Record<number, Record<string, Record<string, number>>> {
    return {
      1: { minus: { a: 2 }, middle: { a: 4 }, plus: { a: 6 } },
      2: { minus: { c: 6 }, middle: { c: 5 }, plus: { c: 3 } },
      3: { minus: { e: 6 }, middle: { e: 4 }, plus: { e: 3 } },
      4: { minus: { g: 3 }, middle: { g: 4 }, plus: { g: 6 } },
      5: { minus: { i: 4 }, middle: { i: 4 }, plus: { i: 5 } },
      6: { minus: { c: 3 }, middle: { c: 3 }, plus: { c: 6 } },
      7: { minus: { e: 3 }, middle: { e: 4 }, plus: { e: 5 } },
      8: { minus: { a: 2 }, middle: { a: 4 }, plus: { a: 5 } },
      9: { minus: { i: 3 }, middle: { i: 4 }, plus: { i: 4 } },
      10: { minus: { g: 5 }, middle: { g: 4 }, plus: { g: 4 } },
      11: { minus: { c: 3 }, middle: { c: 4 }, plus: { c: 5 } },
      12: { minus: { e: 2 }, middle: { e: 4 }, plus: { e: 6 } },
      13: { minus: { g: 5 }, middle: { g: 4 }, plus: { g: 3 } },
      14: { minus: { i: 2 }, middle: { i: 4 }, plus: { i: 5 } },
      15: { minus: { a: 3 }, middle: { a: 3 }, plus: { a: 6 } },
      16: { minus: { e: 3 }, middle: { e: 4 }, plus: { e: 4 } },
      17: { minus: { a: 2 }, middle: { a: 4 }, plus: { a: 5 } },
      18: { minus: { c: 2 }, middle: { c: 6 }, plus: { c: 6 } },
      19: { minus: { i: 5 }, middle: { i: 3 }, plus: { i: 3 } },
      20: { minus: { g: 5 }, middle: { g: 5 }, plus: { g: 3 } },
      21: { minus: { b: 2 }, middle: { b: 3 }, plus: { b: 6 } },
      22: { minus: { e: 0 }, middle: { e: 1 }, plus: { e: 5 } },
      23: { minus: { f: 5 }, middle: { f: 4 }, plus: { f: 3 } },
      24: { minus: { h: 3 }, middle: { h: 5 }, plus: { h: 6 } },
      25: { minus: { j: 3 }, middle: { j: 1 }, plus: { j: 5 } },
      26: { minus: { d: 2 }, middle: { d: 3 }, plus: { d: 6 } },
      27: { minus: { b: 5 }, middle: { b: 4 }, plus: { b: 4 } },
      28: { minus: { j: 6 }, middle: { j: 2 }, plus: { j: 2 } },
      29: { minus: { f: 6 }, middle: { f: 3 }, plus: { f: 3 } },
      30: { minus: { h: 3 }, middle: { h: 4 }, plus: { h: 6 } },
      31: { minus: { f: 5 }, middle: { f: 4 }, plus: { f: 4 } },
      32: { minus: { d: 2 }, middle: { d: 4 }, plus: { d: 6 } },
      33: { minus: { b: 6 }, middle: { b: 5 }, plus: { b: 3 } },
      34: { minus: { j: 6 }, middle: { j: 3 }, plus: { j: 3 } },
      35: { minus: { h: 5 }, middle: { h: 5 }, plus: { h: 2 } },
      36: { minus: { b: 3 }, middle: { b: 5 }, plus: { b: 6 } },
      37: { minus: { h: 3 }, middle: { h: 4 }, plus: { h: 6 } },
      38: { minus: { f: 4 }, middle: { f: 4 }, plus: { f: 5 } },
      39: { minus: { j: 3 }, middle: { j: 4 }, plus: { j: 5 } },
      40: { minus: { d: 2 }, middle: { d: 3 }, plus: { d: 5 } },
      41: { minus: { e: 6 }, middle: { e: 4 }, plus: { e: 4 } },
      42: { minus: { a: 5 }, middle: { a: 3 }, plus: { a: 3 } },
      43: { minus: { c: 4 }, middle: { c: 4 }, plus: { c: 5 } },
      44: { minus: { i: 2 }, middle: { i: 3 }, plus: { i: 6 } },
      45: { minus: { g: 3 }, middle: { g: 4 }, plus: { g: 5 } },
      46: { minus: { a: 3 }, middle: { a: 3 }, plus: { a: 5 } },
      47: { minus: { c: 2 }, middle: { c: 5 }, plus: { c: 6 } },
      48: { minus: { e: 3 }, middle: { e: 4 }, plus: { e: 5 } },
      49: { minus: { g: 6 }, middle: { g: 4 }, plus: { g: 4 } },
      50: { minus: { i: 4 }, middle: { i: 4 }, plus: { i: 3 } },
      51: { minus: { e: 5 }, middle: { e: 4 }, plus: { e: 2 } },
      52: { minus: { a: 3 }, middle: { a: 4 }, plus: { a: 4 } },
      53: { minus: { c: 3 }, middle: { c: 4 }, plus: { c: 6 } },
      54: { minus: { i: 6 }, middle: { i: 3 }, plus: { i: 3 } },
      55: { minus: { g: 2 }, middle: { g: 5 }, plus: { g: 6 } },
      56: { minus: { c: 5 }, middle: { c: 3 }, plus: { c: 3 } },
      57: { minus: { e: 5 }, middle: { e: 4 }, plus: { e: 4 } },
      58: { minus: { a: 6 }, middle: { a: 3 }, plus: { a: 3 } },
      59: { minus: { i: 1 }, middle: { i: 3 }, plus: { i: 5 } },
      60: { minus: { g: 2 }, middle: { g: 5 }, plus: { g: 6 } },
      61: { minus: { d: 2 }, middle: { d: 4 }, plus: { d: 6 } },
      62: { minus: { b: 5 }, middle: { b: 4 }, plus: { b: 4 } },
      63: { minus: { h: 5 }, middle: { h: 4 }, plus: { h: 4 } },
      64: { minus: { j: 2 }, middle: { j: 2 }, plus: { j: 6 } },
      65: { minus: { f: 4 }, middle: { f: 4 }, plus: { f: 5 } },
      66: { minus: { f: 6 }, middle: { f: 4 }, plus: { f: 3 } },
      67: { minus: { d: 2 }, middle: { d: 4 }, plus: { d: 5 } },
      68: { minus: { b: 6 }, middle: { b: 4 }, plus: { b: 3 } },
      69: { minus: { j: 6 }, middle: { j: 3 }, plus: { j: 3 } },
      70: { minus: { h: 4 }, middle: { h: 4 }, plus: { h: 5 } },
      71: { minus: { b: 3 }, middle: { b: 5 }, plus: { b: 6 } },
      72: { minus: { f: 3 }, middle: { f: 4 }, plus: { f: 4 } },
      73: { minus: { d: 2 }, middle: { d: 4 }, plus: { d: 5 } },
      74: { minus: { h: 2 }, middle: { h: 4 }, plus: { h: 6 } },
      75: { minus: { j: 5 }, middle: { j: 3 }, plus: { j: 3 } },
      76: { minus: { d: 1 }, middle: { d: 3 }, plus: { d: 6 } },
      77: { minus: { j: 6 }, middle: { j: 2 }, plus: { j: 2 } },
      78: { minus: { b: 2 }, middle: { b: 5 }, plus: { b: 6 } },
      79: { minus: { f: 5 }, middle: { f: 4 }, plus: { f: 3 } },
      80: { minus: { h: 6 }, middle: { h: 3 }, plus: { h: 3 } },
      81: { minus: { c: 6 }, middle: { c: 3 }, plus: { c: 3 } },
      82: { minus: { g: 3 }, middle: { g: 4 }, plus: { g: 6 } },
      83: { minus: { a: 3 }, middle: { a: 3 }, plus: { a: 6 } },
      84: { minus: { i: 6 }, middle: { i: 3 }, plus: { i: 2 } },
      85: { minus: { e: 6 }, middle: { e: 3 }, plus: { e: 3 } },
      86: { minus: { c: 2 }, middle: { c: 4 }, plus: { c: 6 } },
      87: { minus: { a: 3 }, middle: { a: 3 }, plus: { a: 5 } },
      88: { minus: { i: 5 }, middle: { i: 4 }, plus: { i: 3 } },
      89: { minus: { g: 2 }, middle: { g: 5 }, plus: { g: 6 } },
      90: { minus: { e: 3 }, middle: { e: 3 }, plus: { e: 5 } },
      91: { minus: { c: 3 }, middle: { c: 4 }, plus: { c: 6 } },
      92: { minus: { e: 3 }, middle: { e: 4 }, plus: { e: 4 } },
      93: { minus: { a: 5 }, middle: { a: 3 }, plus: { a: 3 } },
      94: { minus: { i: 5 }, middle: { i: 4 }, plus: { i: 4 } },
      95: { minus: { g: 3 }, middle: { g: 4 }, plus: { g: 5 } },
      96: { minus: { a: 6 }, middle: { a: 4 }, plus: { a: 2 } },
      97: { minus: { c: 5 }, middle: { c: 5 }, plus: { c: 3 } },
      98: { minus: { i: 4 }, middle: { i: 4 }, plus: { i: 5 } },
      99: { minus: { e: 2 }, middle: { e: 4 }, plus: { e: 5 } },
      100: { minus: { g: 4 }, middle: { g: 3 }, plus: { g: 1 } },
      101: { minus: { b: 5 }, middle: { b: 4 }, plus: { b: 4 } },
      102: { minus: { d: 2 }, middle: { d: 3 }, plus: { d: 5 } },
      103: { minus: { f: 4 }, middle: { f: 4 }, plus: { f: 6 } },
      104: { minus: { j: 2 }, middle: { j: 3 }, plus: { j: 6 } },
      105: { minus: { h: 6 }, middle: { h: 4 }, plus: { h: 3 } },
      106: { minus: { b: 2 }, middle: { b: 3 }, plus: { b: 7 } },
      107: { minus: { f: 2 }, middle: { f: 3 }, plus: { f: 6 } },
      108: { minus: { d: 3 }, middle: { d: 4 }, plus: { d: 5 } },
      109: { minus: { h: 3 }, middle: { h: 4 }, plus: { h: 5 } },
      110: { minus: { j: 5 }, middle: { j: 4 }, plus: { j: 4 } },
      111: { minus: { d: 2 }, middle: { d: 4 }, plus: { d: 5 } },
      112: { minus: { j: 6 }, middle: { j: 2 }, plus: { j: 2 } },
      113: { minus: { b: 6 }, middle: { b: 4 }, plus: { b: 3 } },
      114: { minus: { f: 6 }, middle: { f: 4 }, plus: { f: 3 } },
      115: { minus: { h: 3 }, middle: { h: 4 }, plus: { h: 6 } },
      116: { minus: { b: 6 }, middle: { b: 4 }, plus: { b: 3 } },
      117: { minus: { d: 3 }, middle: { d: 4 }, plus: { d: 5 } },
      118: { minus: { j: 7 }, middle: { j: 2 }, plus: { j: 2 } },
      119: { minus: { h: 5 }, middle: { h: 4 }, plus: { h: 3 } },
      120: { minus: { f: 5 }, middle: { f: 4 }, plus: { f: 3 } },
      121: { minus: { e: 4 }, middle: { e: 4 }, plus: { e: 5 } },
      122: { minus: { c: 3 }, middle: { c: 4 }, plus: { c: 6 } },
      123: { minus: { g: 5 }, middle: { g: 4 }, plus: { g: 3 } },
      124: { minus: { a: 2 }, middle: { a: 3 }, plus: { a: 6 } },
      125: { minus: { i: 1 }, middle: { i: 3 }, plus: { i: 4 } },
      126: { minus: { g: 4 }, middle: { g: 4 }, plus: { g: 6 } },
      127: { minus: { e: 5 }, middle: { e: 4 }, plus: { e: 4 } },
      128: { minus: { a: 3 }, middle: { a: 4 }, plus: { a: 6 } },
      129: { minus: { i: 2 }, middle: { i: 5 }, plus: { i: 6 } },
      130: { minus: { c: 3 }, middle: { c: 5 }, plus: { c: 6 } },
      131: { minus: { a: 5 }, middle: { a: 3 }, plus: { a: 2 } },
      132: { minus: { c: 2 }, middle: { c: 4 }, plus: { c: 6 } },
      133: { minus: { g: 6 }, middle: { g: 4 }, plus: { g: 3 } },
      134: { minus: { e: 4 }, middle: { e: 4 }, plus: { e: 3 } },
      135: { minus: { i: 2 }, middle: { i: 4 }, plus: { i: 5 } },
      136: { minus: { c: 3 }, middle: { c: 5 }, plus: { c: 5 } },
      137: { minus: { e: 3 }, middle: { e: 3 }, plus: { e: 6 } },
      138: { minus: { a: 5 }, middle: { a: 3 }, plus: { a: 3 } },
      139: { minus: { i: 5 }, middle: { i: 4 }, plus: { i: 4 } },
      140: { minus: { g: 2 }, middle: { g: 5 }, plus: { g: 6 } },
      141: { minus: { b: 2 }, middle: { b: 5 }, plus: { b: 6 } },
      142: { minus: { d: 1 }, middle: { d: 3 }, plus: { d: 5 } },
      143: { minus: { h: 2 }, middle: { h: 4 }, plus: { h: 6 } },
      144: { minus: { j: 5 }, middle: { j: 4 }, plus: { j: 3 } },
      145: { minus: { f: 5 }, middle: { f: 5 }, plus: { f: 3 } },
      146: { minus: { d: 1 }, middle: { d: 3 }, plus: { d: 5 } },
      147: { minus: { f: 6 }, middle: { f: 4 }, plus: { f: 4 } },
      148: { minus: { b: 3 }, middle: { b: 4 }, plus: { b: 6 } },
      149: { minus: { j: 3 }, middle: { j: 5 }, plus: { j: 5 } },
      150: { minus: { h: 2 }, middle: { h: 5 }, plus: { h: 6 } },
      151: { minus: { b: 2 }, middle: { b: 5 }, plus: { b: 6 } },
      152: { minus: { h: 6 }, middle: { h: 5 }, plus: { h: 3 } },
      153: { minus: { d: 2 }, middle: { d: 4 }, plus: { d: 6 } },
      154: { minus: { f: 3 }, middle: { f: 3 }, plus: { f: 5 } },
      155: { minus: { j: 7 }, middle: { j: 1 }, plus: { j: 1 } },
      156: { minus: { d: 6 }, middle: { d: 4 }, plus: { d: 2 } },
      157: { minus: { h: 7 }, middle: { h: 5 }, plus: { h: 2 } },
      158: { minus: { b: 5 }, middle: { b: 5 }, plus: { b: 3 } },
      159: { minus: { f: 5 }, middle: { f: 4 }, plus: { f: 2 } },
      160: { minus: { j: 2 }, middle: { j: 2 }, plus: { j: 6 } },
      161: { minus: { g: 2 }, middle: { g: 5 }, plus: { g: 6 } },
      162: { minus: { e: 6 }, middle: { e: 4 }, plus: { e: 3 } },
      163: { minus: { i: 5 }, middle: { i: 4 }, plus: { i: 4 } },
      164: { minus: { c: 5 }, middle: { c: 5 }, plus: { c: 2 } },
      165: { minus: { a: 6 }, middle: { a: 3 }, plus: { a: 3 } },
      166: { minus: { c: 3 }, middle: { c: 3 }, plus: { c: 6 } },
      167: { minus: { g: 6 }, middle: { g: 4 }, plus: { g: 2 } },
      168: { minus: { e: 6 }, middle: { e: 4 }, plus: { e: 3 } },
      169: { minus: { a: 2 }, middle: { a: 3 }, plus: { a: 6 } },
      170: { minus: { i: 3 }, middle: { i: 4 }, plus: { i: 5 } },
      171: { minus: { c: 3 }, middle: { c: 3 }, plus: { c: 6 } },
      172: { minus: { g: 3 }, middle: { g: 4 }, plus: { g: 6 } },
      173: { minus: { a: 6 }, middle: { a: 3 }, plus: { a: 2 } },
      174: { minus: { i: 5 }, middle: { i: 4 }, plus: { i: 3 } },
      175: { minus: { e: 0 }, middle: { e: 1 }, plus: { e: 5 } },
      176: { minus: { a: 2 }, middle: { a: 2 }, plus: { a: 6 } },
      177: { minus: { c: 6 }, middle: { c: 4 }, plus: { c: 4 } },
      178: { minus: { i: 5 }, middle: { i: 3 }, plus: { i: 3 } },
      179: { minus: { e: 0 }, middle: { e: 1 }, plus: { e: 5 } },
      180: { minus: { g: 3 }, middle: { g: 5 }, plus: { g: 6 } },
      181: { minus: { b: 3 }, middle: { b: 3 }, plus: { b: 6 } },
      182: { minus: { h: 3 }, middle: { h: 4 }, plus: { h: 6 } },
      183: { minus: { j: 2 }, middle: { j: 4 }, plus: { j: 6 } },
      184: { minus: { d: 3 }, middle: { d: 4 }, plus: { d: 6 } },
      185: { minus: { f: 6 }, middle: { f: 6 }, plus: { f: 3 } },
      186: { minus: { d: 1 }, middle: { d: 3 }, plus: { d: 5 } },
      187: { minus: { f: 3 }, middle: { f: 3 }, plus: { f: 5 } },
      188: { minus: { b: 2 }, middle: { b: 2 }, plus: { b: 6 } },
      189: { minus: { h: 3 }, middle: { h: 5 }, plus: { h: 5 } },
      190: { minus: { j: 6 }, middle: { j: 2 }, plus: { j: 2 } },
      191: { minus: { d: 1 }, middle: { d: 4 }, plus: { d: 5 } },
      192: { minus: { b: 2 }, middle: { b: 4 }, plus: { b: 6 } },
      193: { minus: { j: 5 }, middle: { j: 4 }, plus: { j: 3 } },
      194: { minus: { h: 4 }, middle: { h: 5 }, plus: { h: 6 } },
      195: { minus: { f: 6 }, middle: { f: 4 }, plus: { f: 2 } },
      196: { minus: { b: 2 }, middle: { b: 5 }, plus: { b: 6 } },
      197: { minus: { b: 2 }, middle: { b: 4 }, plus: { b: 5 } },
      198: { minus: { h: 2 }, middle: { h: 5 }, plus: { h: 6 } },
      199: { minus: { f: 0 }, middle: { f: 3 }, plus: { f: 5 } },
      200: { minus: { j: 5 }, middle: { j: 3 }, plus: { j: 3 } },
    };
  }
}
