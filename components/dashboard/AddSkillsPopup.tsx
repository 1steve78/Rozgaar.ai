'use client';

import { useEffect, useState } from 'react';

type AddSkillsPopupProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onAdd?: () => void;
  onClose?: () => void;
};

export default function AddSkillsPopup({
  open,
  title = 'Add your skills',
  description = 'Please add skills to your profile to continue.',
  confirmLabel = 'Add skills',
  onAdd,
  onClose,
}: AddSkillsPopupProps) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  if (!visible) return null;

  const handleAddSkills = () => {
    if (onAdd) {
      onAdd();
      return;
    }
    const el = document.getElementById('skills-input');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setVisible(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-sky-100">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={() => {
              setVisible(false);
              onClose?.();
            }}
            className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
          >
            Not now
          </button>
          <button
            onClick={handleAddSkills}
            className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
