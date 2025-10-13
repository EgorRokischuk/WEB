'use client';

import { useForm } from 'react-hook-form';
import type StudentInterface from '@/types/StudentInterface';
import type GroupInterface from '@/types/GroupInterface';
import styles from './AddStudent.module.scss';

interface Props {
  onAddStudent: (student: Omit<StudentInterface, 'id' | 'isDeleted'>) => void;
  groups: GroupInterface[]; 
}

interface FormData {
  firstName: string;
  lastName: string;
  middleName: string;
  groupId: string;
}

const AddStudent = ({ onAddStudent, groups }: Props): React.ReactElement => {
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

        <select
          {...register('groupId', { required: true })}
          className={styles.select}
        >
          <option value="">Выберите группу</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        <button type="submit" className={styles.button}>
          Добавить студента
        </button>
      </form>
    </div>
  );
};

export default AddStudent;