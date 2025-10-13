'use client';

import useStudents from '@/hooks/useStudents';
import useGroups from '@/hooks/useGroups';
import type StudentInterface from '@/types/StudentInterface';
import styles from './Students.module.scss';
import Student from './Student/Student';
import AddStudent from './AddStudent/AddStudent';

const Students = (): React.ReactElement => {
  const { students, deleteStudentMutate, addStudentMutate } = useStudents();
  const { groups, isLoading } = useGroups();

  const onDeleteHandler = (studentId: number): void => {
    deleteStudentMutate(studentId);
  };

  const onAddStudentHandler = (studentData: Omit<StudentInterface, 'id' | 'isDeleted'>): void => {
    addStudentMutate(studentData);
  };

  // Функция для получения студентов по группе
  const getStudentsByGroup = (groupId: number): StudentInterface[] => {
    return students.filter(student => student.groupId === groupId);
  };

  if (isLoading) {
    return <div>Загрузка групп...</div>;
  }

  return (
    <div className={styles.Students}>
      {/* добавление студента */}
      <AddStudent onAddStudent={onAddStudentHandler} groups={groups} />
      
      {/* список студентов по группам */}
      <div className={styles.groupsList}>
        <h3>Список студентов по группам</h3>
        
        {groups.map(group => {
          const groupStudents = getStudentsByGroup(group.id);
          
          return (
            <div key={group.id} className={styles.group}>
              <h4 className={styles.groupHeader}>
                {group.name} ({groupStudents.length} студентов)
              </h4>
              
              <div className={styles.studentsInGroup}>
                {groupStudents.length === 0 ? (
                  <p className={styles.emptyGroup}>Нет студентов в этой группе</p>
                ) : (
                  groupStudents.map(student => (
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
        })}
      </div>
    </div>
  );
};

export default Students;