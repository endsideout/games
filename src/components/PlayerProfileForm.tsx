import React, { useState } from "react";

export interface PlayerProfileValues {
  name: string;
  grade: string;
  teacherName: string;
  schoolName: string;
}

interface PlayerProfileFormProps {
  initialValues?: Partial<PlayerProfileValues>;
  onSubmit: (values: PlayerProfileValues) => void;
  submitLabel?: string;
}

export function PlayerProfileForm({
  initialValues,
  onSubmit,
  submitLabel = "Continue to Game",
}: PlayerProfileFormProps): React.JSX.Element {
  const gradeOptions = [
    "1st Grade",
    "2nd Grade",
    "3rd Grade",
    "4th Grade",
    "5th Grade",
    "6th Grade",
    "7th Grade",
    "8th Grade",
  ] as const;
  const [name, setName] = useState(initialValues?.name ?? "");
  const [grade, setGrade] = useState(initialValues?.grade ?? "");
  const [teacherName, setTeacherName] = useState(initialValues?.teacherName ?? "");
  const [schoolName, setSchoolName] = useState(initialValues?.schoolName ?? "");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit({
      name,
      grade,
      teacherName,
      schoolName,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl bg-white/95 rounded-3xl shadow-2xl border-4 border-blue-300 p-8"
      data-testid="player-profile-form"
    >
      <h1 className="text-3xl font-bold text-blue-700 mb-2">
        Before you start
      </h1>
      <p className="text-gray-700 mb-6">
        Please fill in these details to continue to the game.
      </p>

      <div className="space-y-4">
        <label className="block">
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            Student Name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            data-testid="player-name-input"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            Grade
          </span>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
            data-testid="player-grade-input"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>
              Select grade
            </option>
            {gradeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            Teacher Name
          </span>
          <input
            type="text"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            required
            data-testid="player-teacher-input"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            School Name
          </span>
          <input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            required
            data-testid="player-school-input"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
      </div>

      <button
        type="submit"
        data-testid="player-profile-submit"
        className="w-full mt-7 py-3 rounded-xl text-white font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity"
      >
        {submitLabel}
      </button>
    </form>
  );
}
