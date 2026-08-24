import { FormEvent, useState } from "react";

interface Props {
  onAdd: (name: string) => Promise<void>;
  saving: boolean;
}

/**
 * Forms + controlled inputs: `name` lives in this component's state and
 * the <input> reflects it via value/onChange, so React (not the DOM) is
 * always the source of truth. Submission is handled by a real <form
 * onSubmit>, so Enter-to-submit and accessibility come for free.
 */
export default function AddHabitForm({ onAdd, saving }: Props) {
  const [name, setName] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldError(null);
    try {
      await onAdd(name);
      setName("");
    } catch (err) {
      setFieldError(err instanceof Error ? err.message : "Couldn't add that habit.");
    }
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="add-form-row">
        <input
          className="add-input"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldError) setFieldError(null);
          }}
          placeholder="Add a new habit…"
          disabled={saving}
          aria-invalid={Boolean(fieldError)}
        />
        <button className="add-button" type="submit" disabled={saving || !name.trim()}>
          {saving ? "Adding…" : "+ Add"}
        </button>
        <span className="hint">click a cell to cycle: empty → done → skipped</span>
      </div>
      {fieldError && <div className="field-error">{fieldError}</div>}
    </form>
  );
}
