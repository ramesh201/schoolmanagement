export const getTeacherSubjectsService = (teacherId) => {
  return (
    "https://localhost:7196/api/TeacherSubject/GetAllTeacherSubjects/" +
    teacherId
  );
};

export default getTeacherSubjectsService;
