import Elysia, { t } from "elysia";
import { ResultService } from "./result.service";
import { PdfService } from "./pdf.service";
import { ResultParamsDto, ResultResponseDto } from "./result.dto";

export class ResultController {
  private resultService: ResultService;
  private PdfService: PdfService;

  constructor() {
    this.resultService = new ResultService();
    this.PdfService = new PdfService();
  }

  createRoutes() {
    return new Elysia({ prefix: "/result" })
      .get(
        "/:assignmentId/:candidateId",
        async ({ params, status, set }) => {
          try {
            const result = await this.resultService.calculateResult(
              params.assignmentId,
              params.candidateId
            );

            const pdfBuffer = await this.PdfService.generate(result);

            set.headers = {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `inline; filename="test-result-${params.candidateId}.pdf"`,
              'Content-Length': pdfBuffer.length.toString(),
            };

            return pdfBuffer;
          } catch (err) {
            return status(400, {
              message: err instanceof Error ? err.message : "Failed to generate PDF",
            });
          }
        },
        {
          params: ResultParamsDto,
          response: {
            200: t.Uint8Array(),
            400: t.Object({
              message: t.String(),
            }),
            500: t.Object({
              message: t.String(),
            }),
          },
        }
      )
  }
}