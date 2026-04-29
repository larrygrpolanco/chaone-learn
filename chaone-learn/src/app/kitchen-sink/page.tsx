"use client";

"use client";

import { useState } from "react";
import AppFrame from "@/components/AppFrame";
import styles from "./page.module.css";

// Foundations
import Button from "@/components/Button";
import InlineTag from "@/components/InlineTag";
import Divider from "@/components/Divider";
import Input from "@/components/Input";
import Toggle from "@/components/Toggle";
import Slider from "@/components/Slider";
import SegmentedControl from "@/components/SegmentedControl";

// Containers
import Card from "@/components/Card";
import Panel from "@/components/Panel";
import Sheet from "@/components/Sheet";

// Navigation
import Breadcrumb from "@/components/Breadcrumb";
import PageHeader from "@/components/PageHeader";

// Activity Launcher
import ActivityLauncher from "@/components/ActivityLauncher";

// Korean pieces
import VocabToken from "@/components/VocabToken";
import VocabCard from "@/components/VocabCard";
import GrammarBlock from "@/components/GrammarBlock";
import ExpressionBlock from "@/components/ExpressionBlock";
import DialogueLine from "@/components/DialogueLine";
import AudioButton from "@/components/AudioButton";
import AudioTray from "@/components/AudioTray";

// State & feedback
import Empty from "@/components/Empty";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Toast from "@/components/Toast";

// Real corpus data
import { grammar } from "@/content/grammar/beginning-1/lesson-1";
import { expressions } from "@/content/expressions/beginning-1/lesson-1";
import { vocabulary } from "@/content/vocabulary/beginning-1/lesson-1";

const sampleVocab = vocabulary[0]; // 1학년
const sampleGrammar = grammar[0]; // Equational expression
const sampleExpression = expressions[0]; // 안녕하세요

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionBody}>{children}</div>
      <Divider />
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.subsection}>
      <h3 className={styles.subsectionTitle}>{title}</h3>
      <div className={styles.subsectionBody}>{children}</div>
    </div>
  );
}

