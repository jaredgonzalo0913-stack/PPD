import { FormEvent, useState } from 'react';
import { UserRole } from '../types';

type AssessmentType = 'quiz' | 'written' | 'essay' | 'practical';
type SubmissionMethod = 'text' | 'file' | 'text-and-file';
type PublicationState = 'draft' | 'published' | 'unpublished';

interface QuizQuestionDraft {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AssessmentPreview {
  title: string;
  type: AssessmentType;
  instructions: string;
  requirements: string;
  maxPoints: number;
  opensAt: string;
  dueAt: string;
  allowLate: boolean;
  submissionMethod: SubmissionMethod;
  state: PublicationState;
  questions: QuizQuestionDraft[];
}

const TYPE_LABELS: Record<AssessmentType, string> = {
  quiz: 'Quiz',
  written: 'Written activity',
  essay: 'Essay',
  practical: 'Practical assessment',
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
};

export default function AssessmentWorkspace({ role }: { role: UserRole }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<AssessmentType>('written');
  const [instructions, setInstructions] = useState('');
  const [requirements, setRequirements] = useState('');
  const [maxPoints, setMaxPoints] = useState('');
  const [opensAt, setOpensAt] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [allowLate, setAllowLate] = useState(false);
  const [submissionMethod, setSubmissionMethod] = useState<SubmissionMethod>('text');
  const [state, setState] = useState<PublicationState>('draft');
  const [preview, setPreview] = useState<AssessmentPreview | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [questionError, setQuestionError] = useState<string | null>(null);

  const canManage = role === 'instructor' || role === 'admin';

  const previewAssessment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const points = Number(maxPoints);
    if (!Number.isFinite(points) || points <= 0) {
      setFormError('Maximum points must be greater than zero.');
      return;
    }

    const openingDate = new Date(opensAt);
    const deadlineDate = new Date(dueAt);
    if (
      Number.isNaN(openingDate.getTime()) ||
      Number.isNaN(deadlineDate.getTime()) ||
      deadlineDate < openingDate
    ) {
      setFormError('Enter valid opening and deadline times. The deadline must not be before opening.');
      return;
    }

    setPreview({
      title: title.trim(),
      type,
      instructions: instructions.trim(),
      requirements: requirements.trim(),
      maxPoints: points,
      opensAt,
      dueAt,
      allowLate,
      submissionMethod,
      state,
      questions: preview?.questions ?? [],
    });
  };

  const addQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuestionError(null);

    if (!question.trim() || options.some((option) => !option.trim()) || !explanation.trim()) {
      setQuestionError('Enter the question, all four answer choices, and an explanation.');
      return;
    }

