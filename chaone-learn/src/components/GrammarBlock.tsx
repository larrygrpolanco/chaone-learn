import { GrammarPoint } from "@/lib/types";
import styles from "./GrammarBlock.module.css";
import InlineTag from "./InlineTag";

interface GrammarBlockProps {
  grammar: GrammarPoint;
}

export default function GrammarBlock({ grammar }: GrammarBlockProps) {
  return (
    <article className={styles.block}>
      <header className={styles.header}>
        <h3 className={styles.title}>{grammar.title}</h3>
        <div className={styles.meta}>
          <InlineTag>{grammar.structuralType}</InlineTag>
          <InlineTag>{grammar.register}</InlineTag>
          {grammar.appliesTo.map((a) => (
            <InlineTag key={a}>{a}</InlineTag>
          ))}
        </div>
      </header>

      <div className={styles.pattern} lang="ko">
        {grammar.pattern}
      </div>

      <p className={styles.description}>{grammar.description}</p>

      {grammar.examples.length > 0 && (
        <div className={styles.examples}>
          {grammar.examples.map((ex, i) => (
            <div key={i} className={styles.example}>
              <p className={styles.korean} lang="ko">
                {ex.korean}
              </p>
              <p className={styles.english}>{ex.english}</p>
            </div>
          ))}
        </div>
      )}

      {grammar.tables && grammar.tables.length > 0 && (
        <div className={styles.tables}>
          {grammar.tables.map((table) => (
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