export default function KitchenSink() {
  const [toggleOn, setToggleOn] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [segment, setSegment] = useState("audio");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [audioTrayOpen, setAudioTrayOpen] = useState(true);
  const [readingModeOn, setReadingModeOn] = useState(true);

  return (
    <AppFrame measure="wide">
      <div className={styles.page}>
        <PageHeader
          title="Kitchen Sink"
          subtitle="Living documentation of every component in every state."
          metadata="Phase 3 — Component Kit & Design System Verification"
        />

        {/* ─── Foundations ─── */}
        <Section title="Foundations">
          <Subsection title="Button">
            <div className={styles.row}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className={styles.row}>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
            <div className={styles.row}>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </Subsection>

          <Subsection title="InlineTag">
            <div className={styles.row}>
              <InlineTag>noun</InlineTag>
              <InlineTag>polite-informal</InlineTag>
              <InlineTag>honorific</InlineTag>
            </div>
          </Subsection>

          <Subsection title="Divider">
            <Divider />
          </Subsection>

          <Subsection title="Input">
            <div className={styles.column}>
              <Input placeholder="Default input" />
              <Input inputSize="sm" placeholder="Small input" />
              <Input inputSize="lg" placeholder="Large input" />
              <Input label="With label" placeholder="Type here…" />
              <Input label="With error" placeholder="Type here…" error="This field is required." />
            </div>
          </Subsection>

          <Subsection title="Toggle">
            <div className={styles.row}>
              <Toggle checked={toggleOn} onChange={setToggleOn} label="Notifications" />
              <Toggle defaultChecked={true} label="Always on" disabled />
            </div>
          </Subsection>

          <Subsection title="Slider">
            <div className={styles.column} style={{ maxWidth: 320 }}>
              <Slider value={sliderValue} onChange={setSliderValue} label="Type size" />
              <span className={styles.value}>{sliderValue}%</span>
            </div>
          </Subsection>

          <Subsection title="SegmentedControl">
            <SegmentedControl
              options={[
                { label: "Audio", value: "audio" },
                { label: "Text", value: "text" },
              ]}
              value={segment}
              onChange={setSegment}
            />
          </Subsection>
        </Section>

        {/* ─── Containers ─── */}
        <Section title="Containers">
          <Subsection title="Card">
            <Card>
              <h3 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: "var(--text-subheading)" }}>
                Card title
              </h3>
              <p style={{ color: "var(--color-fg-muted)" }}>
                A bordered container with default padding. Used for grouping content.
              </p>
            </Card>
          </Subsection>

          <Subsection title="Panel">
            <Panel>
              <h3 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: "var(--text-subheading)" }}>
                Panel title
              </h3>
              <p style={{ color: "var(--color-fg-muted)" }}>
                A larger container with more generous padding and radius. Used for reading views and audio trays.
              </p>
            </Panel>
          </Subsection>

          <Subsection title="Sheet">
            <div className={styles.row}>
              <Button onClick={() => setSheetOpen(true)}>Open Sheet</Button>
            </div>
            <Sheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Settings">
              <div className={styles.column}>
                <Toggle label="Reading mode" />
                <Slider value={75} onChange={() => {}} label="Brightness" />
                <SegmentedControl
                  options={[
                    { label: "Default", value: "default" },
                    { label: "Reading", value: "reading" },
                  ]}
                  value="default"
                  onChange={() => {}}
                />
              </div>
            </Sheet>
          </Subsection>
        </Section>

        {/* ─── Navigation ─── */}
        <Section title="Navigation">
          <Subsection title="Breadcrumb">
            <Breadcrumb
              crumbs={[
                { label: "Home", href: "/" },
                { label: "Lessons", href: "/lessons" },
                { label: "Beginning 1", href: "/lessons/beginning-1" },
                { label: "Lesson 1", href: "/lessons/beginning-1/lesson-1" },
                { label: "Flashcards" },
              ]}
            />
          </Subsection>

          <Subsection title="PageHeader">
            <PageHeader
              title="Lesson 1 — Greetings"
              subtitle="Introducing yourself and others."
              metadata="Introduces 34 vocabulary, 5 grammar points, 4 expressions"
            />
          </Subsection>
        </Section>

        {/* ─── Activity Launcher ─── */}
        <Section title="Activity Launcher">
          <ActivityLauncher
            activities={[
              {
                name: "Vocabulary Introduction",
                description: "34 cards covering this lesson's vocabulary",
                status: "not started",
                order: 1,
                href: "#",
              },
              {
                name: "Flashcards",
                description: "14 cards covering this lesson's vocabulary",
                status: "visited",
                order: 2,
                href: "#",
              },
              {
                name: "Mixed-language Reader",
                description: "Read a story with known and unknown tokens",
                status: "in progress",
                order: 3,
                href: "#",
              },
            ]}
          />
        </Section>

        {/* ─── Korean Language Pieces ─── */}
        <Section title="Korean Language Pieces">
          <Subsection title="VocabToken">
            <div className={styles.row}>
              <span>
                Known: <VocabToken korean="한국" state="known" />
              </span>
              <span>
                Unknown: <VocabToken korean="학년" gloss="school year" state="unknown" />
              </span>
              <span>
                Highlighted: <VocabToken korean="선생님" gloss="teacher" state="highlighted" />
              </span>
            </div>
            <p className={styles.hint}>
              Hover (or tap) the highlighted token to see the gloss tooltip.
            </p>
          </Subsection>

          <Subsection title="VocabCard">
            <div className={styles.column} style={{ maxWidth: 420 }}>
              <VocabCard
                korean={sampleVocab.korean}
                english={sampleVocab.english}
                partOfSpeech={sampleVocab.partOfSpeech}
                flipped={cardFlipped}
                onFlip={() => setCardFlipped((f) => !f)}
              />
              <div className={styles.row}>
                <Button variant="secondary" size="sm" onClick={() => setCardFlipped((f) => !f)}>
                  Flip card
                </Button>
              </div>
            </div>
          </Subsection>

          <Subsection title="GrammarBlock">
            <GrammarBlock grammar={sampleGrammar} />
          </Subsection>

          <Subsection title="ExpressionBlock">
            <ExpressionBlock expression={sampleExpression} />
          </Subsection>

          <Subsection title="DialogueLine">
            <div className={styles.column}>
              <DialogueLine
                speaker="김유미"
                korean="안녕하세요. 저는 김유미예요."
                gloss="Hello. I am Yumi Kim."
              />
              <DialogueLine
                speaker="마이클"
                korean="안녕하세요. 마이클 정이에요."
                gloss="Hello. I am Michael Jung."
              />
            </div>
          </Subsection>

          <Subsection title="AudioButton">
            <div className={styles.row}>
              <AudioButton />
              <AudioButton size="sm" />
              <AudioButton size="lg" />
            </div>
            <p className={styles.hint}>
              The first button has no audio source (disabled). The others are visual size variants.
            </p>
          </Subsection>

          <Subsection title="AudioTray">
            <div className={styles.row}>
              <Button variant="secondary" size="sm" onClick={() => setAudioTrayOpen((o) => !o)}>
                {audioTrayOpen ? "Hide" : "Show"} Audio Tray
              </Button>
            </div>
            {audioTrayOpen && (
              <div style={{ position: "relative", marginTop: "var(--space-4)" }}>
                <AudioTray
                  title="Korean Class — narration"
                  onClose={() => setAudioTrayOpen(false)}
                />
              </div>
            )}
          </Subsection>
        </Section>

        {/* ─── State & Feedback ─── */}
        <Section title="State & Feedback">
          <Subsection title="Empty">
            <Empty message="No activities started yet." action={{ label: "Go to Lesson 1", href: "/lessons/beginning-1/lesson-1" }} />
          </Subsection>

          <Subsection title="Loading">
            <Loading text="Loading lesson content…" />
          </Subsection>

          <Subsection title="Error">
            <Error
              title="Failed to load story"
              message="The mixed-language reader could not load the requested story. This may be a temporary issue."
              onRetry={() => window.location.reload()}
            />
          </Subsection>

          <Subsection title="Toast">
            <div className={styles.row}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 2000);
                }}
              >
                Show Toast
              </Button>
            </div>
            {showToast && <Toast message="Settings saved" />}
          </Subsection>
        </Section>

        {/* ─── Reading Mode Demo ─── */}
        <Section title="Reading Mode">
          <div className={styles.row}>
            <Toggle
              checked={readingModeOn}
              onChange={setReadingModeOn}
              label={readingModeOn ? "Reading mode ON" : "Reading mode OFF"}
            />
          </div>
          <p className={styles.hint}>
            Toggle the switch above to switch between default (paper) and reading (warm brown) palettes.
          </p>
          <div
            className={styles.readingContainer}
            {...(readingModeOn ? { "data-mode": "reading" } : {})}
          >
            <Panel>
              <PageHeader
                title="Korean Class"
                subtitle="A graded reader story"
                metadata="Beginning 1 · Lesson 1"
              />
              <div className={styles.prose}>
                <p lang="ko">이민수 선생님은 한국어 선생님이에요. 한국 사람이에요.</p>
                <p lang="ko">김유미, 마이클 정, 소피아 왕, 스티브 윌슨은 한국어 클래스 학생이에요.</p>
              </div>
            </Panel>
          </div>
        </Section>
      </div>
    </AppFrame>
  );
}