    setPreview((current) => ({
      title: current?.title ?? (title.trim() || 'Untitled preview'),
      type: 'quiz',
      instructions: current?.instructions ?? instructions.trim(),
      requirements: current?.requirements ?? requirements.trim(),
      maxPoints: current?.maxPoints ?? (Number(maxPoints) || 0),
      opensAt: current?.opensAt ?? opensAt,
      dueAt: current?.dueAt ?? dueAt,
      allowLate: current?.allowLate ?? allowLate,
      submissionMethod: current?.submissionMethod ?? submissionMethod,
      state: current?.state ?? state,
      questions: [
        ...(current?.questions ?? []),
        {
          id: `preview-question-${Date.now()}`,
          question: question.trim(),
          options: options.map((option) => option.trim()),
          correctAnswer,
          explanation: explanation.trim(),
        },
      ],
    }));
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
    setExplanation('');
  };

  const loadPreviewForEditing = () => {
    if (!preview) return;
    setTitle(preview.title);
    setType(preview.type);
    setInstructions(preview.instructions);
    setRequirements(preview.requirements);
    setMaxPoints(String(preview.maxPoints || ''));
    setOpensAt(preview.opensAt);
    setDueAt(preview.dueAt);
    setAllowLate(preview.allowLate);
    setSubmissionMethod(preview.submissionMethod);
    setState(preview.state);
  };

  if (canManage) {
    return (
      <div className="space-y-6">
        <section className="glass-panel p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="heading-section">Manage Assessments</h2>
            <p className="text-amber-200 text-sm mt-2">
              Frontend preview only: assessment data is not connected to Supabase and will not be saved, published, or shared with Cadets.
            </p>
          </div>

          <form onSubmit={previewAssessment} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="activity-title" className="block text-sm font-semibold text-cyan mb-2">
                  Title
                </label>
                <input
                  id="activity-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
                />
              </div>
              <div>
                <label htmlFor="activity-type" className="block text-sm font-semibold text-cyan mb-2">
                  Assessment type
                </label>
                <select
                  id="activity-type"
                  value={type}
                  onChange={(event) => setType(event.target.value as AssessmentType)}
                  className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
                >
                  {Object.entries(TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="activity-instructions" className="block text-sm font-semibold text-cyan mb-2">
                Instructions
              </label>
              <textarea
                id="activity-instructions"
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                required
                rows={4}
                className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
              />
            </div>

            <div>
              <label htmlFor="activity-requirements" className="block text-sm font-semibold text-cyan mb-2">
                Requirements and grading criteria
              </label>
              <textarea
                id="activity-requirements"
                value={requirements}
                onChange={(event) => setRequirements(event.target.value)}
                rows={3}
                className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="activity-points" className="block text-sm font-semibold text-cyan mb-2">
                  Maximum points
                </label>
                <input
                  id="activity-points"
                  type="number"
                  min="1"
                  step="any"
                  value={maxPoints}
                  onChange={(event) => setMaxPoints(event.target.value)}
                  required
                  className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
                />
              </div>
              <div>
                <label htmlFor="activity-opening" className="block text-sm font-semibold text-cyan mb-2">
                  Opens at (local time)
                </label>
                <input
                  id="activity-opening"
                  type="datetime-local"
                  value={opensAt}
                  onChange={(event) => setOpensAt(event.target.value)}
                  required
                  className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
                />
              </div>
              <div>
                <label htmlFor="activity-deadline" className="block text-sm font-semibold text-cyan mb-2">
                  Deadline (local time)
                </label>
                <input
                  id="activity-deadline"
                  type="datetime-local"
                  value={dueAt}
                  onChange={(event) => setDueAt(event.target.value)}
                  required
                  className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
                />
              </div>
              <div>
                <label htmlFor="activity-submission-method" className="block text-sm font-semibold text-cyan mb-2">
                  Submission method
                </label>
                <select
                  id="activity-submission-method"
                  value={submissionMethod}
                  onChange={(event) => setSubmissionMethod(event.target.value as SubmissionMethod)}
                  className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
                >
                  <option value="text">Written response</option>
                  <option value="file">File attachment</option>
                  <option value="text-and-file">Written response and file</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="activity-state" className="block text-sm font-semibold text-cyan mb-2">
                  Intended state (preview only)
                </label>
                <select
                  id="activity-state"
                  value={state}
                  onChange={(event) => setState(event.target.value as PublicationState)}
                  className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="unpublished">Unpublished</option>
                </select>
              </div>
              <label className="flex items-center gap-3 text-light-gray self-end pb-3">
                <input
                  type="checkbox"
                  checked={allowLate}
                  onChange={(event) => setAllowLate(event.target.checked)}
                  className="h-4 w-4 accent-cyan"
                />
                Late submissions permitted (preview only)
              </label>
            </div>

            {formError && <p role="alert" className="text-red-300 text-sm">{formError}</p>}
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="button-primary">Preview assessment</button>
              <button type="button" disabled className="button-secondary disabled:opacity-50">
                Save draft (backend required)
              </button>
              <button type="button" disabled className="button-secondary disabled:opacity-50">
                Publish (backend required)
              </button>
              <button type="button" disabled className="button-secondary disabled:opacity-50">
                Unpublish (backend required)
              </button>
            </div>
          </form>

          {type === 'quiz' && (
            <form onSubmit={addQuestion} className="mt-8 border-t border-cyan/20 pt-6 space-y-4">
              <h3 className="heading-subsection">Quiz question builder (local preview only)</h3>
              <div>
                <label htmlFor="quiz-question" className="block text-sm font-semibold text-cyan mb-2">
                  Question
                </label>
                <textarea
                  id="quiz-question"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  rows={2}
                  className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {options.map((option, index) => (
                  <div key={index}>
                    <label htmlFor={`quiz-option-${index}`} className="block text-xs text-cyan mb-1">
                      Answer choice {index + 1}
                    </label>
                    <input
                      id={`quiz-option-${index}`}
                      value={option}
                      onChange={(event) =>
                        setOptions((current) =>
                          current.map((value, optionIndex) =>
                            optionIndex === index ? event.target.value : value,
                          ),
                        )
                      }
                      className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
                    />
                  </div>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="quiz-correct-answer" className="block text-sm font-semibold text-cyan mb-2">
                    Correct answer
                  </label>
                  <select
                    id="quiz-correct-answer"
                    value={correctAnswer}
                    onChange={(event) => setCorrectAnswer(Number(event.target.value))}
                    className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
                  >
                    {options.map((_, index) => (
                      <option key={index} value={index}>Choice {index + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="quiz-explanation" className="block text-sm font-semibold text-cyan mb-2">
                    Answer explanation
                  </label>
                  <input
                    id="quiz-explanation"
                    value={explanation}
                    onChange={(event) => setExplanation(event.target.value)}
                    className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
                  />
                </div>
              </div>
              {questionError && <p role="alert" className="text-red-300 text-sm">{questionError}</p>}
              <button type="submit" className="button-secondary">Add question to preview</button>
            </form>
          )}
        </section>

        <section className="glass-panel p-6 sm:p-8">
          <h2 className="heading-section mb-4">Instructor preview</h2>
          {!preview ? (
            <p className="text-light-gray">
              No preview has been created. The application cannot load managed assessments until the backend is reviewed and connected.
            </p>
          ) : (
            <article className="card space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="heading-subsection">{preview.title}</h3>
                  <p className="text-cyan text-sm">{TYPE_LABELS[preview.type]} · {preview.state} preview</p>
                </div>
                <button type="button" onClick={loadPreviewForEditing} className="button-secondary">
                  Edit preview
                </button>
              </div>
              <p className="text-light-gray whitespace-pre-line">{preview.instructions}</p>
              {preview.requirements && (
                <p className="text-light-gray whitespace-pre-line">
                  <span className="text-cyan font-semibold">Requirements:</span> {preview.requirements}
                </p>
              )}
              <dl className="grid gap-3 sm:grid-cols-2 text-sm text-light-gray">
                <div><dt className="text-cyan">Maximum points</dt><dd>{preview.maxPoints}</dd></div>
                <div><dt className="text-cyan">Submission method</dt><dd>{preview.submissionMethod}</dd></div>
                <div><dt className="text-cyan">Opens</dt><dd>{formatDateTime(preview.opensAt)}</dd></div>
                <div><dt className="text-cyan">Deadline</dt><dd>{formatDateTime(preview.dueAt)}</dd></div>
                <div><dt className="text-cyan">Late submissions</dt><dd>{preview.allowLate ? 'Permitted' : 'Not permitted'}</dd></div>
                {preview.type === 'quiz' && (
                  <div><dt className="text-cyan">Questions in preview</dt><dd>{preview.questions.length}</dd></div>
                )}
              </dl>
              {preview.questions.map((item, index) => (
                <div key={item.id} className="border-t border-cyan/20 pt-3">
                  <p className="font-semibold text-cyan">{index + 1}. {item.question}</p>
                  <ol className="list-decimal list-inside text-light-gray text-sm mt-2 space-y-1">
                    {item.options.map((option, optionIndex) => (
                      <li key={optionIndex}>
                        {option}{optionIndex === item.correctAnswer ? ' (preview correct answer)' : ''}
                      </li>
                    ))}
                  </ol>
                  <p className="text-light-gray text-sm mt-2">{item.explanation}</p>
                </div>
              ))}
              <p className="text-amber-200 text-xs">
                This preview exists only in this page session; it is not a managed assessment and is not visible to Cadets.
              </p>
            </article>
          )}
        </section>

        <section className="glass-panel p-6 sm:p-8">
          <h2 className="heading-section mb-3">Submission review and grading</h2>
          <p className="text-light-gray">
            No real assessment submissions can be loaded yet. Submission lists, attachment access, grade entry,
            feedback, grade release, and timestamps remain unavailable until the database schema and RLS policies are reviewed.
          </p>
          <fieldset disabled className="mt-5 grid gap-4 sm:grid-cols-2 opacity-60">
            <div>
              <label htmlFor="grade-preview" className="block text-sm font-semibold text-cyan mb-2">
                Score (requires a real submission)
              </label>
              <input
                id="grade-preview"
                type="number"
                min="0"
                disabled
                className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
              />
            </div>
            <div>
              <label htmlFor="feedback-preview" className="block text-sm font-semibold text-cyan mb-2">
                Instructor feedback
              </label>
              <textarea
                id="feedback-preview"
                rows={3}
                disabled
                className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
              />
            </div>
            <label className="flex items-center gap-3 text-light-gray sm:col-span-2">
              <input type="checkbox" disabled className="h-4 w-4 accent-cyan" />
              Release grade and feedback to Cadet
            </label>
            <button type="button" disabled className="button-primary sm:col-span-2">
              Save grade (backend required)
            </button>
          </fieldset>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel p-6 sm:p-8">
        <h2 className="heading-section">Instructor-published assessments</h2>
        <p className="text-light-gray mt-2">
          No live assessment records are connected. Drafts created in the instructor preview are not published or shared.
        </p>
        <p className="text-amber-200 text-sm mt-4">
          Activity instructions, opening times, deadlines, points, and submission status will appear here after secure backend integration.
          No submission status, grade, or feedback is available to display at this time.
        </p>
      </section>

      <section className="glass-panel p-6 sm:p-8">
        <h2 className="heading-section">Submission composer preview</h2>
        <p className="text-amber-200 text-sm mt-2 mb-5">
          This is a local interface preview only. Responses and selected files are not uploaded or saved. Do not enter real assignment work here yet.
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="submission-response-preview" className="block text-sm font-semibold text-cyan mb-2">
              Written response preview
            </label>
            <textarea
              id="submission-response-preview"
              value={submissionText}
              onChange={(event) => setSubmissionText(event.target.value)}
              rows={5}
              className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
            />
          </div>
          <div>
            <label htmlFor="submission-file-preview" className="block text-sm font-semibold text-cyan mb-2">
              Attachment selection preview
            </label>
            <input
              id="submission-file-preview"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(event) => setAttachmentName(event.target.files?.[0]?.name ?? '')}
              className="block w-full text-sm text-light-gray file:mr-4 file:rounded-lg file:border-0 file:bg-cyan file:px-4 file:py-2 file:font-semibold file:text-navy"
            />
            {attachmentName && (
              <p className="text-light-gray text-sm mt-2">Selected locally (not uploaded): {attachmentName}</p>
            )}
          </div>
          <p role="status" className="text-light-gray text-sm">
            A submission button is intentionally unavailable until secure upload, deadline validation, and server-side confirmation are connected.
          </p>
        </div>
      </section>
    </div>
  );
}
