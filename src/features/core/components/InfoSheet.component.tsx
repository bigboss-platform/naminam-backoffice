'use client';

import { useState } from 'react';
import { BottomSheet } from './BottomSheet.component';
import styles from './InfoSheet.module.css';

export type GlossaryEntry = { term: string; meaning: string };

type InfoSheetProps = {
  title: string;
  howItWorks: string[];
  glossary: GlossaryEntry[];
};

/**
 * ⓘ button + info sheet with exactly two tabs: "Cómo funciona" + "Glosario"
 * (workspace rule: all explanations live here, never as banners or hint text).
 */
export function InfoSheet({ title, howItWorks, glossary }: InfoSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'how' | 'glossary'>('how');

  return (
    <>
      <button type="button" className={styles.infoButton} onClick={() => setIsOpen(true)} aria-label={`Ayuda: ${title}`}>
        <span className="material-symbols-outlined">info</span>
      </button>
      <BottomSheet open={isOpen} onClose={() => setIsOpen(false)} title={title}>
        <div className={styles.tabs} role="tablist">
          <button type="button" role="tab" aria-selected={activeTab === 'how'} className={activeTab === 'how' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('how')}>
            Cómo funciona
          </button>
          <button type="button" role="tab" aria-selected={activeTab === 'glossary'} className={activeTab === 'glossary' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('glossary')}>
            Glosario
          </button>
        </div>
        {activeTab === 'how' ? (
          <ul className={styles.steps}>
            {howItWorks.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        ) : (
          <dl className={styles.glossary}>
            {glossary.map((entry) => (
              <div key={entry.term} className={styles.entry}>
                <dt>{entry.term}</dt>
                <dd>{entry.meaning}</dd>
              </div>
            ))}
          </dl>
        )}
      </BottomSheet>
    </>
  );
}
