'use client';

import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';
import styles from './Students.module.scss';
import Student from './Student/Student';
import AddStudent from './AddStudent/AddStudent';

const Students = (): React.ReactElement => {
  const { students, deleteStudentMutate, addStudentMutate } = useStudents();

  const onDeleteHandler = (studentId: number): void => {
    deleteStudentMutate(studentId);
  };

  const onAddStudentHandler = (studentData: Omit<StudentInterface, 'id' | 'isDeleted'>): void => {
    addStudentMutate(studentData);
  };

  return (
    <div className={styles.Students}>
      {/* добавление студента */}
      <AddStudent onAddStudent={onAddStudentHandler} />
      
      {/* список студентов */}
      <div className={styles.studentsList}>
        <h3>Список студентов</h3> {}
        {students.length === 0 ? (
          <p>Нет студентов</p>
        ) : (
          students.map((student: StudentInterface) => (
            <Student
              key={student.id}
              student={student}
              onDelete={onDeleteHandler}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Students;