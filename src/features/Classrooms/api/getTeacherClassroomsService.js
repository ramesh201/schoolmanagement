export const getTeacherClassroomsService = (teacherId) => {
  return (
    "https://localhost:7196/api/TeacherClassroom/GetAllTeacherClassrooms/" +
    teacherId
  );
};

export default getTeacherClassroomsService;
