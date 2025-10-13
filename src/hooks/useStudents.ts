import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { addStudentApi, deleteStudentApi, getStudentsApi } from '@/api/studentsApi';
import type StudentInterface from '@/types/StudentInterface';

interface StudentsHookInterface {
  students: StudentInterface[];
  deleteStudentMutate: (studentId: number) => void;
  addStudentMutate: (student: Omit<StudentInterface, 'id' | 'isDeleted'>) => void;
}

const useStudents = (): StudentsHookInterface => {
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudentsApi(),
    enabled: false,
  });

  /**
   * Мутация добавления студента
   */
  const addStudentMutate = useMutation({
    mutationFn: async (student: Omit<StudentInterface, 'id' | 'isDeleted'>) => addStudentApi(student),
    onMutate: async (newStudentData) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      const temporaryId = -Math.floor(Math.random() * 10000);
      
      const temporaryStudent: StudentInterface = {
        id: temporaryId,
        ...newStudentData,
        isDeleted: false
      };
      
      queryClient.setQueryData<StudentInterface[]>(['students'], (oldStudents = []) => [
        ...oldStudents,
        temporaryStudent
      ]);
      
      return { previousStudents, temporaryId };
    },
    onError: (err, newStudentData, context) => {
      console.log('>>> addStudentMutate error', err);
      queryClient.setQueryData<StudentInterface[]>(['students'], context?.previousStudents);
    },
    onSuccess: (newStudent, newStudentData, context) => {
      queryClient.setQueryData<StudentInterface[]>(['students'], (oldStudents = []) => 
        oldStudents.map(student => 
          student.id === context?.temporaryId ? newStudent : student
        )
      );
    },
  });

  /**
   * Мутация удаления студента
   */
  const deleteStudentMutate = useMutation({
    mutationFn: async (studentId: number) => deleteStudentApi(studentId),
    onMutate: async (studentId: number) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      let updatedStudents = [...(previousStudents ?? [])];

      if (!updatedStudents) return;

      updatedStudents = updatedStudents.map((student: StudentInterface) => ({
        ...student,
        ...(student.id === studentId ? { isDeleted: true } : {}),
      }));
      
      queryClient.setQueryData<StudentInterface[]>(['students'], updatedStudents);
      return { previousStudents, updatedStudents };
    },
    onError: (err, variables, context) => {
      console.log('>>> deleteStudentMutate err', err);
      queryClient.setQueryData<StudentInterface[]>(['students'], context?.previousStudents);
    },
    onSuccess: async (studentId, variables, context) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      if (!context?.previousStudents) {
        return;
      }
      const updatedStudents = context.previousStudents.filter((student: StudentInterface) => student.id !== studentId);
      queryClient.setQueryData<StudentInterface[]>(['students'], updatedStudents);
    },
  });

  return {
    students: data ?? [],
    deleteStudentMutate: deleteStudentMutate.mutate,
    addStudentMutate: addStudentMutate.mutate,
  };
};

export default useStudents;