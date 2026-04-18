'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TitanExpanded from './TitanExpanded';
import CampusExpanded from './CampusExpanded';
import GenxExpanded from './GenxExpanded';
import { subscribeProject, closeProject } from '@/lib/projectOverlay';

export default function ExpandedRouter() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    return subscribeProject((id) => setActiveProject(id));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeProject) closeProject();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeProject]);

  if (!mounted) return null;

  const handleClose = () => closeProject();

  const getContent = () => {
    switch (activeProject) {
      case 'titan':
        return <TitanExpanded onClose={handleClose} />;
      case 'campusiq':
        return <CampusExpanded onClose={handleClose} />;
      case 'genx':
        return <GenxExpanded onClose={handleClose} />;
      default:
        return null;
    }
  };

  return createPortal(
    <AnimatePresence>
      {activeProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            overflowY: 'auto',
          }}
        >
          {getContent()}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
