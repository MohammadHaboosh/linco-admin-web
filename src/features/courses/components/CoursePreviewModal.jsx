import { useEffect, useMemo, useState } from "react";
import Icon from "../../../components/icons/Icon";
import StatusBadge from "../../../components/common/StatusBadge";
import { getCoursePreviewRequest } from "../api/coursesApi";
import styles from "./CoursePreviewModal.module.css";

const getChoiceText = (choice) => {
  if (typeof choice === "string") return choice;
  return choice?.choice ?? choice?.text ?? choice?.answer ?? "Untitled choice";
};

const isCorrectChoice = (choice) =>
  choice?.isCorrect === true ||
  choice?.correct === true ||
  choice?.is_correct === true;

const formatLessonDuration = (duration) => {
  const seconds = Number(duration);
  if (!Number.isFinite(seconds) || seconds <= 0) return "Duration unavailable";

  const minutes = Math.max(1, Math.ceil(seconds / 60));
  return `${minutes} min`;
};

const findInitialContent = (sections) => {
  for (const section of sections) {
    if (section.lessons?.length) {
      return { kind: "lesson", item: section.lessons[0], section };
    }
  }

  for (const section of sections) {
    if (section.quiz) return { kind: "quiz", item: section.quiz, section };
  }

  return null;
};

