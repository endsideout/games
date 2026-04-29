import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGameUser } from "../../context/GameUserContext";
import { PlayerProfileForm } from "../../components/PlayerProfileForm";
import { sanitizeReturnToPath } from "../../lib/playerProfilePolicy";

export function PlayerInfoForm(): React.JSX.Element {
  const { user, setPlayerProfile } = useGameUser();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const cleanReturnTo = sanitizeReturnToPath(searchParams.get("returnTo"));

  const handleSubmit = (values: {
    name: string;
    grade: string;
    teacherName: string;
    schoolName: string;
  }): void => {
    setPlayerProfile({
      name: values.name,
      grade: values.grade,
      teacherName: values.teacherName,
      schoolName: values.schoolName,
    });

    navigate(cleanReturnTo, { replace: true });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #4FC3F7 0%, #81C784 25%, #FFB74D 50%, #BA68C8 75%, #F06292 100%)",
      }}
    >
      <PlayerProfileForm
        initialValues={{
          name: user.name ?? "",
          grade: user.grade ?? "",
          teacherName: user.teacherName ?? "",
          schoolName: user.schoolName ?? "",
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
