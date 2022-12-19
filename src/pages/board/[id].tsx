import { format } from "date-fns";
import firebase from "firebase/app";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

type Task = {
  id: string;
  created: string | Date;
  createdFormatted?: string;
  tarefa: string;
  userId: string;
  nome: string;
};

interface TaskDetailsProps {
  taskDetailsData: string;
}

export default function TaskDetails({ taskDetailsData }: TaskDetailsProps) {
  const task = JSON.parse(taskDetailsData) as Task;

  return (
    <div>
      <h1>Página detalhes</h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { id } = params;
  const session = await getSession({ req });

  if (!session?.id) {
    return {
      redirect: {
        destination: "/board",
        permanent: false,
      },
    };
  }

  const taskDetailsData = await firebase
    .firestore()
    .collection("tarefas")
    .doc(String(id))
    .get()
    .then((snapshot) => {
      const taskDetailsData = {
        id: snapshot.id,
        created: snapshot.data().created,
        createdFormatted: format(
          snapshot.data().created.toDate(),
          "dd MMMM yyyy"
        ),
        tarefa: snapshot.data().tarefa,
        userId: snapshot.data().userId,
        nome: snapshot.data().nome,
      };

      return JSON.stringify(taskDetailsData);
    });

  return {
    props: {
      taskDetailsData,
    },
  };
};
