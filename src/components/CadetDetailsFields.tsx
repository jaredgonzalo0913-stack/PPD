import {
  CADET_FIELD_LABELS,
  CadetDetailErrors,
  CadetDetailField,
  CadetDetails,
} from '../utils/cadetProfile';

const FIELD_HINTS: Partial<Record<CadetDetailField, string>> = {
  fullName: 'Your complete name as registered with the academy.',
  displayName: 'Shown to instructors in assessment checking and grading lists.',
  cadetNumber: 'Your cadet identification number.',
};

const FIELD_AUTOCOMPLETE: Partial<Record<CadetDetailField, string>> = {
  fullName: 'name',
  displayName: 'nickname',
};

export default function CadetDetailsFields({
  idPrefix,
  fields,
  values,
  errors,
  requiredFields,
  showDisplayNameFormat = false,
  disabled = false,
  onChange,
}: {
  idPrefix: string;
  fields: readonly CadetDetailField[];
  values: CadetDetails;
  errors: CadetDetailErrors;
  requiredFields?: readonly CadetDetailField[];
  showDisplayNameFormat?: boolean;
  disabled?: boolean;
  onChange: (field: CadetDetailField, value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
      {fields.map((field, index) => {
        const id = `${idPrefix}-${field}`;
        const error = errors[field];
        const required = requiredFields
          ? requiredFields.includes(field)
          : field !== 'cadetNumber';
        const hint = field === 'cadetNumber' && !required
          ? 'Your cadet identification number (optional).'
          : FIELD_HINTS[field];
        const showFormat = field === 'displayName' && showDisplayNameFormat;
        const displayNameIndex = fields.indexOf('displayName');
        const sharesDisplayNameRow = Math.floor(index / 2) === Math.floor(displayNameIndex / 2);
        const describedBy = [
          error ? `${id}-error` : null,
          hint ? `${id}-hint` : null,
          showFormat ? `${id}-format` : null,
        ].filter(Boolean).join(' ');
        return (
          <div
            key={field}
            className={`min-w-0 ${showDisplayNameFormat && field === 'cadetNumber' ? 'sm:col-span-2' : ''}`}
          >
            <label htmlFor={id} className={`block text-sm font-semibold text-cyan ${showDisplayNameFormat ? 'mb-1' : 'mb-2'}`}>
              {CADET_FIELD_LABELS[field]}
              {required && <span aria-hidden="true" className="text-red-300"> *</span>}
            </label>
            {showFormat && (
              <div id={`${id}-format`} className="flex min-h-8 flex-col justify-end">
                <p className="text-[11px] font-semibold leading-4 text-light-gray">Format: SURNAME, INITIALS</p>
              </div>
            )}
            {showDisplayNameFormat && !showFormat && sharesDisplayNameRow && (
              <div aria-hidden="true" className="hidden min-h-8 sm:block" />
            )}
            <input
              id={id}
              type="text"
              required={required}
              disabled={disabled}
              autoComplete={FIELD_AUTOCOMPLETE[field] ?? 'off'}
              value={values[field]}
              onChange={(event) => onChange(field, event.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy || undefined}
              className="w-full min-w-0 rounded-lg border border-cyan/30 bg-steel-gray p-3 text-white disabled:opacity-60"
            />
            {error ? (
              <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-300">{error}</p>
            ) : hint ? (
              <p id={`${id}-hint`} className="mt-1 text-xs text-light-gray/70">{hint}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
