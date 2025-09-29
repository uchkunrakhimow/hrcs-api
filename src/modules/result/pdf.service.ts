import { ResultBO } from './result.bo';

export class PdfService {
  async generate(result: ResultBO): Promise<Buffer> {
    const html = this.generateHtml(result);

    try {
      const puppeteer = await import('puppeteer');
      const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      });
      const page = await browser.newPage();

      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '15mm',
          right: '15mm',
          bottom: '15mm',
          left: '15mm',
        },
      });

      await browser.close();
      return Buffer.from(pdfBuffer);
    } catch (error) {
      throw new Error(`Failed to generate PDF: ${error}`);
    }
  }

  private generateHtml(result: ResultBO): string {
    const currentDate = new Date().toLocaleDateString('ru-RU');

    return `
  <!DOCTYPE html>
  <html lang="ru">
  <head>
    <meta charset="UTF-8">
    <title>Тест на личные качества Tool Test</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: "Noto Sans", sans-serif !important;
        margin: 0;
        padding: 0;
        color: #333;
        font-feature-settings: 'liga' 1, 'kern' 1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 10px;
        border-radius: 8px;
      }

      /* Header */
      .header h1 {
        width: 50%;
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 20px;
      }

      .header-info {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        background: #fff;
        padding: 16px 20px;
        border-radius: 10px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        margin-bottom: 20px;
      }

      .info-left {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 14px;
      }

      .info-row {
        display: flex;
        gap: 6px;
      }

      .label {
        color: #999;
        min-width: 60px;
      }

      .value {
        font-weight: 500;
      }

      .fullname {
        font-size: 14px;
        color: #444;
      }

      /* Content Layout */
      .content {
        display: flex;
        gap: 20px;
      }

      /* Traits Table */
      .traits-table {
        background: #ebf1fa;
        flex: 1;
        padding: 2px;
        border-radius: 12px;
      }

      .traits-table table {
        width: 100%;
        border-collapse: collapse;
      }

      .traits-table th, .traits-table td {
        padding: 10px 8px;
        font-size: 12px;
        vertical-align: middle;
      }

      .traits-table th {
        font-weight: bold;
        text-align: left;
      }

      /* Chart Section */
      .chart-section {
        flex: 1.2;
      }

      .axis-labels {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        margin: 8px 0;
        color: #666;
      }

      .chart-table {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .trait-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .trait-letter {
        width: 22px;
        height: 22px;
        border-radius: 4px;
        background: #3498db;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
      }

      .trait-content {
        display: flex;
        flex-direction: column;
      }

      .trait-name {
        font-weight: 600;
        font-size: 14px;
        color: #000;
      }

      .trait-subtitle {
        font-size: 12px;
        color: #666;
        font-style: italic;
      }

      .indicator {
        text-align: right;
        font-weight: bold;
        font-size: 15px;
      }

      /* Chart Items */
      .chart-item {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .chart-label {
        width: 22px;
        height: 22px;
        border-radius: 4px;
        background: #3498db;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        flex-shrink: 0;
      }

      .bar-container {
        flex: 1;
        height: 20px;
        background: #f0f0f0;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
      }

      .bar {
        height: 100%;
        border-radius: 10px;
      }

      .bar.blue { background: #4aa3df; }
      .bar.orange { background: #f39c12; }
      .bar.grey { background: #95a5a6; }

      /* Important Note */
      .note {
        margin-top: 20px;
        padding: 10px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        border-radius: 12px;
      }

      .note h3 {
        font-size: 12px;
        font-weight: bold;
        color: #e74c3c;
        margin-bottom: 2px;
      }

      .note p {
        font-size: 11px;
        color: #444;
        line-height: 1.5;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Тест на личные качества Tool Test</h1>
        <div class="header-info">
          <div class="info-left">
            <div class="info-row"><span class="label">Дата:</span><span class="value">${currentDate}</span></div>
            <div class="info-row"><span class="label">Пол:</span><span class="value">${result.gender === 'MALE' ? 'Муж.' : 'Жен.'}</span></div>
            <div class="info-row"><span class="label">Возраст:</span><span class="value">${result.age}</span></div>
          </div>
          <div class="fullname">Инициатор тестирования: <b>${result.fullName}</b></div>
        </div>
      </div>

      <div class="content">
        <div class="traits-table">
          <table>
            <thead>
              <tr>
                <th>Личностные качества</th>
                <th>Показатели</th>
              </tr>
            </thead>
            <tbody>
              ${this.generateTraitsTableRows(result)}
            </tbody>
          </table>
        </div>

        <div class="chart-section">
          <div class="axis-labels">
            <span>-100</span>
            <span>-19</span>
            <span>0</span>
            <span>32</span>
            <span>100</span>
          </div>
          <div class="chart-table">
            ${this.generateChartRows(result)}
          </div>
        </div>
      </div>

      <div class="note">
        <h3>ВАЖНОЕ ПРИМЕЧАНИЕ</h3>
        <p>Взаимосвязь между точками на графике намного важнее, чем отдельное положение каждой из них. Поэтому результаты теста формируют для вас лишь основу для анализа продуктивности и потенциала ваших кандидатов.</p>
      </div>
    </div>
  </body>
  </html>`;
  }


  private generateTraitsTableRows(result: ResultBO): string {
    const traits = [
      {
        letter: 'A',
        name: 'Внимание',
        subtitle: 'Планирование',
        value: result.percents.a,
      },
      {
        letter: 'B',
        name: 'Стратегия',
        subtitle: 'Позиция',
        value: result.percents.b,
      },
      {
        letter: 'C',
        name: 'Контроль',
        subtitle: 'Спокойствие',
        value: result.percents.c,
      },
      {
        letter: 'D',
        name: 'Уверенность',
        subtitle: 'Изменения',
        value: result.percents.d,
      },
      {
        letter: 'E',
        name: 'Энергия',
        subtitle: 'Жизненная сила',
        value: result.percents.e,
      },
      {
        letter: 'F',
        name: 'Решительность',
        subtitle: 'Сила намерения',
        value: result.percents.f,
      },
      {
        letter: 'G',
        name: 'Оборона',
        subtitle: 'Способность держать давление',
        value: result.percents.g,
      },
      {
        letter: 'H',
        name: 'Тактика',
        subtitle: 'Приоритет',
        value: result.percents.h,
      },
      {
        letter: 'I',
        name: 'Эмпатия',
        subtitle: 'Теплота',
        value: result.percents.i,
      },
      {
        letter: 'J',
        name: 'Общение',
        subtitle: 'Яркость',
        value: result.percents.j,
      },
    ];

    return traits
      .map(
        (trait) => `
        <tr>
          <td>
            <div class="trait-row">
              <div class="trait-letter">${trait.letter}</div>
              <div class="trait-content">
                <div class="trait-name">${trait.name}</div>
                <div class="trait-subtitle">${trait.subtitle}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="indicator">
              ${trait.value}
            </span>
          </td>
        </tr>
      `,
      )
      .join('');
  }

  private generateChartRows(result: ResultBO): string {
    const traits = [
      { letter: 'A', value: result.percents.a, color: 'blue' },
      { letter: 'B', value: result.percents.b, color: 'blue' },
      { letter: 'C', value: result.percents.c, color: 'blue' },
      { letter: 'D', value: result.percents.d, color: 'grey' },
      { letter: 'E', value: result.percents.e, color: 'orange' },
      { letter: 'F', value: result.percents.f, color: 'orange' },
      { letter: 'G', value: result.percents.g, color: 'orange' },
      { letter: 'H', value: result.percents.h, color: 'blue' },
      { letter: 'I', value: result.percents.i, color: 'blue' },
      { letter: 'J', value: result.percents.j, color: 'blue' },
    ];

    return traits
      .map((trait) => {
        const normalizedValue = Math.max(-100, Math.min(100, trait.value));
        const barWidth = ((normalizedValue + 100) / 200) * 100;

        return `
        <div class="chart-item">
          <div class="chart-label">${trait.letter}</div>
          <div class="bar-container">
            <div class="bar ${trait.color}" style="width: ${barWidth}%;"></div>
          </div>
        </div>
      `;
      })
      .join('');
  }

}
