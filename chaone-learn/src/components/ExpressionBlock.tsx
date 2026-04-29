import { ExpressionEntry } from "@/lib/types";
import styles from "./ExpressionBlock.module.css";

interface ExpressionBlockProps {
  expression: ExpressionEntry;
}

export default function ExpressionBlock({ expression }: ExpressionBlockProps) {
  return (
    <article className={styles.block}>
      <header className={styles.header}>
        <h3 className={styles.title} lang="ko">
          {expression.title}
        </h3>
      </header>

      <p className={styles.description}>{expression.description}</p>

      {expression.tables && expression.tables.length > 0 && (
        <div className={styles.tables}>
          {expression.tables.map((table) => (
            <table key={table.id} className={styles.table}>
              <thead>
                <tr>
                  {table.headers.map((h, i) => (
                    <th key={i} className={styles.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className={styles.td} lang={ci > 0 ? "ko" : undefined}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      )}
    </article>
  );
}
