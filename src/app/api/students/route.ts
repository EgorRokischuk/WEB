import { getStudentsDb } from '@/db/studentDb';
import { addStudentDb } from '@/db/studentDb';
import type StudentInterface from '@/types/StudentInterface';

export async function GET(): Promise<Response> {
  const students = await getStudentsDb();

  return new Response(JSON.stringify(students), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const studentData: Omit<StudentInterface, 'id' | 'isDeleted'> = await request.json();
    const newStudent = await addStudentDb(studentData);
    
    return new Response(JSON.stringify(newStudent), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Ошибка при добавлении студента' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}