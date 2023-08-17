export const getStudentDetailsService = (studentId) => {
  return (
    "https://localhost:7196/api/Student/GetStudentDetailsReport/" + studentId
  );
};

export default getStudentDetailsService;
