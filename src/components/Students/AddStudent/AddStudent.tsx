'use client';

import { useForm } from 'react-hook-form';
import type StudentInterface from '@/types/StudentInterface';
import styles from './AddStudent.module.scss';

interface Props {
  onAddStudent: (student: Omit<StudentInterface, 'id' | 'isDeleted'>) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  middleName: string;
  groupId: string;
}

const AddStudent = ({ onAddStudent }: Props): React.ReactElement => {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>();

  const onSubmit = (data: FormData): void => {
    onAddStudent({
      ...data,
      groupId: Number(data.groupId)
    });
    reset();
  };

  return (
    <div className={styles.AddStudent}>
      <h3 className={styles.title}>Добавить студента</h3>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <input
          placeholder="Фамилия"
          {...register('lastName', { required: true })}
          className={styles.input}
        />
        
        <input
          placeholder="Имя"
          {...register('firstName', { required: true })}
          className={styles.input}
        />
        
        <input
          placeholder="Отчество"
          {...register('middleName', { required: true })}
          className={styles.input}
        />

        <input
          placeholder="ID группы"
          type="number"
          {...register('groupId', { required: true })}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Добавить студента
        </button>
      </form>
    </div>
  );
};

export default AddStudent;