const CoursePreviewModal = ({ course, onClose }) => {
  const [sections, setSections] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    queueMicrotask(() => {
      if (controller.signal.aborted) return;
      setIsLoading(true);
      setError("");
      setSections([]);
      setSelectedContent(null);
    });

    getCoursePreviewRequest(course.id, { signal: controller.signal })
      .then((courseSections) => {
        setSections(courseSections);
        setSelectedContent(findInitialContent(courseSections));
      })
      .catch((requestError) => {
        if (requestError.name === "AbortError") return;
        setError(requestError.message || "Could not load the course preview.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [course.id, requestVersion]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const contentCount = useMemo(
    () =>
      sections.reduce(
        (total, section) =>
          total + (section.lessons?.length || 0) + (section.quiz ? 1 : 0),
        0,
      ),
    [sections],
  );

  const hasPartialErrors = sections.some((section) =>
    Object.values(section.previewErrors || {}).some(Boolean),
  );
  const isPublic = course.visibility === "PUBLIC";

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <section
        aria-labelledby="course-preview-title"
        aria-modal="true"
        className={styles.modal}
        role="dialog"
      >
        <header className={styles.header}>
          <div className={styles.courseIdentity}>
            <div className={styles.thumbnail}>
              {course.imagePath ? (
                <img src={course.imagePath} alt="" />
              ) : (
                <Icon name="courses" size={24} />
              )}
            </div>
            <div>
              <span className={styles.eyebrow}>Read-only admin preview</span>
              <h2 id="course-preview-title">{course.title}</h2>
              <div className={styles.headerMeta}>
                <span>{course.demo?.name || "Unknown Provider"}</span>
                <StatusBadge tone={isPublic ? "blue" : "warning"}>
                  {isPublic ? "Public" : "Private"}
                </StatusBadge>
              </div>
            </div>
          </div>
          <button
            aria-label="Close course preview"
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            <Icon name="close" size={20} />
          </button>
        </header>

        <div className={styles.notice}>
          <Icon name="shield" size={17} />
          Videos can be watched and quizzes inspected here without recording
          progress, creating an attempt, or submitting answers.
        </div>

        {isLoading ? (
          <div className={styles.centerState} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            Loading curriculum and quiz details...
          </div>
        ) : error ? (
          <div className={styles.centerState} role="alert">
            <Icon name="alert" size={30} />
            <strong>Course preview unavailable</strong>
            <span>{error}</span>
            <button
              className={styles.retryButton}
              onClick={() => setRequestVersion((version) => version + 1)}
              type="button"
            >
              Try again
            </button>
          </div>
        ) : sections.length === 0 ? (
          <div className={styles.centerState} role="status">
            <Icon name="folder" size={30} />
            <strong>This course has no curriculum yet</strong>
            <span>There are no lessons or quizzes available to preview.</span>
          </div>
        ) : (
          <div className={styles.workspace}>
            <aside
              aria-label="Course curriculum"
              className={styles.curriculum}
            >
              <div className={styles.curriculumHeader}>
                <div>
                  <span>Curriculum</span>
                  <strong>{sections.length} sections</strong>
                </div>
                <span className={styles.contentCount}>{contentCount}</span>
              </div>

              {hasPartialErrors && (
                <p className={styles.partialWarning} role="status">
                  Some curriculum details could not be loaded.
                </p>
              )}

              <div className={styles.sectionList}>
                {sections.map((section, sectionIndex) => (
                  <section className={styles.sectionGroup} key={section.id}>
                    <div className={styles.sectionHeading}>
                      <span>Section {sectionIndex + 1}</span>
                      <strong>{section.title || "Untitled section"}</strong>
                    </div>

                    {section.previewErrors?.lessons ? (
                      <span className={styles.inlineError}>
                        Lessons unavailable
                      </span>
                    ) : (
                      section.lessons?.map((lesson, lessonIndex) => {
                        const isSelected =
                          selectedContent?.kind === "lesson" &&
                          selectedContent.item.id === lesson.id;

                        return (
                          <button
                            aria-pressed={isSelected}
                            className={`${styles.contentButton} ${
                              isSelected ? styles.contentButtonActive : ""
                            }`}
                            key={lesson.id}
                            onClick={() =>
                              setSelectedContent({
                                kind: "lesson",
                                item: lesson,
                                section,
                              })
                            }
                            type="button"
                          >
                            <span className={styles.contentIcon}>
                              <Icon name="eye" size={15} />
                            </span>
                            <span>
                              <strong>
                                {lesson.title || `Lesson ${lessonIndex + 1}`}
                              </strong>
                              <small>
                                {formatLessonDuration(lesson.duration)}
                              </small>
                            </span>
                          </button>
                        );
                      })
                    )}

                    {section.quiz && (
                      <button
                        aria-pressed={
                          selectedContent?.kind === "quiz" &&
                          selectedContent.item.id === section.quiz.id
                        }
                        className={`${styles.contentButton} ${styles.quizButton} ${
                          selectedContent?.kind === "quiz" &&
                          selectedContent.item.id === section.quiz.id
                            ? styles.contentButtonActive
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedContent({
                            kind: "quiz",
                            item: section.quiz,
                            section,
                          })
                        }
                        type="button"
                      >
                        <span className={styles.contentIcon}>
                          <Icon name="check" size={15} />
                        </span>
                        <span>
                          <strong>{section.quiz.title || "Section quiz"}</strong>
                          <small>Inspect quiz</small>
                        </span>
                      </button>
                    )}

                    {!section.previewErrors?.lessons &&
                      !section.lessons?.length &&
                      !section.quiz && (
                        <span className={styles.emptySection}>
                          No lessons or quiz
                        </span>
                      )}
                  </section>
                ))}
              </div>
            </aside>

            <main className={styles.viewer}>
              {!selectedContent ? (
                <div className={styles.viewerEmpty}>
                  <Icon name="eye" size={34} />
                  <strong>Select course content</strong>
                  <span>Choose a lesson or quiz from the curriculum.</span>
                </div>
              ) : selectedContent.kind === "lesson" ? (
                <LessonPreview
                  course={course}
                  lesson={selectedContent.item}
                  section={selectedContent.section}
                />
              ) : (
                <QuizPreview
                  quiz={selectedContent.item}
                  section={selectedContent.section}
                />
              )}
            </main>
          </div>
        )}
      </section>
    </div>
  );
};

const LessonPreview = ({ course, lesson, section }) => (
  <div className={styles.lessonPreview}>
    <div className={styles.viewerHeading}>
      <span>{section.title || "Course lesson"}</span>
      <h3>{lesson.title || "Untitled lesson"}</h3>
      <p>{lesson.description || "No lesson description was provided."}</p>
    </div>

    {lesson.videoUrl ? (
      <div className={styles.videoShell}>
        <video
          controls
          key={lesson.id}
          playsInline
          poster={course.imagePath || undefined}
          preload="metadata"
          src={lesson.videoUrl}
        >
          Your browser does not support HTML video playback.
        </video>
        <div className={styles.videoFooter}>
          <span>
            <Icon name="clock" size={15} />
            {formatLessonDuration(lesson.duration)}
          </span>
          <a href={lesson.videoUrl} rel="noreferrer" target="_blank">
            Open video source
            <Icon name="external" size={14} />
          </a>
        </div>
      </div>
    ) : (
      <div className={styles.viewerEmpty} role="status">
        <Icon name="courses" size={34} />
        <strong>Video unavailable</strong>
        <span>This lesson does not have a video URL.</span>
      </div>
    )}
  </div>
);

const QuizPreview = ({ quiz, section }) => {
  const questions = section.questions || [];
  const duration = quiz.durationMinutes ?? quiz.duration ?? 0;
  const questionCount = quiz.numberOfQuestions ?? questions.length;

  return (
    <div className={styles.quizPreview}>
      <div className={styles.viewerHeading}>
        <span>{section.title || "Section assessment"}</span>
        <h3>{quiz.title || "Untitled quiz"}</h3>
        <p>
          Read-only assessment preview. The questions below are the question
          bank available to this quiz and may not reflect randomized ordering.
        </p>
      </div>

      <div className={styles.quizMeta}>
        <div>
          <Icon name="courses" size={18} />
          <span>Questions</span>
          <strong>{questionCount}</strong>
        </div>
        <div>
          <Icon name="clock" size={18} />
          <span>Duration</span>
          <strong>{duration} min</strong>
        </div>
        <div>
          <Icon name="check" size={18} />
          <span>Passing score</span>
          <strong>{Number(quiz.passingScore) || 0}%</strong>
        </div>
      </div>

      {section.previewErrors?.questions ? (
        <div className={styles.quizEmpty} role="alert">
          The quiz configuration loaded, but its question bank is unavailable.
        </div>
      ) : questions.length === 0 ? (
        <div className={styles.quizEmpty} role="status">
          No question-bank entries are available for this quiz.
        </div>
      ) : (
        <div className={styles.questionList}>
          {questions.map((question, questionIndex) => (
            <article className={styles.questionCard} key={question.id}>
              <div className={styles.questionTitle}>
                <span>{questionIndex + 1}</span>
                <div>
                  <strong>{question.question || "Untitled question"}</strong>
                  {question.note && <p>{question.note}</p>}
                </div>
              </div>
              <ol className={styles.choiceList}>
                {(question.choices || []).map((choice, choiceIndex) => {
                  const isCorrect = isCorrectChoice(choice);
                  return (
                    <li
                      className={isCorrect ? styles.correctChoice : ""}
                      key={choice?.id ?? `${question.id}-${choiceIndex}`}
                    >
                      <span>{String.fromCharCode(65 + choiceIndex)}</span>
                      <strong>{getChoiceText(choice)}</strong>
                      {isCorrect && <small>Correct answer</small>}
                    </li>
                  );
                })}
              </ol>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursePreviewModal;
