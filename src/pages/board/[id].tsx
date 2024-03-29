import styles from "./task.module.scss";

import { format } from "date-fns";
import firebase from "../../services/firebaseConnection";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { FiCalendar } from "react-icons/fi";

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
    <>
      <Head>
        <title>Detalhes da sua tarefa</title>
      </Head>
      <article className={styles.container}>
        <div className={styles.actions}>
          <div>
            <FiCalendar size={30} color="#FFF" />
            <span>Tarefa criada:</span>
            <time>{task.createdFormatted}</time>
          </div>
        </div>
        <p>{task.tarefa}</p>
      </article>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { id } = params;
  const session = await getSession({ req });

  if (!session?.vip) {
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
    })
    .catch(() => {
      return {};
    });

  if (Object.keys(taskDetailsData).length === 0) {
    return {
      redirect: {
        destination: "/board",
        permanent: false,
      },
    };
  }

  return {
    props: {
      taskDetailsData,
    },
  };
};
